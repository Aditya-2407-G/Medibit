import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "../context/GlobalContextProvider";
import { HelloWave } from "@/components/HelloWave";
import React from "react";
import Lottie  from "lottie-react-native"

export default function Index() {
    const { isLoading, isLogged } = useGlobalContext();

    if (!isLoading && isLogged) {
        return <Redirect href="/Home" />;
    }
    return (
        <SafeAreaView className="flex bg-primary">
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                <StatusBar backgroundColor="#161622" style="light" />


                <View>
                    <Text className="text-white font-extrabold text-center text-3xl p-10">
                        Welcome to Medibit !
                    </Text>
                    <Lottie source={require("../assets/animations/animation.json")} autoPlay style={{width: "100%", height: 350}}/>
                </View>

                <View className="flex items-center justify-center mt-10">
                    <CustomButton
                        title="Sign In"
                        handlePress={() => router.push("/Signin")}
                        containerStyles="w-full mb-10"
                        textStyles={undefined}
                        isLoading={undefined}
                    />
                    <CustomButton
                        title="Sign Up"
                        handlePress={() => router.push("/Signup")}
                        containerStyles="w-full"
                        textStyles={undefined}
                        isLoading={undefined}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
