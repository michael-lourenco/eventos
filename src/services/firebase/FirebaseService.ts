import type { Marker, StatusChange } from "@/components/marker/types/marker"
import type { UserData } from "@/components/user/types/user"
import { initializeApp } from "firebase/app"
import { browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence, type Auth } from "firebase/auth"
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type DocumentSnapshot,
  type Firestore,
} from "firebase/firestore"


export enum ProblemStatus {
  REPORTED = "Reportado",
  UNDER_ANALYSIS = "Em Análise",
  VERIFIED = "Verificado",
  IN_PROGRESS = "Em Andamento",
  RESOLVED = "Resolvido",
  CLOSED = "Fechado",
  REOPENED = "Reaberto",
  // Adicione outros conforme necessário
}

export interface FirestoreTimestamp {
  toDate: () => Date
  seconds: number
  nanoseconds: number
}

export interface UserMarker {
  id: string
  lat: number
  lng: number
  type: string
  createdAt: Date
}

let globalUser: UserData | null = null

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

function initFirebase() {
  const config = firebaseConfig

  const app = initializeApp(config)
  const authFirestore = getAuth(app)
  const dbFirestore = getFirestore(app)

  return { authFirestore, dbFirestore }
}

const { dbFirestore, authFirestore } = initFirebase()
async function initUserFirebase(authFirestore: Auth, dbFirestore: Firestore) {
  await setPersistence(authFirestore, browserLocalPersistence)

  await setPersistence(authFirestore, browserLocalPersistence)

  onAuthStateChanged(authFirestore, async (user) => {
    if (user) {
      globalUser = await fetchUserData(dbFirestore, user.email!)
      if (globalUser) {
        localStorage.setItem("user", JSON.stringify(globalUser))
        displayUserInfo(globalUser)
      } else {
        console.error("User not found in 'users' collection.")
      }
    }
  })

  return { authFirestore, dbFirestore }
}

async function fetchUserData(db: Firestore, email: string): Promise<UserData | null> {
  try {
    const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email)
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(userRef)

    if (docSnap.exists()) {
      return docSnap.data() as UserData
    }
    return null
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}

async function updateMarkers(db: Firestore, markerId: string, updatedData: Partial<Marker>): Promise<void> {
  const markerRef = doc(db, "markers", markerId)
  await updateDoc(markerRef, updatedData)
}

async function updateUserMarker(
  db: Firestore,
  email: string,
  markerId: string,
  updatedData: Partial<UserMarker>,
): Promise<void> {
  const markerRef = doc(db, `users/${email}/markers`, markerId)
  await updateDoc(markerRef, updatedData)
}

async function addMarker(db: Firestore, marker: Marker): Promise<void> {
  const markerRef = doc(db, "markers", marker.id)
  await setDoc(markerRef, marker)

  // Criar o status inicial como "Reportado" ao adicionar um marcador
  await addStatusChange(marker.id, ProblemStatus.REPORTED, "Problema reportado inicialmente", marker.userEmail)
}

async function addUserMarker(db: Firestore, email: string, marker: UserMarker): Promise<void> {
  const markerRef = doc(db, `users/${email}/markers`, marker.id)
  await setDoc(markerRef, marker)
}

async function removeMarker(db: Firestore, markerId: string): Promise<void> {
  const markerRef = doc(db, "markers", markerId)
  await deleteDoc(markerRef)
}

async function removeUserMarker(db: Firestore, email: string, markerId: string): Promise<void> {
  const markerRef = doc(db, `users/${email}/markers`, markerId)
  await deleteDoc(markerRef)
}

async function getMarkers(db: Firestore) {
  const markersRef = collection(db, "markers")
  const querySnapshot = await getDocs(markersRef)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

async function getUserMarkers(db: Firestore, email: string) {
  const userMarkersRef = collection(db, `users/${email}/markers`)
  const querySnapshot = await getDocs(userMarkersRef)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

async function updateUserCredits(email: string, value: number, db: Firestore): Promise<void> {
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email)

  try {
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()

      let currentCredits = userData.credits?.value || 0

      if (currentCredits < 0) {
        currentCredits = 0
      }
      console.log("currentCredits", currentCredits)
      if (currentCredits >= 0) {
        await setDoc(
          userRef,
          {
            credits: {
              value: currentCredits + value,
              updatedAt: new Date().toISOString(),
            },
          },
          { merge: true },
        )
        console.log("User credits updated successfully.")
      } else {
        console.log("New credit is not done. No update performed.")
      }
    } else {
      await setDoc(userRef, {
        credits: { value: value, updatedAt: new Date() },
      })
      console.log("User document created with credits.")
    }
  } catch (error) {
    console.error("Error updating user credits:", error)
  }
}
async function updateUserCurrency(email: string, value: number, db: Firestore): Promise<void> {
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email)

  try {
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()

      const currentCurrency = userData.currency?.value || 0
      if (value > 0) {
        await setDoc(
          userRef,
          {
            currency: {
              value: currentCurrency + value,
              updatedAt: new Date().toISOString(),
            },
          },
          { merge: true },
        )
        console.log("User best score updated successfully.")
      } else {
        console.log("New score is not higher. No update performed.")
      }
    } else {
      await setDoc(userRef, {
        currency: { value: value, updatedAt: new Date() },
      })
      console.log("User document created with best score.")
    }
  } catch (error) {
    console.error("Error updating user best score:", error)
  }
}

function displayUserInfo(user: UserData): void {
  console.log(`User: ${user.displayName}, Currency: ${user.currency.value}, Photo URL: ${user.photoURL}`)
}

const updateMarkerLikes = async (dbFirestore: Firestore, markerId: string, userEmail: string) => {
  try {
    const markerRef = doc(dbFirestore, "markers", markerId)

    await updateDoc(markerRef, {
      likedBy: arrayUnion(userEmail),
    })
  } catch (error) {
    console.error("Erro ao atualizar likes do marcador:", error)
    throw error
  }
}

const updateMarkerResolved = async (dbFirestore: Firestore, markerId: string, userEmail: string) => {
  try {
    const markerRef = doc(dbFirestore, "markers", markerId)

    await updateDoc(markerRef, {
      resolvedBy: arrayUnion(userEmail),
    })

    const markerRefAfter = doc(dbFirestore, "markers", markerId)

    const markerSnapshot = await getDoc(markerRef)
    const markerData = markerSnapshot.data()

    if (markerData?.resolvedBy?.length >= 1) {
      await addStatusChange(markerId, ProblemStatus.RESOLVED, "Problema resolvido", userEmail)
    }
  } catch (error) {
    console.error("Erro ao atualizar likes do marcador:", error)
    throw error
  }
}

async function addStatusChange(
  markerId: string,
  status: ProblemStatus,
  comment: string | undefined,
  updatedBy: string
): Promise<string> {
  const db = getFirestore();

  const statusChangeData = {
    status,
    timestamp: serverTimestamp(),
    comment,
    updatedBy
  };

  // Adiciona ao subcollection 'statusHistory'
  const docRef = await addDoc(
    collection(db, 'markers', markerId, 'statusHistory'),
    statusChangeData
  );

  // Atualiza o campo currentStatus no documento principal do marcador
  const markerRef = doc(db, 'markers', markerId);
  await updateDoc(markerRef, {
    currentStatus: status
  });

  return docRef.id;
}


async function updateMarkerStatus(
  markerId: string,
  newStatus: ProblemStatus,
  comment: string | undefined,
  updatedBy: string
): Promise<void> {
  const db = getFirestore();

  await updateDoc(doc(db, 'markers', markerId), {
    currentStatus: newStatus
  });

  await addStatusChange(markerId, newStatus, comment, updatedBy);
}

async function getMarkerStatusHistory(markerId: string) {
  const db = getFirestore();
  const historyRef = collection(db, 'markers', markerId, 'statusHistory');

  const q = query(historyRef, orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as StatusChange[];
}

async function removeAnonymousMarkers(db: Firestore): Promise<{ count: number, removedIds: string[] }> {
  const markersRef = collection(db, "markers");
  const querySnapshot = await getDocs(markersRef);

  const anonymousMarkers = querySnapshot.docs.filter(doc => {
    const data = doc.data();
    return data.userEmail && typeof data.userEmail === 'string' &&
      data.userEmail.includes("Usuário anônimo");
  });

  const removedIds: string[] = [];

  // Delete each anonymous marker
  for (const markerDoc of anonymousMarkers) {
    const markerId = markerDoc.id;

    // First delete all subcollections (statusHistory)
    const statusHistoryRef = collection(db, 'markers', markerId, 'statusHistory');
    const statusSnapshot = await getDocs(statusHistoryRef);

    for (const statusDoc of statusSnapshot.docs) {
      await deleteDoc(doc(db, 'markers', markerId, 'statusHistory', statusDoc.id));
    }

    // Then delete the marker document itself
    await deleteDoc(doc(db, 'markers', markerId));
    removedIds.push(markerId);
  }

  return {
    count: removedIds.length,
    removedIds
  };
}

async function removeMarkersByEmail(db: Firestore, email: string): Promise<{ count: number, removedIds: string[] }> {
  if (!email || typeof email !== 'string') {
    throw new Error('E-mail inválido: deve ser uma string não vazia');
  }

  const markersRef = collection(db, "markers");
  const querySnapshot = await getDocs(markersRef);

  const targetMarkers = querySnapshot.docs.filter(doc => {
    const data = doc.data();
    return data.userEmail && typeof data.userEmail === 'string' &&
      data.userEmail === email;
  });

  const removedIds: string[] = [];

  for (const markerDoc of targetMarkers) {
    const markerId = markerDoc.id;

    const statusHistoryRef = collection(db, 'markers', markerId, 'statusHistory');
    const statusSnapshot = await getDocs(statusHistoryRef);

    for (const statusDoc of statusSnapshot.docs) {
      await deleteDoc(doc(db, 'markers', markerId, 'statusHistory', statusDoc.id));
    }

    await deleteDoc(doc(db, 'markers', markerId));
    removedIds.push(markerId);
  }

  return {
    count: removedIds.length,
    removedIds
  };
}

export {
  addMarker, addStatusChange, addUserMarker, authFirestore,
  dbFirestore,
  displayUserInfo,
  fetchUserData,
  getMarkers,
  getMarkerStatusHistory,
  getUserMarkers,
  initFirebase,
  initUserFirebase, removeAnonymousMarkers, removeMarker, removeMarkersByEmail,
  removeUserMarker, updateMarkerLikes,
  updateMarkerResolved, updateMarkers, updateMarkerStatus, updateUserCredits,
  updateUserCurrency, updateUserMarker
}

export type { UserData }
