import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import React from 'react';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  

const  ScanQR = () => {

  const [permission, requestPermission] = useCameraPermissions();
  const [flashState, setFlashState] = useState(false);
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className='bg-primary h-full flex justify-center'>
        <Text className='text-white font-bold text-2xl mb-10'>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const toggleFlash = () => {
    setFlashState(current => !current);
  }

  const handleBarCodeScanned = ({ data }:{data:string}) => {
    setScanned(true);
    Alert.alert(`Bar code data ${data} has been scanned!`);
    // Optionally, you can process the scanned data here
    setTimeout(() => setScanned(false), 3000);
  };


  return (

      <CameraView className='flex-1' facing= "back" enableTorch={flashState} onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} barcodeScannerSettings={{
        barcodeTypes:['qr']
      }}>
        <View className='flex-1 flex-row justify-center items-end mb-10'>
          <TouchableOpacity className=' bg-opacity-50  rounded' onPress={toggleFlash}>

            {flashState ? (
              
            <Ionicons name="flash" size={35} color="white" />
            ):(
              <Ionicons name="flash-off" size={35} color="white" />
            )}
            
          </TouchableOpacity>


        </View>
      </CameraView>

  );
}

export default ScanQR;

