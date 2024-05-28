import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';


export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: 'com.project.app',
    projectId: '6655bb3c002037ac9025',
    databaseId: '6655bc21001dbc5b272c',
    userCollectionId:'6655bc580039afa2b0a1',
    videoCollectionId:'6655bca20037f6ce7fb4',
    storageId: '6655be40003475b85881'
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
// const storage = new Storage(client);

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
            }
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