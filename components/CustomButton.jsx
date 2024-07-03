import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

export const CustomButton = ({
    title,
    handlePress,
    containerStyles,
    textStyles,
    isLoading,
}) => {
    return (
        
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`rounded-xl bg-buttonclr min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${
                
                isLoading ? "opacity-50" : ""
            }`}
            disabled={isLoading}
        >
            <Text
                className={`text-primary text-center font-pmedium text-lg ${textStyles}`}
            >
                {title}
            </Text>

            {isLoading && (
                <ActivityIndicator
                    animating={isLoading}
                    color="#fff"
                    size="small"
                    className="ml-2"
                />
            )}
        </TouchableOpacity>
    );
};

export default CustomButton;
