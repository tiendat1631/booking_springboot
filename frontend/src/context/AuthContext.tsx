import { createContext, ReactNode, useContext, useEffect, useState } from "react"

type AuthContextType = {
    userId: string | null,
    isAuthenticated: boolean,
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    userId: null,
    isAuthenticated: false,
    loading: false
})

export const useAuth = () => useContext(AuthContext)

type Props = {
    children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthenticated, setisAuthenticated] = useState<boolean>(false);

    useEffect(() => {

    }, [])

    return (
        <AuthContext.Provider value={{ userId, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    )
}