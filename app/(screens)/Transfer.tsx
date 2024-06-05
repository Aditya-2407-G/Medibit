import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, ToastAndroid, Alert } from 'react-native';
import { Account, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';
import * as DocumentPicker from "expo-document-picker";
import { getAccount, getCurrentUser } from '@/lib/appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';



// Database ID:           {di}
// ORG Collection ID:     {oci}
// Organisation FILE ID:  {ofci}
// CURRENT ORG ID:        {coi} 
// Storage ID:            {si}

const Transfer = () => {

    const route = useRoute();
    // @ts-ignore
    const {item} = route.params;
    
    
        const itemData = JSON.parse(item);
        const qrData = itemData.qrCodeData;
        
        const {di, oci, ofci, coi, si} = qrData;



const orgClient = new Client();

orgClient
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_ORG_PROJECT_ID!)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_ORG_PLATFORM!)
  
const orgAccount = new Account(orgClient);
const orgDatabases = new Databases(orgClient);
const orgStorage = new Storage(orgClient);


  const [fileUri, setFileUri] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>();

   async function getCurrentOrg() {
    try {
      const currentAccount = await orgAccount.get();
      if (!currentAccount) throw Error;
  
      const currentUser = await orgDatabases.listDocuments(
        di,
        oci,
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

      const currentOrgID = await getCurrentOrg();   
      const currentUserID = await getAccount();
      const {name} = fileData;

      try {
          
          const response = await orgDatabases.createDocument(
              di,
              ofci,     // recieving collection ID
              ID.unique(),
              {
                  name: name,
                  fileid: "",
                  username:currentUserID.name,
                  useremail:currentUserID.email,
                  userid:currentUserID.$id,
                  organisation:currentOrgID?.$id,
                }
            );

            const documentId = response.$id;

            const uploadResponse = await orgStorage.createFile(
                si,
                documentId,
                fileData
            )
            const uniqueFileID = uploadResponse.$id;

            await orgDatabases.updateDocument(
                di,
                ofci,
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
    <SafeAreaView className='flex-1 p-2 bg-primary'>
      <Text className='text-white text-center text-3xl font-semibold mb-10'>Transfer File:</Text>
      <View className='m-10'>
          <Button  title="Select File" onPress={() => {
            pickFile();
          }} />
      </View>

          <View className='m-10'>
            <Button title="Upload File" onPress={() => {
          UploadToORG();
        }} />

          </View>


      <View>
        <Text className='text-white'>Database ID: {di}</Text>
        <Text className='text-white'>ORG Collection ID: {oci}</Text>
        <Text className='text-white'>Organisation FILE  ID: {ofci}</Text>
        <Text className='text-white'>CURRENT ORG ID: {coi} </Text>
        <Text className='text-white'>Storage ID: {si}</Text>
      </View>
      
    </SafeAreaView>
  );
};


export default Transfer



// ept: appwriteConfig.endpoint,                                 // endpoint -ept
// pf: appwriteConfig.platform,                                 // platform -pf
// pi: appwriteConfig.projectId,                               // projectId -pi
// di: appwriteConfig.databaseId,                            // databaseId -di
// oci: appwriteConfig.orgCollectionId,                     // orgCollectionId -oci
// ofci: appwriteConfig.orgFileCollectionId,               // orgFileCollectionId -ofci
// coi: (await currentUser).$id,                          // currentOrganizationId - coi
// si: appwriteConfig.storageId,                         // storageId -si