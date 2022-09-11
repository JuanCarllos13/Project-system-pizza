import axios, {AxiosError} from "axios";
import {parseCookies} from 'nookies'  //Trabalhar com Cookies
import {AuthTokenError} from './errors/AuthtokenError'
import {signOut} from '../contexts/AuthContext'

export function setupAPIClient(ctx = undefined){  //Ele sempre vai receber um contexto
    let cookies = parseCookies(ctx)

    const api = axios.create({
        baseURL: "http://localhost:3333",
        headers:{
            Authorization: `Bearer ${cookies['@nextauth.token']}`
        }
    })

    api.interceptors.response.use(response =>{
        return response
    }, (error: AxiosError) => {
        if(error.response.status === 401){
            //Qualquer erro 401 (não autorizado) devemos deslogar o ususario
            if(typeof window !== undefined){
                // Chamar a função para deslogar o usuario
                signOut()
            }else{
                return Promise.reject(new AuthTokenError())
            }
        }

        return Promise.reject(error)
    })

    return api


}