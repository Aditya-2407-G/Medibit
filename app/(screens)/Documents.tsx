import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { pickFile } from "@/components/filePicker";
import { uploadUserFile } from "@/components/FileTransferToUserDB";

const FileUploader = () => {
    const [fileUri, setFileUri] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [fileType, setFileType] = useState<string>("");
    const [fileSize, setFileSize] = useState<number>();
    const [uploading, setUploading] = useState(false);

    const DocumentRoute = async () => {
        router.push("DisplayDocuments");
    };

    return (
        <SafeAreaView className="flex-1 justify-center h-full bg-primary">
            <View className="flex-col justify-center">
                <TouchableOpacity
                    className="bg-purple-200 px-10 py-10 rounded-md text-center m-10"
                    activeOpacity={0.7}
                    onPress={() => {
                        pickFile(
                            setFileName,
                            setFileSize,
                            setFileUri,
                            setFileType
                        );
                    }}
                >
                    <Text className="text-black font-bold text-center">
                        Pick a File
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-purple-200 px-10 py-10 rounded-md text-center m-10"
                    activeOpacity={0.7}
                    onPress={() =>
                        uploadUserFile(
                            fileUri,
                            fileName,
                            fileType,
                            fileSize,
                            setUploading
                        )
                    }
                >
                    <Text className="text-black font-bold text-center">
                        Save File
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-purple-200 px-10 py-10 rounded-md text-center m-10"
                    activeOpacity={0.7}
                    onPress={DocumentRoute}
                >
                    <Text className="text-black font-bold text-center">
                        View Saved Files
                    </Text>
                </TouchableOpacity>
            </View>

            {uploading && (
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

export default FileUploader;
