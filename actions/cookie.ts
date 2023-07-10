import { User } from '@/types';
import Cookies from 'js-cookie';

// // Set cookie belum pake promise/async
// export const setCookie = async (name: string, value: User, options: object = {}) => {
//   Cookies.set(name, JSON.stringify(value), options);
// };

// // Get cookie belum pake promise/async
// export const getCookie = async (name: string): Promise<User | undefined> => {
//   const cookieValue = Cookies.get(name);
//   if (cookieValue) {
//     const parsedValue = JSON.parse(cookieValue);
//     return parsedValue;
//   } else {
//     return undefined;
//   }
// };

// Set cookie
export const setCookie = async (
  name: string,
  value: User,
  options: object = {}
) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Cookies.set(name, JSON.stringify(value), options);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

// Get cookie
export const getCookie = async (name: string): Promise<User | undefined> => {
  return new Promise((resolve, reject) => {
    try {
      const cookieValue = Cookies.get(name);
      if (cookieValue) {
        const parsedValue = JSON.parse(cookieValue);
        resolve(parsedValue);
      } else {
        resolve(undefined);
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Remove cookie
export const removeCookie = (name: string) => {
  Cookies.remove(name);
};
