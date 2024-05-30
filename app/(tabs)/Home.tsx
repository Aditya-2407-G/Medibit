import CustomButton from "@/components/CustomButton";
import { getAccount, getCurrentUser } from "@/lib/appwrite";
import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

const Home = () => {
  const [name, setName] = useState("");

  getAccount().then((user) => {
    if (user) {
      setName(user.name);
    }
  });

  return (
    <SafeAreaView className="bg-primary h-full flex justify-center p-4">
      <Text className="text-white text-2xl font-bold mb-5 text-center">
        Hello, {name}!
      </Text>

      <View className="mt-20">
        <CustomButton
          title="SCAN QR CODE"
          handlePress={undefined}
          containerStyles="w-full mb-10"
          textStyles={undefined}
          isLoading={undefined}
        />

        <CustomButton
          title="Documents"
          handlePress={undefined}
          containerStyles="w-full mb-10"
          textStyles={undefined}
          isLoading={undefined}
        />

        <CustomButton
          title="Find Hospitals and Doctors"
          handlePress={undefined}
          containerStyles="w-full mb-10"
          textStyles={undefined}
          isLoading={undefined}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
