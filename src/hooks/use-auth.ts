import {
  handleAuthResponse,
  signInWithGoogle,
  signOutFromGoogle,
} from "@/services/auth/NextAuthenticationService";
import {
  authFirestore,
  dbFirestore,
  fetchUserData,
  initUserFirebase,
  UserData,
} from "@/services/firebase/FirebaseService";
import { Auth, onAuthStateChanged } from "firebase/auth";
import { Firestore } from 'firebase/firestore';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useAuth() {
  // Definir loading como true inicialmente para evitar flashes de conteúdo
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const { data: session, status } = useSession();
  
  // Recuperar usuário do localStorage apenas no cliente
  const [user, setUser] = useState<UserData | null>(null);
  
  // Efeito para inicializar o usuário do localStorage (apenas lado cliente)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const localStorageUser = localStorage.getItem("user");
      if (localStorageUser) {
        const parsedUser = JSON.parse(localStorageUser);
        if (parsedUser && parsedUser.email) {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error("Erro ao ler do localStorage:", error);
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Salvar a página atual antes do login
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        localStorage.setItem('redirectAfterLogin', currentPath);
      }
      
      await signInWithGoogle();
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOutFromGoogle();
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("redirectAfterLogin");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para sincronizar com a sessão do NextAuth
  useEffect(() => {
    const initializeAuth = async () => {
      if (status === "loading") return;
      
      if (status === "authenticated" && session) {
        try {
          const userData = await handleAuthResponse(session, dbFirestore);
          if (userData) {
            setUser(userData);
            // Salvar no localStorage para persistência entre navegações
            if (typeof window !== 'undefined') {
              localStorage.setItem("user", JSON.stringify(userData));
              
              // Redirecionar para a página anterior se existir
              const redirectPath = localStorage.getItem('redirectAfterLogin');
              if (redirectPath && redirectPath !== '/user' && redirectPath !== '/login') {
                localStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectPath;
              }
            }
          }
        } catch (error) {
          console.error("Erro ao processar autenticação:", error);
        }
      } else if (status === "unauthenticated") {
        // Limpar usuário quando não autenticado
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem("user");
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, [session, status]);

  // Efeito para inicializar o Firebase
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        const firebaseInstance = await initUserFirebase(authFirestore, dbFirestore);
        if (firebaseInstance) {
          setAuth(firebaseInstance.authFirestore);
          setDb(firebaseInstance.dbFirestore);
        } else {
          console.error("Falha na inicialização do Firebase");
        }
      } catch (error) {
        console.error("Erro ao inicializar Firebase:", error);
      }
    };

    initializeFirebase();
  }, []);

  // Efeito para observar mudanças no estado de autenticação do Firebase
  useEffect(() => {
    if (!auth) return;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (db) {
          try {
            const userData = await fetchUserData(db, firebaseUser.email!);
            if (userData) {
              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
              
              // Redirecionar para a página anterior se existir
              if (typeof window !== 'undefined') {
                const redirectPath = localStorage.getItem('redirectAfterLogin');
                if (redirectPath && redirectPath !== '/user') {
                  localStorage.removeItem('redirectAfterLogin');
                  window.location.href = redirectPath;
                }
              }
            }
          } catch (error) {
            console.error("Erro ao obter dados do usuário:", error);
          }
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  return { user, loading, status, handleLogin, handleLogout };
}
