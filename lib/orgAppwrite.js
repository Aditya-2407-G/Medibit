import { Client, Databases, Storage } from 'react-native-appwrite';

const orgClient = new Client();

orgClient
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_ORG_PROJECT_ID)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_ORG_PLATFORM);

export const orgDatabases = new Databases(orgClient);
export const orgStorage = new Storage(orgClient);