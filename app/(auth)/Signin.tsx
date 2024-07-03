import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { Signin, getCurrentUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalContextProvider";
import Lottie from "lottie-react-native";

const SignIn = () => {
    const { setUser, setIsLogged } = useGlobalContext();

    const [isSubmitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const submit = async () => {
        if (!form.email || !form.password) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }
        setSubmitting(true);

        try {
            await Signin(form.email, form.password);

            const result = await getCurrentUser();

            setUser(result);
            setIsLogged(true);

            Alert.alert("Success", "Logged in successfully");
            router.replace("/Home");
        } catch (error: any) {
            Alert.alert(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>

                <View className="w-full justify-center px-4 py-6">

                    <View className="self-center">
                        <Lottie
                            source={require("../../assets/animations/schedule.json")}
                            autoPlay
                            style={{ height: 300, width: 300 }}
                        />
                    </View>

                    <Text className="text-3xl text-center font-semibold text-white">
                        Log in to Medibit
                    </Text>

                    <FormField
                        title="Email"
                        value={form.email}
                        placeholder="Email"
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                    />
                    <FormField
                        title="Password"
                        value={form.password}
                        placeholder="Password"
                        handleChangeText={(e) =>
                            setForm({ ...form, password: e })
                        }
                        otherStyles="mt-8"
                    />

                    <CustomButton
                        title="Sign In"
                        handlePress={submit}
                        containerStyles="mt-7"
                        isLoading={isSubmitting}
                        textStyles={undefined}
                    />

                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Don't have an account?
                        </Text>
                        <Link
                            href="/Signup"
                            className="text-lg font-psemibold text-pink-300"
                        >
                            Sign Up
                        </Link>
                    </View>

                </View>
                
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;
