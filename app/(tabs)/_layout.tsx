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
                    tabBarActiveTintColor: "#F9A8D4",
                    tabBarInactiveTintColor: "#CDCDE0",
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: "#161622",
                        borderTopWidth: 1,
                        borderTopColor: "#232533",
                        height: 70,
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
                            />
                        ),
                    }}
                />
            </Tabs>
        </>
    );
};

export default TabLayout;
