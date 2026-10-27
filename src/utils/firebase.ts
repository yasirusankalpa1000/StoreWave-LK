import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, Order, StoreSettings, StoreTheme, TenantStore } from '../types/store';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Error handling helper required by skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

// Store & Merchant Cloud Sync Functions
export interface CloudStoreRecord {
  id: string;
  slug: string;
  name: string;
  ownerEmail: string;
  ownerName: string;
  password?: string; // Stored securely for merchant authentication
  settings: StoreSettings;
  theme: StoreTheme;
  products: Product[];
  orders: Order[];
  createdAt: string;
  updatedAt: string;
}

// Sanitize doc ID
export function sanitizeDocId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 100);
}

// Fetch store from Firestore by slug or ID
export async function getStoreFromCloud(storeIdOrSlug: string): Promise<CloudStoreRecord | null> {
  const sanitized = sanitizeDocId(storeIdOrSlug);
  try {
    const docRef = doc(db, 'stores', sanitized);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as CloudStoreRecord;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `stores/${sanitized}`);
  }
  return null;
}

// Find store by email from Cloud
export async function getStoreByEmailFromCloud(email: string): Promise<CloudStoreRecord | null> {
  const sanitizedId = sanitizeDocId(email.toLowerCase().replace(/[^a-z0-9]/g, '-'));
  return getStoreFromCloud(sanitizedId);
}

// Save or Update entire store record to Cloud
export async function saveStoreToCloud(storeRecord: CloudStoreRecord): Promise<boolean> {
  const sanitized = sanitizeDocId(storeRecord.id);
  try {
    const docRef = doc(db, 'stores', sanitized);
    await setDoc(docRef, {
      ...storeRecord,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `stores/${sanitized}`);
    return false;
  }
}

// Save new order directly to Cloud
export async function saveOrderToCloud(storeId: string, order: Order): Promise<boolean> {
  const sanitizedStoreId = sanitizeDocId(storeId);
  const sanitizedOrderId = sanitizeDocId(order.id);
  try {
    const orderDocRef = doc(db, 'stores', sanitizedStoreId, 'orders', sanitizedOrderId);
    await setDoc(orderDocRef, {
      ...order,
      storeId: sanitizedStoreId,
      createdAt: order.createdAt || new Date().toISOString()
    });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `stores/${sanitizedStoreId}/orders/${sanitizedOrderId}`);
    return false;
  }
}
