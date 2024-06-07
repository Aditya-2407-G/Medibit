import * as DocumentPicker from "expo-document-picker";
import { ToastAndroid, Alert } from "react-native";

export const pickFile = async (
    setFileName: any,
    setFileSize: any,
    setFileUri: any,
    setFileType: any
) => {
    try {
        const res = await DocumentPicker.getDocumentAsync({
            type: "*/*",
        });

        if (res.assets) {
            const { name, size, uri, mimeType } = res.assets[0];
            setFileName(name);
            setFileSize(size);
            setFileUri(uri);
            setFileType(mimeType!);

            ToastAndroid.show("File selected successfully", ToastAndroid.SHORT);
        } else {
            Alert.alert("Pick Up Failed !", "Please select a file to upload");
        }
    } catch (error) {
        console.error("Error picking file:", error);
        Alert.alert("Error", "Failed to pick file. Please try again later.");
    }
};
