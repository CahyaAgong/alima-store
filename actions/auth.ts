import firebaseApp from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from 'firebase/auth';
import { addUser, db, getUserLogged } from './firestore';
import { User, resultRequest } from '@/types';
import { query, collection, where, getDocs } from 'firebase/firestore';

const auth = getAuth(firebaseApp);

export async function Authentication(
  email: string,
  password: string,
  type: string
) {
  let mailMasking = '@mail.com';
  let result: resultRequest | any = null;
  let error: any = null;
  try {
    type === 'signup'
      ? await createUserWithEmailAndPassword(
          auth,
          email + mailMasking,
          password
        ).then(registeredUser => {
          addUser('users', registeredUser.user.uid, {
            username: email,
            email: email + mailMasking,
            uid: registeredUser.user.uid,
            role: 2,
          });
        })
      : await signInWithEmailAndPassword(
          auth,
          email + mailMasking,
          password
        ).then(async loggedUser => {
          const currentUser = await getUserLogged('users', loggedUser.user.uid);
          result = {
            code: 200,
            message: `Berhasil masuk, selamat datang ${currentUser.userLogged?.username}`,
            status: 'Sukses',
            data: currentUser.userLogged,
          };
        });
  } catch (e: Error | any) {
    error = e;
  }

  return { result, error };
}

export async function LogOut() {
  let result = null,
    error = null;

  try {
    result = await signOut(auth);
  } catch (err) {
    error = err;
  }
  return { result, error };
}

export const loginWithEmailAndPassword = async (
  username: string,
  password: string
) => {
  let result: resultRequest | null = null;
  let error: any = null;

  try {
    // Cari pengguna berdasarkan username dan password
    const userQuery = query(
      collection(db, 'users'),
      where('username', '==', username.trim()),
      where('password', '==', password)
    );
    const querySnapshot = await getDocs(userQuery);
    if (querySnapshot.empty) {
      throw new Error('Username atau password salah');
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data() as User;

    const currentUser = await getUserLogged('users', userData.uid);
    result = {
      code: 200,
      message: `Berhasil masuk, selamat datang ${currentUser.userLogged?.username}`,
      status: 'Sukses',
      data: currentUser.userLogged,
    };
  } catch (err) {
    error = err;
    throw error;
  }

  return { result, error };
};
