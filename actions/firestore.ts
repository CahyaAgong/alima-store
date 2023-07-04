import firebaseConfig from '@/config/firebase';
import {
  getFirestore,
  doc,
  addDoc,
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

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { saveCurrentUser } from './localstorage';
import { Medicine } from '@/types';

const db = getFirestore(firebaseConfig);

const obatCollection = 'obat';

const storage = getStorage();

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
  stock: number,
  imgFile: File | null
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

      let imageUrl = null;

      const obatData = {
        id: '',
        medicine_name: namaObat,
        price: harga,
        stock,
        image: imageUrl,
      };
      const newMedicineRef = await addDoc(obatCollectionRef, obatData);

      const newObatID = newMedicineRef.id;

      if (imgFile) {
        const imageRef = ref(storage, `medicine/${newObatID}/${imgFile.name}`);
        await uploadBytes(imageRef, imgFile);

        imageUrl = await getDownloadURL(imageRef);
      }

      await setDoc(
        newMedicineRef,
        { ...obatData, id: newObatID, image: imageUrl },
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

export const deleteMedicine = async (idObat: string) => {
  let result: string | any = null,
    error: Error | any = null;
  try {
    const obatDocRef = doc(collection(db, obatCollection), idObat);
    await deleteDoc(obatDocRef);
    result = 'Data obat berhasil dihapus';
  } catch (err) {
    error = err;
    return error;
  }

  return { result, error };
};

export const updateMedicine = async (
  id: string,
  updatedData: Medicine,
  imgFile: File | null
) => {
  let result: String | any = null,
    error: Error | any = null;

  try {
    const obatDocRef = doc(db, obatCollection, id);

    if (imgFile) {
      const imageRef = ref(storage, `medicine/${id}/${imgFile.name}`);
      await uploadBytes(imageRef, imgFile);

      const imageUrl = await getDownloadURL(imageRef);
      updatedData.image = imageUrl;
    }

    const convertedData: { [key: string]: any } = {};
    Object.entries(updatedData).forEach(([key, value]) => {
      convertedData[key] = value;
    });

    await updateDoc(obatDocRef, convertedData);
    result = `Data obat berhasil diperbarui`;
  } catch (err) {
    error = err;
    return error;
  }

  return { result, error };
};
