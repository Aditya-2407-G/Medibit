import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, ToastAndroid, Alert } from 'react-native';
import { Account, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';
import * as DocumentPicker from "expo-document-picker";
import { getCurrentUser } from '@/lib/appwrite';

const Transfer = () => {

    const route = useRoute();
    // @ts-ignore
    const {item} = route.params;
    
    
        const itemData = JSON.parse(item);
        const qrData = itemData.qrCodeData;
        console.log(itemData);
        
        
        const {endpoint, platform, projectid, organisationid, databaseid, orgcollectionid, storageid} = qrData;



const orgClient = new Client();

orgClient
  .setEndpoint(endpoint)
  .setProject(projectid)
  .setPlatform(platform)
  
const orgAccount = new Account(orgClient);
const orgDatabases = new Databases(orgClient);
const orgStorage = new Storage(orgClient);

const currAccount =  orgAccount.get().then((response) => {
    console.log(response);
})
console.log(currAccount);


  const [fileUri, setFileUri] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>();
  const [uploading, setUploading] = useState(false);

   async function getCurrentOrg() {
    try {
      const currentAccount = await orgAccount.get();
      if (!currentAccount) throw Error;
  
      const currentUser = await orgDatabases.listDocuments(
        databaseid,
        "665e27920026aff00219",
        [Query.equal("accountid", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  
  async function fileUploader(fileData:any) {

      const currUserID = await getCurrentOrg();   
      const {name} = fileData;

      try {
          
          const response = await orgDatabases.createDocument(
              databaseid,
              orgcollectionid,     // recieving collection ID
              ID.unique(),
              {
                  name: name,
                  fileid: "",
                  organisation:currUserID?.$id,
                }
            );

            const documentId = response.$id;

            const uploadResponse = await orgStorage.createFile(
                storageid,
                documentId,
                fileData
            )
            const uniqueFileID = uploadResponse.$id;
            console.log("THe upload response", uploadResponse.$id);
            

            await orgDatabases.updateDocument(
                databaseid,
                orgcollectionid,
                documentId,
                {fileid: uniqueFileID}
            );
  
      ToastAndroid.show("File uploaded successfully", ToastAndroid.SHORT);
    } catch (error) {
      console.log("Error uploading file:", error);
      
    }
  }





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

  const UploadToORG = async () => {

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

      const ref = fileUploader(fileData);
      
      ref
        .then(() => {
          console.log("File uploaded successfully");
          ToastAndroid.show("File uploaded successfully", ToastAndroid.SHORT);
        })
        .catch((error:any) => {
          console.error("Error uploading file:", error);
          Alert.alert("Error", `Failed to upload file. ${error}`);
        })

    } catch (error) {
      console.log("Error uploading file:", error);
      Alert.alert("Error", `Failed to upload file. ${error}`);
    } 
  };


  
  return (
    <View className='flex-1 p-10 bg-primary'>
      <Text>Transfer File:</Text>
      <Button title="Select File" onPress={() => {
        pickFile();
      }} />
      <Button title="Upload File" onPress={() => {
        UploadToORG();
      }} />


      <View>
        <Text className='text-white'>Endpoint: {endpoint}</Text>
        <Text className='text-white'>Platform: {platform}</Text>
        <Text className='text-white'>Project ID: {projectid}</Text>
        <Text className='text-white'>Organisation ID: {organisationid}</Text>
        <Text className='text-white'>Database ID: {databaseid}</Text>
        <Text className='text-white'>Collection ID: {orgcollectionid}</Text>
        <Text className='text-white'>Storage ID: {storageid}</Text>
      </View>
      
    </View>
  );
};


export default Transfer
