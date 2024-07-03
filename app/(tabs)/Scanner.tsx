import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button } from "react-native-paper";

const ScanQR = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [flashState, setFlashState] = useState(false);
    const [scanned, setScanned] = useState(true);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View className="bg-primary h-full flex justify-center">
                <Text className="text-white font-bold text-2xl mb-10">
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission}>Grant Permission</Button>
            </View>
        );
    }

    const toggleFlash = () => {
        setFlashState((current) => !current);
    };

    const handleBarCodeScanned = ({ data }: { data: any }) => {
        const scannedData = data;
        if (!scannedData.includes("di")) {
            Alert.alert(
                "Invalid QR code",
                "Please try again by scanning a valid QR code."
            );
            setScanned(false);
            return;
        }
        setScanned(false);

        if (data) {
            router.push({
                pathname: "/Transfer",
                params: { item: scannedData },
            });
        }
    };

    return (
        <CameraView
            className="flex-1"
            facing="back"
            enableTorch={flashState}
            onBarcodeScanned={scanned ? handleBarCodeScanned : undefined}
            barcodeScannerSettings={{
                barcodeTypes: ["qr"],
            }}
        >
            <View className="flex-1 justify-center items-center">

                <View className="w-60 h-60 border-4 border-white rounded-xl absolute" />

                <View className="absolute top-0 right-0 mt-60 mr-2">
                    <TouchableOpacity onPress={toggleFlash}>
                        {flashState ? (
                            <Ionicons name="flash" size={35} color="white" />
                        ) : (
                            <Ionicons name="flash-off" size={35} color="white" />
                        )}
                    </TouchableOpacity>
                </View>
                
                <View className="absolute bottom-10 self-center">
                    <Button
                        mode="outlined"
                        onPress={() => setScanned(true)}
                    >
                        <Text className="text-xl text-cyan-600">Scan Again?</Text>
                    </Button>
                </View>
            </View>
        </CameraView>
    );
};

export default ScanQR;
