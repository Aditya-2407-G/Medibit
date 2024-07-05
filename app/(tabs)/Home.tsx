import React, { useEffect, useState } from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getAccount } from "@/lib/appwrite";

const Home = () => {
    const [name, setName] = useState("");

    useEffect(() => {
        getAccount().then((res) => {
            setName(res.name);
        });
    }, []);

    const handleDocuments = () => {
        router.push("../Documents");
    };

    const handleDisplayDocuments = () => {
        router.push("DisplayDocuments");
    };

    return (
        <SafeAreaView className="flex-1">

            <ImageBackground
                source={require("../../assets/images/bgimage.jpg")}
                className="w-full h-[30vh]"
            >
                <Text className="text-white text-center text-3xl font-extrabold mt-20">
                    Welcome Back !
                </Text>

                <Text className="text-white text-center text-3xl font-extrabold mt-2">
                    {name}
                </Text>

            </ImageBackground>

            <View className="flex-1 bg-slate-900 rounded-t-3xl mt-[-30px] p-5">

                <Text className="text-white text-xl font-semibold mt-5">
                    What would you like to do today?
                </Text>

                <View className="flex-row justify-between mt-[100px]">
                    <TouchableOpacity
                        className="flex-1 items-center bg-buttonclr rounded-lg p-4 mr-2"
                        onPress={handleDisplayDocuments}
                    >
                        <MaterialCommunityIcons
                            name="file-document-outline"
                            size={24}
                            color="white"
                        />
                        <Text className="mt-2 text-base text-white text-center">
                            View Saved Documents
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-1 items-center bg-buttonclr rounded-lg p-4 ml-2"
                        onPress={handleDocuments}
                    >
                        <MaterialCommunityIcons
                            name="file-plus-outline"
                            size={24}
                            color="white"
                        />
                        <Text className="mt-2 text-base text-white text-center">
                            Save Documents
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Home;
