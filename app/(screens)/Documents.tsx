import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { userFileUploader, viewDocument } from "@/lib/appwrite";
import { router } from "expo-router";

const FileUploader = () => {
  const [fileUri, setFileUri] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>();
  const [uploading, setUploading] = useState<boolean>(false);

  const pickFile = async () => {
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
        console.log(name, size, uri, mimeType);

        ToastAndroid.show("File selected successfully", ToastAndroid.SHORT);
      } else {
        console.log("File picking cancelled");
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Failed to pick file. Please try again later.");
    }
  };

  const uploadUserFile = async () => {
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

      ref
        .then(() => {
          console.log("File uploaded successfully");
          ToastAndroid.show("File uploaded successfully", ToastAndroid.SHORT);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          Alert.alert("Error", `Failed to upload file. ${error}`);
        });
    } catch (error) {
      console.log("Error uploading file:", error);
      Alert.alert("Error", `Failed to upload file. ${error}`);
    } finally {
      setUploading(false);
    }
  };

  const previewFile = async () => {
    const file = viewDocument();
    if (file === undefined) {
      Alert.alert("Error", "Please upload a file first.");
      return;
    }
    console.log(file);
  };

  const DocumentRoute = async () => {
    router.push("DisplayDocuments");
  };

  return (
    <View className="flex-1 justify-center bg-primary">
      <TouchableOpacity
        className="bg-secondary-200 px-10 py-10 rounded-md text-center m-10"
        onPress={pickFile}
      >
        <Text className="text-black font-bold">Pick a File</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-secondary-200 px-10 py-10 rounded-md text-center m-10"
        onPress={previewFile}
      >
        <Text className="text-black font-bold">Preview File</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-secondary-200 px-10 py-10 rounded-md text-center m-10"
        onPress={uploadUserFile}
      >
        <Text className="text-black font-bold">User File Uploader</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-secondary-200 px-10 py-10 rounded-md text-center m-10"
        onPress={DocumentRoute}
      >
        <Text className="text-black font-bold">Uploaded Documents</Text>
      </TouchableOpacity>
      {uploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FileUploader;
