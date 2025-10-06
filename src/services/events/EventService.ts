import type { Event, EventHistory, EventCategory } from "@/components/event/types/event"
import { EventStatus } from "@/components/event/types/event"
import type { Organizer } from "@/components/organizer/types/organizer"
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
  where,
  type DocumentData,
  type DocumentSnapshot,
  type Firestore,
} from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

function initFirebase() {
  console.log("EventService: Inicializando Firebase...")
  const config = firebaseConfig
  const app = initializeApp(config)
  const authFirestore = getAuth(app)
  const dbFirestore = getFirestore(app)
  const storage = getStorage(app)

  console.log("EventService: Firebase inicializado com sucesso")
  return { authFirestore, dbFirestore, storage }
}

const { dbFirestore, authFirestore, storage } = initFirebase()
console.log("EventService: dbFirestore:", dbFirestore)

// Função para limpar campos undefined/null
function cleanEventData(data: any): any {
  const cleaned = { ...data }
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === undefined || cleaned[key] === null) {
      delete cleaned[key]
    }
  })
  return cleaned
}

// Event Services
async function addEvent(db: Firestore, eventData: Omit<Event, 'id'>): Promise<string> {
  // Gerar um ID único para o evento
  const eventId = `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  
  const event: Event = {
    ...eventData,
    id: eventId
  }
  
  // Limpar campos undefined antes de salvar
  const cleanedEvent = cleanEventData(event)
  
  const eventRef = doc(db, "events", eventId)
  await setDoc(eventRef, cleanedEvent)

  // Criar o status inicial como "Ativo" ao adicionar um evento
  await addEventStatusChange(event.id, EventStatus.ACTIVE, "Evento publicado inicialmente", event.organizerEmail)
  
  return eventId
}

async function updateEvent(db: Firestore, eventId: string, updatedData: Partial<Event>): Promise<void> {
  const eventRef = doc(db, "events", eventId)
  await updateDoc(eventRef, updatedData)
}

async function removeEvent(db: Firestore, eventId: string): Promise<void> {
  const eventRef = doc(db, "events", eventId)
  await deleteDoc(eventRef)
}

async function getEvents(db: Firestore) {
  console.log("getEvents: Iniciando busca de eventos...")
  const eventsRef = collection(db, "events")
  // Simplificar query para evitar necessidade de índice
  const querySnapshot = await getDocs(eventsRef)
  
  console.log("getEvents: QuerySnapshot size:", querySnapshot.size)
  const events = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  console.log("getEvents: Eventos encontrados:", events)
  
  return events
}

async function getEventsByOrganizer(db: Firestore, organizerEmail: string) {
  const eventsRef = collection(db, "events")
  // Simplificar query para evitar necessidade de índice
  const querySnapshot = await getDocs(eventsRef)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })).filter(event => event.organizerEmail === organizerEmail)
}

async function getActiveEvents(db: Firestore) {
  const eventsRef = collection(db, "events")
  // Simplificar query para evitar necessidade de índice
  const querySnapshot = await getDocs(eventsRef)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })).filter(event => event.status === "active" || event.status === "published")
}

// Event Interactions
const updateEventInterest = async (db: Firestore, eventId: string, userEmail: string) => {
  try {
    const eventRef = doc(db, "events", eventId)
    await updateDoc(eventRef, {
      interestedBy: arrayUnion(userEmail),
    })
  } catch (error) {
    console.error("Erro ao atualizar interesse no evento:", error)
    throw error
  }
}

const updateEventAttendance = async (db: Firestore, eventId: string, userEmail: string) => {
  try {
    const eventRef = doc(db, "events", eventId)
    await updateDoc(eventRef, {
      attendedBy: arrayUnion(userEmail),
      currentAttendees: arrayUnion(userEmail).length,
    })
  } catch (error) {
    console.error("Erro ao atualizar participação no evento:", error)
    throw error
  }
}

// Event Status Management
async function addEventStatusChange(
  eventId: string,
  status: EventStatus,
  comment: string | undefined,
  updatedBy: string
): Promise<string> {
  const db = getFirestore()

  const statusChangeData = {
    status,
    timestamp: serverTimestamp(),
    comment: comment || null, // Converter undefined para null
    updatedBy
  }

  // Adiciona ao subcollection 'eventHistory'
  const docRef = await addDoc(
    collection(db, 'events', eventId, 'eventHistory'),
    statusChangeData
  )

  // Atualiza o campo status no documento principal do evento
  const eventRef = doc(db, 'events', eventId)
  await updateDoc(eventRef, {
    status: status
  })

  return docRef.id
}

async function updateEventStatus(
  eventId: string,
  newStatus: EventStatus,
  comment: string | undefined,
  updatedBy: string
): Promise<void> {
  const db = getFirestore()

  await updateDoc(doc(db, 'events', eventId), {
    status: newStatus
  })

  await addEventStatusChange(eventId, newStatus, comment, updatedBy)
}

async function getEventStatusHistory(eventId: string) {
  const db = getFirestore()
  const historyRef = collection(db, 'events', eventId, 'eventHistory')

  const q = query(historyRef, orderBy('timestamp', 'desc'))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as EventHistory[]
}

// Organizer Services
async function createOrUpdateOrganizer(db: Firestore, organizer: Organizer): Promise<void> {
  const organizerRef = doc(db, "organizers", organizer.email)
  await setDoc(organizerRef, organizer, { merge: true })
}

async function getOrganizer(db: Firestore, email: string): Promise<Organizer | null> {
  try {
    const organizerRef = doc(db, "organizers", email)
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(organizerRef)

    if (docSnap.exists()) {
      return docSnap.data() as Organizer
    }
    return null
  } catch (error) {
    console.error("Error fetching organizer data:", error)
    return null
  }
}

// Image Upload
async function uploadEventImage(file: File, eventId: string): Promise<string> {
  try {
    const storageRef = ref(storage, `events/${eventId}/${file.name}`)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

// User Services (mantidos do sistema original)
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

export {
  addEvent,
  updateEvent,
  removeEvent,
  getEvents,
  getEventsByOrganizer,
  getActiveEvents,
  updateEventInterest,
  updateEventAttendance,
  addEventStatusChange,
  updateEventStatus,
  getEventStatusHistory,
  createOrUpdateOrganizer,
  getOrganizer,
  uploadEventImage,
  fetchUserData,
  dbFirestore,
  authFirestore,
  storage
}

export type { Event, EventHistory, EventStatus, EventCategory, Organizer, UserData }
