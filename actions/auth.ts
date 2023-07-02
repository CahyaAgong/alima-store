import firebaseApp from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from 'firebase/auth';
import { addUser, getUserLogged } from './firestore';
import { removeCurrentuser } from './localstorage';

const auth = getAuth(firebaseApp);

export async function Authentication(
  email: string,
  password: string,
  type: string
) {
  let mailMasking = '@mail.com';
  let result = null,
    error = null;

  try {
    type === 'signup'
      ? (result = await createUserWithEmailAndPassword(
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
        }))
      : (result = await signInWithEmailAndPassword(
          auth,
          email + mailMasking,
          password
        ).then(loggedUser => {
          getUserLogged('users', loggedUser.user.uid);
        }));
  } catch (e: Error | any) {
    error = e;
  }

  return { result, error };
}

export async function logOut() {
  let result = null,
    error = null;
  try {
    result = await signOut(auth);
    removeCurrentuser('currentUser');
  } catch (err) {
    error = err;
  }
  return { result, error };
}
