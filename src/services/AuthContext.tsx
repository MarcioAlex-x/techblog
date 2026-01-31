import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth"
import { createContext, useEffect, useState } from "react"
import { auth } from "../firebaseConfig"

type AuthContextType = {
    user:User|null
    login:(email:string, password:string)=>Promise<void>
    logout:()=>Promise<void>
}

export const AuthContext = createContext<AuthContextType|null>(null)

export const AuthProvider = ({children}:{children:React.ReactNode})=>{
    const [user, setUser] = useState<User|null>(null)

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, currentUser=>{
            setUser(currentUser)
        })
        return unsubscribe
    },[user])

    const login = async (email:string, password:string)=>{
        await signInWithEmailAndPassword(auth, email, password)
    }

    const logout = async ()=>{
        await signOut(auth)
    }

    return(
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )

}

