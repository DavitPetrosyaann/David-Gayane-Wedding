import { getFirebaseClientServices } from '@prezento/modules-and-packages/firebase/client';

export const { app, auth, firestore, storage } = getFirebaseClientServices();
