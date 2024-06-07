import React, { useState } from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { pickFile } from "../../components/filePicker";
import { UploadToORG } from "../../components/FileTranferToOrgDb";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";

const Transfer = () => {
    const route = useRoute();
    // @ts-ignore
    const { item } = route.params;

    const itemData = JSON.parse(item);
    const qrData = itemData.qrCodeData;

    const { di, oci, ofci, coi, si, n } = qrData;

    const [fileUri, setFileUri] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [fileType, setFileType] = useState<string>("");
    const [fileSize, setFileSize] = useState<number>(0);

    const handleFilePickup = () => {
        pickFile(setFileName, setFileSize, setFileUri, setFileType);
    };
    const handleFileUpload = () => {
        UploadToORG(fileUri, fileName, fileType, fileSize, coi, di, ofci, si);
    };

    return (
        <SafeAreaView className="flex-1 flex-col bg-primary justify-evenly p-10">
            <View>
                <Text className="text-white text-center text-3xl font-semibold ">
                    Sending files to{" "}
                </Text>
                <Text className="text-white text-center text-3xl mt-10 font-semibold">
                    {n}
                </Text>
            </View>

            <CustomButton
                title="Select file for uploading"
                handlePress={handleFilePickup}
                containerStyles={undefined}
                textStyles={undefined}
                isLoading={false}
            ></CustomButton>

            <CustomButton
                title="Upload file"
                handlePress={handleFileUpload}
                containerStyles="mb-20"
                textStyles={undefined}
                isLoading={false}
            ></CustomButton>
        </SafeAreaView>
    );
};

export default Transfer;

// ept: appwriteConfig.endpoint,                                 // endpoint -ept
// pf: appwriteConfig.platform,                                 // platform -pf
// pi: appwriteConfig.projectId,                               // projectId -pi
// di: appwriteConfig.databaseId,                            // databaseId -di
// oci: appwriteConfig.orgCollectionId,                     // orgCollectionId -oci
// ofci: appwriteConfig.orgFileCollectionId,               // orgFileCollectionId -ofci
// coi: (await currentUser).$id,                          // currentOrganizationId - coi
// si: appwriteConfig.storageId,                         // storageId -si
