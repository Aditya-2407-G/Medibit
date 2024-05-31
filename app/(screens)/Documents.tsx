import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { appwriteConfig, fileUploader } from '@/lib/appwrite';
import { Storage, Client, ID } from 'react-native-appwrite';

// Initialize Appwrite Client
const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);
const storage = new Storage(client);

// file uploader 

const FileUploader = () => {
  const [fileUri, setFileUri] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>();


  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (res.assets) {
        const { name, size, uri, mimeType } = res.assets[0];
        setFileName(name);
        setFileSize(size);
        setFileUri(uri);
        setFileType(mimeType!);
        console.log(name, size, uri, mimeType);
      } else {
        console.log('File picking cancelled');
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to pick file. Please try again later.');
    }
  };

  const uploadFile = async () => {

    if(!fileUri) {
        Alert.alert('Error', 'Please pick a file first.');
        return;
    }

    try {

        const nameOfFile = fileName.substring(fileName.lastIndexOf('/') + 1);
        
        // Create an object with properties name, type, size, and uri
        const fileData = {
            name: nameOfFile,
            type: fileType,
            size: fileSize!,
            uri: fileUri // or you can use uri here, depends on how you use it elsewhere
        };

        // Pass the fileData object to createFile function
        const ref = storage.createFile(appwriteConfig.storageId, ID.unique(), fileData);

        ref.then((response) => {
            console.log('File uploaded successfully:', response);
            Alert.alert('Success', 'File uploaded successfully.');
        }).catch((error) => {
            console.error('Error uploading file:', error);
            Alert.alert('Error', `Failed to upload file. ${error}`);
        })

        
    } catch (error) {
        console.log('Error uploading file:', error);
        Alert.alert('Error', `Failed to upload file. ${error}`);
    }
}



  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickFile}>
        <Text style={styles.buttonText}>Pick a File</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={uploadFile}>
        <Text style={styles.buttonText}>Upload a File</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#B08',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FileUploader;
