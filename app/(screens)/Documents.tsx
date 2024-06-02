import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { fileUploader, getAccount, getCurrentUser, userFileUploader, viewDocument, viewFile } from "@/lib/appwrite";
import { router } from "expo-router";

const FileUploader = () => {
  const [fileUri, setFileUri] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>();


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

  const uploadFile = async () => {
    if (!fileUri) {
      Alert.alert("Error", "Please pick a file first.");
      return;
    }

    try {
      // Create an object with properties name, type, size, and uri
      const fileData = {
        name: fileName,
        type: fileType,
        size: fileSize!,
        uri: fileUri,
      };

      const ref = fileUploader(fileData);

      ref
        .then((response) => {
          console.log("File uploaded successfully:", response);
          ToastAndroid.show("File uploaded successfully", ToastAndroid.SHORT);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          Alert.alert("Error", `Failed to upload file. ${error}`);
        });
    } catch (error) {
      console.log("Error uploading file:", error);
      Alert.alert("Error", `Failed to upload file. ${error}`);
    }
  };

  
  
  
  const uploadUserFile = async () => {
    
    
    if (!fileUri) {
      Alert.alert("Error", "Please pick a file first.");
      return;
    }
    
    try {
      // Create an object with properties name, type, size, and uri
      const fileData = {
        name: fileName,
        type: fileType,
        size: fileSize!,
        uri: fileUri,
      };
      
      const ref = userFileUploader(fileData);
      
      ref
      .then((response) => {
        console.log("File uploaded successfully:", response);
        ToastAndroid.show("File uploaded successfully", ToastAndroid.SHORT);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        Alert.alert("Error", `Failed to upload file. ${error}`);
      });
    } catch (error) {
      console.log("Error uploading file:", error);
      Alert.alert("Error", `Failed to upload file. ${error}`);
    }
  };


  //file preview

  const previewFile = async () => {
    const file = viewDocument();
    if(file === undefined){
      Alert.alert("Error", "Please upload a file first.");
      return;
    }
    console.log(file);
  };

  const handleDisplayDocuments = async () => {
    router.push("DisplayDocuments");
  }
  
  return (
    <View className="flex-1 justify-center">
      <TouchableOpacity
        className="bg-red-400 px-10 py-10 rounded-md text-center m-10"
        onPress={pickFile}
      >
        <Text className="text-white font-bold">Pick a File</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-red-400 px-10 py-10 rounded-md text-center m-10"
        onPress={uploadFile}
      >
        <Text className="text-white font-bold">Upload a File</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-red-400 px-10 py-10 rounded-md text-center m-10"
        onPress={previewFile}
      >
        <Text className="text-white font-bold">Preview File</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-red-400 px-10 py-10 rounded-md text-center m-10"
        onPress={uploadUserFile}
      >
        <Text className="text-white font-bold">UserFileUploader</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-red-400 px-10 py-10 rounded-md text-center m-10"
        onPress={handleDisplayDocuments}
      >
        <Text className="text-white font-bold">UploadedDocuments</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FileUploader;
