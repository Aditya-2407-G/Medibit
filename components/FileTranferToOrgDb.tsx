import { ToastAndroid, Alert } from "react-native";
import { getAccount } from "@/lib/appwrite";
import { orgDatabases, orgStorage } from "../lib/orgAppwrite";
import { ID } from "react-native-appwrite";

export const fileUploader = async (
    fileData: { name: string; type: string; size: number; uri: string },
    coi: string,
    di: string,
    ofci: string,
    si: string
) => {
    const currentOrgID = coi;
    const currentUserID = await getAccount();
    const { name } = fileData;

    try {
        const response = await orgDatabases.createDocument(
            di,
            ofci,
            ID.unique(),
            {
                name: name,
                fileid: "",
                username: currentUserID.name,
                useremail: currentUserID.email,
                userid: currentUserID.$id,
                organisation: currentOrgID,
            }
        );

        const documentId = response.$id;

        const uploadResponse = await orgStorage.createFile(
            si,
            documentId,
            fileData
        );
        const uniqueFileID = uploadResponse.$id;

        await orgDatabases.updateDocument(di, ofci, documentId, {
            fileid: uniqueFileID,
        });

        ToastAndroid.show("File uploaded successfully", ToastAndroid.SHORT);
        
    } catch (error) {
        console.log("Error uploading file:", error);
    }
};

export const UploadToORG = async (
    fileUri: string,
    fileName: string,
    fileType: string,
    fileSize: number,
    coi: string,
    di: string,
    ofci: string,
    si: string
) => {
    if (!fileUri) {
        Alert.alert("Error", "Please pick a file first.");
        return;
    }

    try {
        const fileData = {
            name: fileName,
            type: fileType,
            size: fileSize!,
            uri: fileUri,
        };

        await fileUploader(fileData, coi, di, ofci, si);
    } catch (error) {
        console.log("Error uploading file:", error);
        Alert.alert("Error", `Failed to upload file. ${error}`);
    }
};
