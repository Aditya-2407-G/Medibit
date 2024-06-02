import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, Alert, Platform, ActivityIndicator } from 'react-native';
import { getFileUri, viewDocument } from '@/lib/appwrite';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';


const DisplayDocuments = () => {
    const [userFiles, setUserFiles] = useState<any[]>([]);
    const [downloading, setDownloading] = useState(false); // State to track downloading state
    
    useEffect(() => {
        fetchUserFiles();
    }, []);

    const fetchUserFiles = async () => {
        try {
            const result = await viewDocument(); 
            if(!result) {
                throw new Error("No files found! Try Uploading a file first!");
            
            }
            setUserFiles(result!.documents); 
            
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No files found! Try Uploading a file first!');
        }
    };



    const saveFile = async (uri:string, fileName:string, mimeType:any) => {

        if(Platform.OS === "android") {
            const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            if(permission.granted) {
                const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
                await FileSystem.StorageAccessFramework.createFileAsync(permission.directoryUri, fileName, mimeType)
                .then(async (uri) => {
                    await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
                    Alert.alert("File downloaded Succesfully");
                    
                })
                .catch((error) => {
                    console.error(error);
                })
            }
            else {
                shareAsync(uri);
            }
    
        }
        else {
            shareAsync(uri);
        }
    }

    const handleFileDownload = async (fileName:string, fileId: string) => {
        try {
            setDownloading(true); // Set downloading state to true when download starts

            const fileUri = await getFileUri(fileId); 
            const result = await FileSystem.downloadAsync(
                fileUri,
                FileSystem.documentDirectory + fileName,
            );
            if (result && result.status === 200) {
                saveFile(result.uri, fileName, result.headers['content-type']);
            } else {
                throw new Error("Failed to download file");
            }
        } catch (error) {
            console.log("Error downloading File", error);
        } finally {
            setDownloading(false); // Reset downloading state after download completion or failure
        }
    }


    const renderItem = ({ item }: any) => (
        <TouchableOpacity disabled={downloading}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                <Text>{item.name}</Text>
                <Button title="Download" onPress={() => handleFileDownload(item.name, item.$id)} disabled={downloading}/>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginVertical: 20 }}>User Files List</Text>
            <FlatList
                data={userFiles}
                renderItem={renderItem}
                keyExtractor={(item) => item.$id}
                ListEmptyComponent={() => <Text style={{ textAlign: 'center' }}>No files found</Text>}
            />
            {/* Loading icon */}
            {downloading && <ActivityIndicator style={{ marginTop: 10 }} size="large" color="#0000ff" />}
        </View>
    );
};

export default DisplayDocuments;








