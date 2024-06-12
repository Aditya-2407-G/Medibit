import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have expo vector icons installed

const CustomHeader = ({ title   , showBackButton = true}: {title:any, showBackButton:any}) => {
    const navigation = useNavigation();

    return (
        <View className="bg-white w-full p-4 flex-row items-center shadow-md">
            {showBackButton && (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="mr-4"
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            )}
            <Text className="text-gray-900 text-2xl font-semibold">
                {title}
            </Text>
        </View>
    );
};

export default CustomHeader;
