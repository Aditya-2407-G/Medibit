import React from "react";
import { View, Image, Text } from "react-native";
export const TabIcon = ({icon,color,name,focused,containerStyles,}: any) => {
    
    return (
        <View className="flex items-center justify-center w-7 h-8">
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className={`w-5 h-4 ${containerStyles}`}
            />
            <Text
                className={`${
                    focused ? "font-psemibold" : "font-pregular"
                } text-xs`}
                style={{ color: color }}
            >
                {name}
            </Text>
        </View>
    );
};
