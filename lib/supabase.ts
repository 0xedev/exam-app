

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tcqhwhvtkbzhljdemjnv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcWh3aHZ0a2J6aGxqZGVtam52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2OTY4MDcsImV4cCI6MjA1MDI3MjgwN30.lB5HWJjI5bsPBwJBrgRc4qngTmY-d9c1znreCTr645I';

// Conditional import based on environment
let storageAdapter = null;

// Check if we're in a browser/React Native environment or Node
if (typeof window !== 'undefined') {
  // Client-side (React Native)
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  
  storageAdapter = {
    getItem: async (key: string) => await AsyncStorage.getItem(key),
    setItem: async (key: string, value: string) => await AsyncStorage.setItem(key, value),
    removeItem: async (key: string) => await AsyncStorage.removeItem(key)
  };
} else {
  // Server-side (Node.js)
  // Use a properly typed in-memory storage for server-side
  const memoryStorage: Record<string, string> = {};
  storageAdapter = {
    getItem: async (key: string) => memoryStorage[key] || null,
    setItem: async (key: string, value: string) => { memoryStorage[key] = value },
    removeItem: async (key: string) => { delete memoryStorage[key] }
  };
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});