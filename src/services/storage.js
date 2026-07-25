import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  ACCOUNT: '@warungku:account',
  SESSION: '@warungku:session',
  PRODUCTS: '@warungku:products',
  CART: '@warungku:cart',
  HISTORY: '@warungku:history',
};

export async function saveData(key, value) {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(key, json);
  } catch (error) {
    console.warn(`storage.saveData(${key}) failed`, error);
  }
}

export async function loadData(key, fallback = null) {
  try {
    const json = await AsyncStorage.getItem(key);
    return json != null ? JSON.parse(json) : fallback;
  } catch (error) {
    console.warn(`storage.loadData(${key}) failed`, error);
    return fallback;
  }
}

export async function removeData(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn(`storage.removeData(${key}) failed`, error);
  }
}

export async function clearAll() {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
}
