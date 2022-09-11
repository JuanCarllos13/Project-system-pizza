/* eslint-disable @next/next/no-typos */
import React, { useContext, FormEvent, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import LogoImg from '../../public/logo.svg'
import styles from '../../styles/home.module.scss'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { AuthContext } from '../contexts/AuthContext'
import { toast } from "react-toastify"
import {canSSRGuest} from '../utils/canSSRGuest'

import Link from 'next/link'

export default function Home() {
  const { signIn } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)


  async function handleLogin(event: FormEvent) {
    event.preventDefault()  //Pra não rederizar a pagina sozinho

    if (email === '' || password === '') {
      toast.error("Preencha todos os campos")
      return
    }

    setLoading(true)

    let data = {
      email,
      password
    }

    signIn(data)
    setLoading(false)

  }


  return (
    <>
      <Head>
        <title>SujeitoPizza - Faça seu login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={LogoImg} alt="Logo do Pizzaria" />

        <div className={styles.login}>
          <form onSubmit={handleLogin}>

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
              Acessar
            </Button>
          </form>

          <Link href='/signup'>
            <a className={styles.text}>Não possui uma conta? Cadastre-se</a>
          </Link>

        </div>

      </div>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) =>{

  return{
    props: {}
  }

})
  
