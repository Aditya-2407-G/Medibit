import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    Platform,
    StyleSheet,
    ActivityIndicator,
    ToastAndroid,
} from "react-native";
import { deleteFile, getFileUri, viewDocument } from "@/lib/appwrite";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import { TabIcon } from "@/components/TabIcon";
import { StatusBar } from "expo-status-bar";

const DisplayDocuments = () => {
    // Use state hook for storing user files from db

    const [userFiles, setUserFiles] = useState<any[]>([]);
    const [downloading, setDownloading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false); 

    useEffect(() => {
        fetchUserFiles();
    }, []);

    const fetchUserFiles = async () => {
        try {
            const result = await viewDocument();
            if (!result) {
                throw new Error("No files found! Try Uploading a file first!");
            }
            setUserFiles(result!.documents);
        } catch (error) {
            Alert.alert("Error", "No files found! Try Uploading a file first!");
        }
    };

    // Save the file to the device

    const saveFile = async (uri: string, fileName: string, mimeType: any) => {
        if (Platform.OS === "android") {
            const permission =
                await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permission.granted) {
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                await FileSystem.StorageAccessFramework.createFileAsync(
                    permission.directoryUri,
                    fileName,
                    mimeType
                )
                    .then(async (uri) => {
                        await FileSystem.writeAsStringAsync(uri, base64, {
                            encoding: FileSystem.EncodingType.Base64,
                        });
                        Alert.alert("File downloaded Succesfully");
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                shareAsync(uri);
            }
        } else {
            shareAsync(uri);
        }
    };

    const handleFileDownload = async (fileName: string, fileId: string) => {
        try {
            setDownloading(true);

            const fileUri = await getFileUri(fileId);
            const result = await FileSystem.downloadAsync(
                fileUri,
                FileSystem.documentDirectory + fileName
            );
            if (result && result.status === 200) {
                saveFile(result.uri, fileName, result.headers["content-type"]);
            } else {
                throw new Error("Failed to download file");
            }
        } catch (error) {
            console.log("Error downloading File", error);
        } finally {
            setDownloading(false);
        }
    };

    //delete file from db

    const handleFileDelete = async (fileId: string) => {
        try {
            await deleteFile(fileId);
            fetchUserFiles();
            ToastAndroid.show("File deleted successfully", ToastAndroid.SHORT);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to delete file");
        }
    };

    //reduce file name length for display purposes

    const truncateFileName = (name: string, maxLength: number) => {
        if (name.length <= maxLength) return name;
        return name.substring(0, maxLength) + "....";
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchUserFiles();
        setIsRefreshing(false);
    };

    const renderItem = ({ item }: any) => (
        <View className="flex-row items-center justify-between p-1">
            <Text className="text-white font-bold ">
                {truncateFileName(item.name, 15)}
            </Text>
            <Text className="text-white font-bold ">{item.username}</Text>
            <Text className="text-white font-bold">{item.useremail}</Text>

            <View className="flex-row">
                <TouchableOpacity
                    onPress={() => handleFileDownload(item.name, item.$id)}
                    disabled={downloading}
                    className="px-1 py-2 rounded-md ml-6"
                >
                    <TabIcon
                        icon={icons.download}
                        color="white"
                        containerStyle="w-5 h-6"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleFileDelete(item.$id)}
                    disabled={downloading}
                    className="px-1 py-2 rounded-md ml-2"
                >
                    <TabIcon
                        icon={icons.cross}
                        color="white"
                        containerStyle="w-4 h-6"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (


        <SafeAreaView className="flex-1 bg-primary">
            <StatusBar style="light" />

            <View className="flex-row justify-between">

            <View className="p-2">
                <Text className="text-white font-bold text-2xl">
                    Your Uploads
                </Text>
            </View>
            <TouchableOpacity
                        className="mr-2 mt-3"
                        onPress={handleRefresh}
                    >
                        {isRefreshing ? (
                            <ActivityIndicator className="mt-2" size="large" color="white" />
                        ) : (
                            <TabIcon
                                icon={icons.refresh}
                                color="white"
                                containerStyle="w-8 h-7"
                            />
                        )}
                    </TouchableOpacity>

            </View>



            <FlatList
                className="mt-1 bg-slate-600 rounded-md p-2"
                data={userFiles}
                renderItem={renderItem}
                keyExtractor={(item) => item.$id}
                ListEmptyComponent={() => (
                    <Text className="text-center text-white">
                        No files found
                    </Text>
                )}
            />
            {downloading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            )}
        </SafeAreaView>
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

export default DisplayDocuments;
