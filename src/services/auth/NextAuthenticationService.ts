import { UserData } from "@/components/user/types/user";
import { SubscriptionPlan, SubscriptionStatus } from "@/types/subscription";
import { doc, Firestore, setDoc, updateDoc } from "firebase/firestore";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { fetchUserData } from "../firebase/FirebaseService";

/**
 * Inicia o processo de login com o Google
 */
async function signInWithGoogle(): Promise<void> {
  try {
    // Salvar a página atual no localStorage
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      localStorage.setItem('redirectAfterLogin', currentPath);
    }
    
    await signIn("google", { callbackUrl: "/user" });
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
}

/**
 * Realiza o logout e remove os dados do usuário do localStorage
 */
async function signOutUser(): Promise<void> {
  try {
    // Garantir que os dados do usuário sejam removidos do localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user");
      localStorage.removeItem("redirectAfterLogin");
    }
    await signOut({ callbackUrl: "/" });
  } catch (error) {
    console.error("Error during sign out:", error);
    throw error;
  }
}

/**
 * Processa a resposta de autenticação e salva os dados do usuário
 */
async function handleAuthResponse(session: Session | null, db: Firestore): Promise<UserData | null> {
  if (!session?.user?.email) return null;

  try {
    const email = session.user.email;
    let userData = await fetchUserData(db, email);

    if (!userData) {
      // Criar novo usuário se não existir
      const now = new Date()
      userData = {
        displayName: session.user.name || "",
        email: email,
        photoURL: session.user.image || "",
        credits: { value: 0, updatedAt: now },
        currency: { value: 0, updatedAt: now },
        // Inicializar com plano Visitante (gratuito)
        subscription: {
          plan: SubscriptionPlan.VISITOR,
          status: SubscriptionStatus.INACTIVE,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          startDate: null,
          endDate: null,
          renewalDate: null,
          cancelledAt: null,
          gracePeriodEnd: null,
          eventsCreatedThisMonth: 0,
          eventsLimit: 0,
          lastEventCountReset: now,
          highlightsUsedThisMonth: 0,
          highlightsLimit: 0,
          recurringSeriesCount: 0,
          recurringSeriesLimit: 0,
        },
        paymentHistory: {
          totalSpent: 0,
          lastPaymentDate: null,
          lastPaymentAmount: 0,
        },
        preferences: {
          brandColor: null,
          brandLogo: null,
          notificationsEnabled: true,
          emailMarketing: false,
        },
        createdAt: now,
        updatedAt: now,
      };

      const userRef = doc(db, "users", email);
      await setDoc(userRef, userData);
      console.log("Novo usuário criado no Firestore:", userData);
    } else if (session.user.image && userData.photoURL !== session.user.image) {
      // Atualizar a foto de perfil se mudar
      const userRef = doc(db, "users", email);
      await updateDoc(userRef, { photoURL: session.user.image });
      userData.photoURL = session.user.image;
    }

    // Persistir dados no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Redirecionar para a página anterior se existir
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath && redirectPath !== '/user') {
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectPath;
      }
    }
    
    return userData;
  } catch (error) {
    console.error("Error handling auth response:", error);
    return null;
  }
}

export {
  handleAuthResponse, signInWithGoogle,
  signOutUser as signOutFromGoogle
};

export type { UserData };

