import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ToastAndroid } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { fileUploader, viewFile } from '@/lib/appwrite';

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

        ToastAndroid.show("File selected successfully", ToastAndroid.SHORT)
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
        
        // Create an object with properties name, type, size, and uri
        const fileData = {
            name: Date.now()+fileName,
            type: fileType,
            size: fileSize!,
            uri: fileUri 
        };


        const ref = fileUploader(fileData);

        ref.then((response) => {
            console.log('File uploaded successfully:', response);
            ToastAndroid.show("File uploaded successfully", ToastAndroid.SHORT)
        }).catch((error) => {
            console.error('Error uploading file:', error);
            Alert.alert('Error', `Failed to upload file. ${error}`);
        })

        
    } catch (error) {
        console.log('Error uploading file:', error);
        Alert.alert('Error', `Failed to upload file. ${error}`);
    }
}

const previewFile = async () => {

        const file = viewFile();
        console.log(file);
        
}



  return (
    <View className='flex justify-center align-middle'>
      <TouchableOpacity className='bg-red-400 px-10 py-20 rounded-md text-center m-10' onPress={pickFile}>
        <Text className='text-white font-bold'>Pick a File</Text>
      </TouchableOpacity>
      <TouchableOpacity className='bg-red-400 px-10 py-20 rounded-md text-center m-10' onPress={uploadFile}>
        <Text className='text-white font-bold'>Upload a File</Text>
      </TouchableOpacity>
      <TouchableOpacity className='bg-red-400 px-10 py-20 rounded-md text-center m-10' onPress={previewFile}>
        <Text className='text-white font-bold'>Preview File</Text>
      </TouchableOpacity>

    </View>
  );
};


export default FileUploader;
