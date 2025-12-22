import { logout, refresh } from "@/services/auth/authServices"
import { UserResponse } from "@/services/auth/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { toast } from "react-toastify";

// ===== Access Token =====
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

export const getAccessToken = () => {
    return accessToken;
}

// ===== Type =====
type AuthContextType = {
    user: UserResponse | null,
    isAuthenticated: boolean,
    loading: boolean,
    handleLogin: (user: UserResponse, accessToken: string) => void;
    handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    loading: false,
    handleLogin: () => { },
    handleLogout: () => { }
})

type Props = {
    children: ReactNode;
}
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const handleLogin = (user: UserResponse, accessToken: string) => {
        setAccessToken(accessToken);
        setUser(user);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setAccessToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const reLogin = async () => {
            try {
                const res = await refresh();
                if (res.success) {
                    const { accessToken, user } = res.data;

                    handleLogin(user, accessToken);
                } else {
                    console.log("Unauthorized")
                    handleLogout()
                }
            } finally {
                setLoading(false);
            }
        };

        reLogin();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, handleLogin: handleLogin, handleLogout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}
