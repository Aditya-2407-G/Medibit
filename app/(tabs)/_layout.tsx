import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";

import { icons } from "../../constants";
import { Loader } from "../../components/Loader";
import { useGlobalContext } from "../../context/GlobalContextProvider";
import { TabIcon } from "@/components/TabIcon";

const TabLayout = () => {
    const { loading, isLogged } = useGlobalContext();

    // check if needed or not
    if (!isLogged) return <Redirect href="/Signin" />;

    return (
        <>
            <Loader isLoading={loading} />
            <StatusBar backgroundColor="#161622" style="light" />
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#3A83F4",
                    tabBarInactiveTintColor: "#CDCDE0",
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: "#1E1E2C",
                        borderTopWidth: -1,
                        height: 70,
                        borderRadius: 100,
                        position: 'absolute',
                        bottom: 20, // Adjust this value to move the tab bar up
                        left: 10,  // Add padding from left
                        right: 10, // Add padding from right
                    },
                }}
            >
                <Tabs.Screen
                    name="Home"
                    options={{
                        title: "Home",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.home}
                                color={color}
                                name="Home"
                                focused={focused}
                                containerStyle="w-6 h-6"
                                iconStyle="gap-2"
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="Workout"
                    options={{
                        title: "Workout",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.crossfit}
                                color={color}
                                name="Workout"
                                focused={focused}
                                containerStyle="w-6 h-6"
                                iconStyle="gap-2"
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="Profile"
                    options={{
                        title: "Profile",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.profile}
                                color={color}
                                name="Profile"
                                focused={focused}
                                containerStyle="w-6 h-6"
                                iconStyle="gap-2"
                            />
                        ),
                    }}
                />
            </Tabs>
        </>
    );
};

export default TabLayout;
