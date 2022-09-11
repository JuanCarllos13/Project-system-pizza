import { createContext, ReactNode, useState, useEffect } from 'react'
import {destroyCookie, setCookie, parseCookies} from 'nookies'  //Deletar o Cookies
import Router from 'next/router'  // Fazer rotiamento, mandar o usuario pra uma rota
import { api } from '../services/apiClient';
import {toast} from 'react-toastify'

type AuthContextData = {
    user: UserProps //Todos os paramentros do usuario
    isAuthenticated: boolean; //verificar se o usuario tem token
    signIn: (credentials: SignInProps) => Promise<void> //Função para logar
    signOut: () => void;  // Função pra deletar o token
    signUp: (credentials: SignUpProps) => Promise<void>
}
type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string
    password: string
}

type AuthProviderProps = {
    children: ReactNode
}

type SignUpProps ={
    name: string
    email: string
    password: string
}


export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    try{ //Delatar o token
        destroyCookie(undefined, '@nextauth.token')
        Router.push("/")
    }catch{
        console.log("Error ao deslogar")

    }
}


export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user

    useEffect(()=>{  //Buscando informações do usuario sempre que ele sair da tela de pesquisa
        // Tentar pegar algo no cookie, que é o token
        const { '@nextauth.token': token } = parseCookies()

        if(token){
            api.get('/me').then(response =>{
                const {id, name, email} = response.data; // Pegando os valores
                setUser({
                    id,
                    name,
                    email
                })
            })
            .catch(()=>{
                //Se deu errom deslogamos o user
                signOut()
            })
        }
    },[])

    async function signIn({ email, password }: SignInProps) { //Logando usuario
        try{
            const response = await api.post('/session', {
                email,
                password
            })
            // console.log(response.data)
            const {id, name, token} = response.data
            setCookie(undefined, '@nextauth.token', token, {  // @nextauth.token É O NOME DO TOKEN, ESTIVER USANDO ESTOU ME REFIRANDO AO TOKEN
                maxAge: 60 * 60 *24 *30, // Expirar em um mes
                path: "/" //Quais caminhos terao acesso ao cookie
            })

            setUser({id, name, email}) //Salvando as informacções no estado

            //Passar para as proximas requisições o nosso token
            api.defaults.headers['Authorization'] =  `Bearer ${token}`

            toast.success("Logado com sucesso")

            //Redirecionar o user para /dashboard
            Router.push('/dashboard')

        }catch(err){
            toast.error("Erro ao acessar")
            console.log("Erro ao acessar ", err)

        }
    }


    async function signUp({name, password, email}: SignUpProps){ //Cadastrando o usuario
       try{
           const response = await api.post('/users', {
               name,
               email,
               password
           })

           toast.success("Cadastrado com sucesso")

           Router.push("/")

       }catch(err){
           toast.error("Erro ao cadastrar")
           console.log("Erro ao cadastrar", err)
       }

    }


    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}