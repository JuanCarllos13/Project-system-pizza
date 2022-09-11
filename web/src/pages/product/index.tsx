/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import styles from './styles.module.scss'
import { canSSRAuth } from '../../utils/canSSRAuth'
import { Header } from "../../components/Header";
import { FiUpload } from 'react-icons/fi'
import { useState, ChangeEvent, FormEvent } from "react";
import {setupAPIClient} from '../../services/api'
import { toast } from "react-toastify";



type ItemProps ={
    id: string
    name: string
}

interface CategoryProps{
    categoryList: ItemProps[]
}


export default function Product({categoryList}: CategoryProps) {
    console.log(categoryList)
    const [avatarUrl, setAvatarUrl] = useState('')
    const [imageAvatar, setImageAvatar] = useState(null)
    const [category, setCategory] = useState(categoryList)
    const [categorySelected, setCategorySelectd] = useState(0)
    const [name, setName] = useState("")
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState("")



    function handleFile(e: ChangeEvent<HTMLInputElement>) {

        if (!e.target.files) {
            return
        }

        const image = e.target.files[0];

        if(!image){
            return
        }

        if(image.type === 'image/jpeg' || image.type === 'image/png'){
            setImageAvatar(image)
            setAvatarUrl(URL.createObjectURL(e.target.files[0]))
        }

    }

    //Quando vc seleciona uma nova categoria na lista
    function handleChangeCategory(event){
        // console.log("Categoria selecionado", category[event.target.value])
        setCategorySelectd(event.target.value)
    }

    async function handleRegister(e : FormEvent){
        e.preventDefault()

        try{
            const data = new FormData()

            if(name === '' || price === '' || description === '' || imageAvatar === null){
                toast.error('Preencha todos os campos')
                return
            }

            data.append('name', name)
            data.append('price', price)
            data.append('description', description)
            data.append('category_id', category[categorySelected].id)
            data.append('file', imageAvatar)

            const apiClient = setupAPIClient()

            await apiClient.post("/product", data)

            toast.success("Produto cadastrado com sucesso")



        }catch(err){
            console.log(err)
            toast.error("Erro ao cadastrar")

        }

        setName("")
        setPrice("")
        setDescription("")
        setImageAvatar(null)
        setAvatarUrl('')
    }


    return (
        <>
            <Head>
                <title>Novo Produto</title>
            </Head>
            <div>
                <Header />

                <main className={styles.container}>
                    <h1>Novo produto</h1>

                    <form className={styles.form} onSubmit={handleRegister}>

                        <label className={styles.labelAvatar}>
                            <span>
                                <FiUpload size={30} color='white' />
                            </span>

                            <input type={'file'} accept="image/png, image/jpeg" onChange={handleFile} />

                            {avatarUrl && (
                                <img
                                    className={styles.preview}
                                    src={avatarUrl}
                                    alt="Foto do produto"
                                    width={250}
                                    height={250}
                                />
                            )}
                        </label>


                        <select value={categorySelected} onChange={handleChangeCategory}>
                           {category.map((item, index)=>{
                               return(
                                   <option key={item.id} value={index}>
                                       {item.name}
                                   </option>
                               )
                           })}
                         
                        </select>
                        <input
                            type={'text'}
                            placeholder="Digite o nome do produto"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />


                        <input
                            type={'text'}
                            placeholder="Preço do produto"
                            className={styles.input}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <textarea
                            placeholder="Descreva seu produto..."
                            className={styles.input}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <button className={styles.button} type='submit'>
                            Cadastrar
                        </button>



                    </form>
                </main>
            </div>
        </>
    )

}



export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)
    const response = await apiClient.get('/category')
    // console.log(response.data)
    return {
        props: {
        categoryList: response.data
        }
    }
})