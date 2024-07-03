import { useContext, createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../lib/appwrite";
import { PaperProvider } from "react-native-paper";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);
const GlobalContextProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then((res) => {
                if (res) {
                    setIsLogged(true);
                    setUser(res);
                } else {
                    setIsLogged(false);
                    setUser(null);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <GlobalContext.Provider
            value={{ isLogged, setIsLogged, user, setUser, loading }}
        >
            <PaperProvider>{children}</PaperProvider>
        </GlobalContext.Provider>
    );
};

export default GlobalContextProvider;
