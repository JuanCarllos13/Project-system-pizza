import React, { useState, createContext, ReactNode, useEffect } from "react";
import { api } from '../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

type AuthContextData = {
    user: UserProps //Todas as informações do usuario
    isAuthenticated: boolean
    signIn: (info: SignInProps) => Promise<void>
    loadingAuth: boolean
    loading: boolean
    signOut: () => Promise<void>
}

type UserProps = {  //Informações que o Back-end espera ao logar o usuario
    id: string
    name: string
    email: string
    token: string
}

type AuthProviderProps = {
    children: ReactNode
}

type SignInProps = {
    email: string
    password: string
}


export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>({
        id: '',
        name: '',
        email: '',
        token: ''
    })
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    const isAuthenticated = !!user.name // Convertando para bollean. Se ele tiver um nome então ele tá logado

    useEffect(() => {
        async function getUser() {
            //Pegar os dados salvos do user
            const userInfo = await AsyncStorage.getItem('@pizzaria')
            let hasUser: UserProps = JSON.parse(userInfo || '{}') //Transformando em um objeto

            //Verificar se recebemos as informçães do user
            if (Object.keys(hasUser).length > 0) { // Se tiver coisa, então o usuario possui login
                api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`

                setUser({
                    id: hasUser.id,
                    name: hasUser.name,
                    email: hasUser.email,
                    token: hasUser.token
                })
            }
            setLoading(false)
        }
        getUser()

    }, [])

    async function signIn({ email, password }: SignInProps) {
        setLoadingAuth(true)

        try {
            const response = await api.post('/session', {
                email,
                password
            })
            // console.log(response.data)

            const { id, name, token } = response.data

            const data = {  // Convertando para um objeto
                ...response.data
            }
            await AsyncStorage.setItem("@pizzaria", JSON.stringify(data)) //Convertendo para uma string para poder salvar no Storage

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            setUser({
                id,
                name,
                email,
                token
            })
            setLoadingAuth(false)

        } catch (err) {
            console.log('error ao acessar', err)
            setLoadingAuth(false)

        }
    }

    async function signOut(){
        await AsyncStorage.clear()
        .then(()=>{
            setUser({
                id: '',
                name: '',
                email: '',
                token: ''
            })
        })
    }

    // Todas as nossas paginas
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, loadingAuth, loading, signOut }}>
            {children}
        </AuthContext.Provider>

    )
}