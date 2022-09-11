/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState, FormEvent, useContext} from "react"
import Head from "next/head"
import Image from "next/image"
import LogoImg from '../../../public/logo.svg'
import styles from '../../../styles/home.module.scss'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

import {AuthContext} from '../../contexts/AuthContext'

import Link from 'next/link'
import { toast } from "react-toastify"

export default function signUp() {
    const {signUp} = useContext(AuthContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)


    async function HandleSignUp(event: FormEvent){
        event.preventDefault();

        if(name === '' || email === '' || password === ''){
            toast.error("Preencha todos os campos")
            return
        }

        setLoading(true)

        let data={
            name,
            email,
            password
        }

        await signUp(data)

        setLoading(false)
        
        
    }
    
    return (
        <>
            <Head>
                <title>Faça seu cadastro agora!</title>
            </Head>
            <div className={styles.containerCenter}>
                <Image src={LogoImg} alt="Logo do Pizzaria" />

                <div className={styles.login}>
                    <h1>Criando sua conta</h1>
                    <form onSubmit={HandleSignUp}>

                        <Input placeholder="Digite seu Nome"
                            type={'text'}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Input placeholder="Digite seu Email"
                            type={'text'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input placeholder="Sua Senha"
                            type={'text'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            type='submit'
                            loading={loading}
                        >
                            Cadastrar
                        </Button>
                    </form>

                    <Link href='/'>
                        <a className={styles.text}>Já possui um conta? Faça login! </a>
                    </Link>

                </div>

            </div>
        </>
    )
}
