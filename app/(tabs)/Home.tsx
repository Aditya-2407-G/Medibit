import CustomButton from "@/components/CustomButton";
import { getAccount } from "@/lib/appwrite";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
    const [name, setName] = useState("");

    useEffect(() => {
        getAccount().then((user) => {
            if (user) {
                setName(user.name);
            }
        });
    }, []);

    const handleScanQR = () => {
        router.push("../ScanQR");
    };
    const handleDocuments = () => {
        router.push("../Documents");
    };

    return (
            <SafeAreaView className=" bg-primary h-full">
                <View className="container">
                    <View className="flex-row justify-between items-center px-4 mt-4">
                        <Text className="text-white text-3xl font-pbold">
                            Hello, {name}!
                        </Text>
                    </View>

                    <View className="mt-10 flex-col justify-center min-h-[85vh]">
                        <View className="flex flex-row flex-wrap-reverse justify-around">
                            <View className="m-2">
                                <CustomButton
                                    title="Find Hospitals and Doctors"
                                    handlePress={undefined}
                                    containerStyles="w-40 h-40 justify-center"
                                    textStyles="text-center"
                                    isLoading={undefined}
                                />
                            </View>
                            <View className="m-2">
                                <CustomButton
                                    title="Documents"
                                    handlePress={handleDocuments}
                                    containerStyles="w-40 h-40 justify-center"
                                    textStyles="text-center"
                                    isLoading={undefined}
                                />
                            </View>
                            <View className="m-2">
                                <CustomButton
                                    title="SCAN QR CODE"
                                    handlePress={handleScanQR}
                                    containerStyles="w-40 h-40 justify-center"
                                    textStyles="text-center"
                                    isLoading={undefined}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>

    );
};

export default Home;
