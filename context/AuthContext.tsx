'use client';

import React from 'react';
import { onAuthStateChanged, getAuth, User } from 'firebase/auth';
import firebaseApp from '@/config/firebase';

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const auth = getAuth(firebaseApp);

export const AuthContext = React.createContext<User | null>(null);

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [userLogin, setUserLogin] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUserLogin(user);
      } else {
        setUserLogin(null);
      }
      setLoading(false);
    });
    return () => unSubscribe();
  }, []);

  return (
    <AuthContext.Provider value={userLogin}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
