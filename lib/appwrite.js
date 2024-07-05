import { Alert, Platform, ToastAndroid } from "react-native";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
  videoCollectionId: process.env.EXPO_PUBLIC_APPWRITE_VIDEO_COLLECTION_ID,
  storageId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID,
  fileCollectionId: process.env.EXPO_PUBLIC_APPWRITE_FILE_COLLECTION_ID,
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) {
      throw new Error(error);
    }

    const avatarUrl = avatars.getInitials(username);

    await Signin(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountid: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

export async function Signin(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountid", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    return null;
  }
}

export async function siguOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteFile(fileId) {
  try {
    const response = await storage.deleteFile(
      appwriteConfig.storageId,
      fileId
    );
    const res = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      fileId
    );
    return {response, res};
  } catch (error) {
    throw new Error(error);
  }
} 


export async function viewDocument() {
  try {
    const user = await getCurrentUser();
    if (!user) throw Error;

    const userId = user.$id;

    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      [Query.equal("users", [userId])]
    );
    if (result.documents.length === 0) {
      return;
    }
    const documents = [];
    result.documents.forEach((document) => {
      let slicedName = document.name.slice(0, 20);
      documents.push(slicedName);
    });

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export async function userFileUploader(file) {
  const { name } = file;

  const currUserID = await getCurrentUser();

  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      ID.unique(),
      { name: name, fileId: "", users: currUserID.$id }
    );

    const documentId = response.$id;

    const uploadResponse = await storage.createFile(
      appwriteConfig.storageId,
      documentId,
      file
    );

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      documentId,
      { fileId: uploadResponse.$id }
    );

    ToastAndroid.show("File uploaded successfully", ToastAndroid.SHORT);
  } catch (error) {
    throw new Error(error);
  }
}

export async function getFileUri(fileId) {
  try {
    const response = await storage.getFileDownload(
      appwriteConfig.storageId,
      fileId
    );
    const fileUrl = response.href;
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}


export async function changePassword(newPassword, currentPassword) {
  try {
      const response = await account.updatePassword(newPassword, currentPassword); 
      return response;
  } catch (error) {
    throw new Error(error);
  }
}


