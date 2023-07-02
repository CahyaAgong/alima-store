import firebaseConfig from '@/config/firebase';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  runTransaction,
  query,
  where,
  deleteDoc,
  updateDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { saveCurrentUser } from './localstorage';

const db = getFirestore(firebaseConfig);

const obatCollection = 'obat';

export const addUser = async (collection: string, id: string, data: {}) => {
  let result = null,
    error = null;

  try {
    result = await setDoc(doc(db, collection, id), data, { merge: true });
    saveCurrentUser('currentUser', JSON.stringify(data));
  } catch (err) {
    error = err;
  }

  return { result, error };
};

export const getUserLogged = async (collection: string, id: string) => {
  let documentRef = doc(db, collection, id);
  let userLogged = null,
    error = null;

  try {
    let result = await getDoc(documentRef);
    if (result.exists()) {
      userLogged = result.data();
    } else {
      userLogged = { message: 'user not found' };
    }

    saveCurrentUser('currentUser', JSON.stringify(userLogged));
  } catch (err) {
    error = err;
  }

  return { userLogged, error };
};

export const getMedicines = async (collectionName: string) => {
  let documentRef = collection(db, collectionName);
  let result: any[] = [],
    error: Error | any = null;

  try {
    let res = await getDocs(documentRef);
    res.forEach(doc => {
      result.push(doc.data());
    });
  } catch (err) {
    error = err;
  }

  return {
    result,
    error,
  };
};

export const subscribeToMedicinesChanges = (
  callback: (medicines: any[]) => void
): Unsubscribe => {
  const documentRef = collection(db, 'obat');
  const unsubscribe = onSnapshot(documentRef, snapshot => {
    const updatedMedicines: any[] = [];
    snapshot.forEach(doc => {
      updatedMedicines.push(doc.data());
    });
    callback(updatedMedicines);
  });

  return unsubscribe;
};

export const unsubscribeFromMedicinesChanges = (unsubscribe: Unsubscribe) => {
  unsubscribe();
};

export const addMedicine = async (
  namaObat: string,
  harga: string,
  stock: number
) => {
  let result: String | any = null,
    error: Error | any = null;

  const obatCollectionRef = collection(db, obatCollection);
  const obatQuery = query(
    obatCollectionRef,
    where('medicine_name', '==', namaObat)
  );

  try {
    await runTransaction(db, async () => {
      const obatSnapshot = await getDocs(obatQuery);

      if (!obatSnapshot.empty) {
        return (error = new Error('Data obat sudah ada.'));
      }

      const newObatDocRef = doc(obatCollectionRef, namaObat);
      await setDoc(
        newObatDocRef,
        { medicine_name: namaObat, price: harga, stock },
        { merge: true }
      );
      result = 'Data obat berhasil ditambahkan.';
    });
  } catch (err) {
    error = err;
    return error;
  }

  return { result, error };
};

export const deleteMedicine = async (namaObat: string) => {
  let result: string | any = null,
    error: Error | any = null;
  try {
    const obatDocRef = doc(collection(db, obatCollection), namaObat);
    await deleteDoc(obatDocRef);
    result = 'Data obat berhasil dihapus';
  } catch (err) {
    error = err;
    return error;
  }

  return { result, error };
};

export const updateMedicine = async (id: string, updatedData: {}) => {
  let result: String | any = null,
    error: Error | any = null;
  try {
    const obatDocRef = doc(db, obatCollection, id);
    await updateDoc(obatDocRef, updatedData);
    result = `Data obat berhasil diperbarui`;
  } catch (err) {
    error = err;
    return error;
  }

  return { result, error };
};
