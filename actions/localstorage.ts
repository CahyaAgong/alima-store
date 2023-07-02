export function saveCurrentUser(key: string, data: string) {
  try {
    localStorage.setItem(key, data);
  } catch (error: Error | any) {
    return error;
  }
}

export function getCurrentUser(key: string) {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData) {
      return JSON.parse(serializedData);
    }
    return null;
  } catch (error: Error | any) {
    return error;
  }
}

export function removeCurrentuser(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (error: Error | any) {
    return error;
  }
}
