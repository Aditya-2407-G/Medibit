import { Alert, Platform, ToastAndroid } from 'react-native';
import { Account, Avatars, Client, Databases, ID, Permission, Query, Role, Storage } from 'react-native-appwrite';


export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: 'com.project.app',
    projectId: '6655bb3c002037ac9025',
    databaseId: '6655bc21001dbc5b272c',
    userCollectionId:'6655bc580039afa2b0a1',
    videoCollectionId:'6655bca20037f6ce7fb4',
    storageId: '6655be40003475b85881',
    fileCollectionId: '665a28930001cb47d7e1'
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) 
    .setProject(appwriteConfig.projectId) 
    .setPlatform(appwriteConfig.platform) 
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);


export async function createUser (email, password, username) {

    try {

        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) {
            throw new Error(error);
        }


        const avatarUrl = avatars.getInitials(username);


        await Signin(email, password)


        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountid: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl
            },
        );

        return newUser;


    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}


export async function Signin  (email, password) {
    try {

        const session = await account.createEmailPasswordSession(email, password);

        return session;
        
    } catch (error) {
        throw new Error(error);
    }
}

export async function  getAccount() {

    try {
        const currentAccount = await account.get();
        return currentAccount;
    } catch (error) {
        throw new Error(error);
    }
}

export async function  getCurrentUser() {

    try {

        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountid", currentAccount.$id)]
        );

        if(!currentUser) throw Error;

        return currentUser.documents[0];
        
    } catch (error) {
        console.log(error);
        return null;
    }

}


export async function  siguOut() {

    try {
        const session = await account.deleteSession('current');

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export async function fileUploader(file) {

    try {

        const response = await storage.createFile(appwriteConfig.storageId, ID.unique(), file);
        console.log(response);
        ToastAndroid.show('File uploaded successfully', ToastAndroid.SHORT);
        return response;
    } catch (error) {
        throw new Error(error);
    }

}

//file vierwer

export async function viewFile() {

    try {

        const result = await storage.listFiles(appwriteConfig.storageId, [Query.orderDesc()]);

        result.files.forEach(file => {
            console.log(file.$id);
        });
        // console.log(result);
        return result;
        
    } catch (error) {
        throw new Error(error);
    }
}   

    export async function viewDocument() {
        
            try {

                const user = await getCurrentUser();
                if(!user) throw Error;  

                const userId = user.$id;
        
                const result = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.fileCollectionId, [Query.equal("users", [userId])]);
                if(result.documents.length === 0) {
                    Alert.alert('No files found, Please upload a file');
                    return;
                }
                const documents = []
                result.documents.forEach(document => {
                    documents.push(document.name);
                });
                console.log(documents);
                // console.log(result);
                return result;
                
            } catch (error) {
                throw new Error(error);
            }
        
    }



export async function userFileUploader(file) {

    const{name} = file;

    // const userId = await getCurrentUser().then(user => user.accountid);
    const currUserID = await getCurrentUser();
    console.log(currUserID);


    try {

        const response = await databases.createDocument(
            appwriteConfig.databaseId, 
            appwriteConfig.fileCollectionId, 
            ID.unique(), 
            {name: name, fileId: '', users: currUserID.$id},
            
        );

        const documentId = response.$id;

        const uploadResponse = await storage.createFile(appwriteConfig.storageId, documentId, file);

        await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.fileCollectionId, documentId, {fileId: uploadResponse.$id});
        
        console.log("uploaded", uploadResponse);

        ToastAndroid.show('File uploaded successfully', ToastAndroid.SHORT);
    } catch (error) {
        throw new Error(error);
    }

}


export async function getFileUri(fileId) {

    try {
        const response = await storage.getFileDownload(appwriteConfig.storageId, fileId);
        const fileUrl = response.href;
        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

