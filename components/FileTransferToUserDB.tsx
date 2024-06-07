import { userFileUploader } from "@/lib/appwrite";
import { Alert, ToastAndroid } from "react-native";

export const uploadUserFile = async (
    fileUri: any,
    fileName: any,
    fileType: any,
    fileSize: any,
    setUploading: any
) => {
    if (!fileUri) {
        Alert.alert("Error", "Please pick a file first.");
        return;
    }

    try {
        setUploading(true);

        const fileData = {
            name: fileName,
            type: fileType,
            size: fileSize!,
            uri: fileUri,
        };

        const ref = userFileUploader(fileData);

        ref.then(() => {
            console.log("File uploaded successfully");
            ToastAndroid.show("File uploaded successfully", ToastAndroid.SHORT);
        })
            .catch((error) => {
                console.error("Error uploading file:", error);
                Alert.alert("Error", `Failed to upload file. ${error}`);
            })
            .finally(() => {
                setUploading(false);
            });
    } catch (error) {
        console.log("Error uploading file:", error);
        Alert.alert("Error", `Failed to upload file. ${error}`);
    }
};
