'use client';

import React, { useEffect } from 'react';
import { onAuthStateChanged, getAuth, User } from 'firebase/auth';
import firebaseApp from '@/config/firebase';
import { Navbar } from '@/components';
import { LogOut } from '@/actions/auth';
import { useRouter, usePathname } from 'next/navigation';
import { ContextProviderProps, User as UserType } from '@/types';
import { getCookie, removeCookie } from '@/actions/cookie';

const auth = getAuth(firebaseApp);

interface AuthContextProps {
  userLogin: UserType | undefined;
  setUserLogin: (user: UserType | undefined) => void;
}

// export const AuthContext = React.createContext<User | null>(null);
export const AuthContext = React.createContext<AuthContextProps>({
  userLogin: undefined,
  setUserLogin: () => {},
});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const pathName = usePathname();

  // const [userLogin, setUserLogin] = React.useState<User | null>(null);
  const [userLogin, setUserLogin] = React.useState<UserType | undefined>(
    undefined
  );
  const [isCookieLoaded, setIsCookieLoaded] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await LogOut();
      setUserLogin(undefined);
      removeCookie('userSession');
      setLoading(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // React.useEffect(() => {
  //   const unSubscribe = onAuthStateChanged(
  //     auth,
  //     async (userLogged: User | null) => {
  //       if (userLogged) {
  //         // setUser(getCurrentUser('currentUser')); using localStorage
  //         const cookie = await getCookie('currentUser');
  //         if (cookie) console.log('terdapat cookie');
  //         setUserLogin(userLogged);
  //         router.replace('/dashboard');
  //       } else {
  //         setUserLogin(null);
  //         // removeCurrentuser('currentUser'); using localStorage
  //         removeCookie('userSession');
  //         router.push('/');
  //       }
  //       setLoading(false);
  //     }
  //   );
  //   return () => unSubscribe();
  // }, [router]);

  const getCookieData = async () => {
    try {
      const cookie = await getCookie('userSession');
      if (cookie) {
        setUserLogin(cookie);
      }
      setIsCookieLoaded(true);
      setLoading(false);
    } catch (error) {
      console.error('Error', error);
    }
  };

  useEffect(() => {
    getCookieData();
  }, []);

  useEffect(() => {
    if (isCookieLoaded) {
      if (!userLogin && pathName !== '/') {
        router.push('/');
      } else if (userLogin && pathName === '/') {
        router.push('/dashboard');
      }
    }
  }, [userLogin, isCookieLoaded]);

  if (loading) return <div>Loading....</div>;

  return (
    <AuthContext.Provider value={{ userLogin, setUserLogin }}>
      <div className='flex flex-col justify-center items-center bg-[#FAFAFA]'>
        {userLogin && !loading ? <Navbar handleClick={handleLogout} /> : ''}
        {!loading && children}
      </div>
    </AuthContext.Provider>
  );
};
