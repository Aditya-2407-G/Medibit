import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { pickFile } from "@/components/filePicker";
import { uploadUserFile } from "@/components/FileTransferToUserDB";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const FileUploader = () => {
    
    const [fileUri, setFileUri] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [fileType, setFileType] = useState<string>("");
    const [fileSize, setFileSize] = useState<number>();
    const [uploading, setUploading] = useState(false);
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>File Uploader</Text>
                <Text style={styles.instruction}>1. Tap the button below to pick a file.</Text>
                <TouchableOpacity
                    style={styles.button}
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
                    <Text style={styles.buttonText}>Pick a File</Text>
                    <MaterialCommunityIcons
                        name="file-document-outline"
                        size={24}
                        color="white"
                        style={{ marginLeft: 10 }}
                    />
                </TouchableOpacity>

                {fileUri ? (
                    <View style={styles.fileDetailsContainer}>
                        <Text style={styles.fileDetailsText}>File Name: {fileName}</Text>
                    </View>
                ) : null}

                <Text style={styles.instruction}>2. After picking a file, tap the button below to save it.</Text>
                <TouchableOpacity
                    style={styles.button}
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
                    <Text style={styles.buttonText}>Save File</Text>
                    <MaterialCommunityIcons
                        name="cloud-download-outline"
                        size={24}
                        color="white"
                        style={{ marginLeft: 10 }}
                    />
                </TouchableOpacity>

                {uploading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="white" />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#1E1E2C",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#3A83F4",
        textAlign: "center",
        marginBottom: 20,
    },
    instruction: {
        fontSize: 18,
        color: "#CDCDE0",
        textAlign: "center",
        marginVertical: 10,
    },
    button: {
        backgroundColor: "#3A83F4",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    buttonText: {
        color: "#1E1E2C",
        fontSize: 16,
        fontWeight: "bold",
    },
    fileDetailsContainer: {
        backgroundColor: "#333",
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    fileDetailsText: {
        color: "white",
        fontSize: 16,
    },
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
