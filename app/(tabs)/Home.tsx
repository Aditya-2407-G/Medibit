import React, { useEffect, useState } from "react";
import {
    ImageBackground,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getAccount } from "@/lib/appwrite";

const Home = () => {
    const [name, setName] = useState("");

    useEffect(() => {
        getAccount().then((user) => {
            if (user) {
                setName(user.name);
            }
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
                    <Text className="text-white text-center text-3xl font-extrabold mt-2">{name}</Text>
                    

                </ImageBackground>

            <View className="bg-slate-900 rounded-t-3xl mt-[-30px] p-5 h-full">
                <Text className="text-white text-xl font-semibold mb-5">
                    What would you like to do today?
                </Text>

                <View className="mt-10">
                    <TouchableOpacity
                        className="items-center bg-buttonclr rounded-lg p-4 mb-4"
                        onPress={handleDisplayDocuments}
                    >
                        <MaterialCommunityIcons
                            name="file-document-outline"
                            size={24}
                            color="white"
                        />
                        <Text className="ml-4 text-base text-white">
                            View Saved Documents
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="items-center bg-buttonclr rounded-lg p-4 mb-4"
                        onPress={handleDocuments}   
                    >
                        <MaterialCommunityIcons
                            name="file-plus-outline"
                            size={24}
                            color="white"
                        />
                        <Text className="ml-4 text-base text-white">
                            Save Documents
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="items-center bg-buttonclr rounded-lg p-4 mb-4"
                        onPress={handleDisplayDocuments}
                    >
                        <MaterialCommunityIcons
                            name="hospital-box"
                            size={24}
                            color="white"
                        />
                        <Text className="ml-4 text-base text-white">
                            Search Hospitals Near You
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Home;
