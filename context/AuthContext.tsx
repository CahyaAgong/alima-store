'use client';

import React from 'react';
import { onAuthStateChanged, getAuth, User } from 'firebase/auth';
import firebaseApp from '@/config/firebase';
import { Navbar } from '@/components';
import { logOut } from '@/actions/auth';
import { useRouter } from 'next/navigation';

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const auth = getAuth(firebaseApp);

export const AuthContext = React.createContext<User | null>(null);

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const router = useRouter();
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
    if (!userLogin) {
      router.push('/');
      return;
    }
    return () => unSubscribe();
  }, [userLogin]);

  return (
    <AuthContext.Provider value={userLogin}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className='flex flex-col justify-center items-center bg-[#FAFAFA]'>
          {userLogin && <Navbar handleClick={logOut} />}
          {children}
        </div>
      )}
    </AuthContext.Provider>
  );
};
