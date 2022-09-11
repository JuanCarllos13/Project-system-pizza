import prismaClinte from "../../prisma";
import {compare} from 'bcryptjs' // Comparar as senhas criptografada
import { sign } from 'jsonwebtoken'  // Geranção do token

interface AuthRequest{
    email: string;
    password: string;
}

class AuthUserServices{
    async execute({email, password}: AuthRequest){
        //Verificar se o email existe

        const user = await prismaClinte.user.findFirst({
            where:{
                email: email
            }
        })

        if(!user){
            throw new Error("User/password incorrect")
        }

        // Verificar se a senha que ele madnou ta correta
        const passwordMatch = await compare(password, user.password)

        if(!passwordMatch){ // se a senha estiver incorreta
            throw new Error("User/password incorrect")
        }

        // Logar o usuario
        // Gerar um token JWt e devolver os dados do usuario com id, name e email
        // Se deu tudo certo vamos gerar o token
         
        const token = sign(
            {
                name: user.name,
                email: user.email,    
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: '30d'
            }
            
        )


    return {
        id: user.id,
        name: user.name,
        email: user.email,
        token: token
    }

    }
}

export {AuthUserServices}