import prismaClinte from '../../prisma'
import {hash} from 'bcryptjs'

interface UserRequest{
    name: string;
    email: string;
    password: string;
}

class CreateUserServices{
    async execute({name, email, password}:UserRequest){
      
        // verificar se ele enviou um email
        if(!email){
            throw new Error("Email incorrect")
        }
        // Verificar se esse email já está cadastrado
        const userAlreadtExists = await prismaClinte.user.findFirst({   // findFirst: pegar o primeiro elemento que encontrar
          where:{
              email:email
          }
        })

        if(userAlreadtExists){
            throw new Error("User already ecists")
        
        }

        const passwordHash = await hash(password, 8)  // Criptografando e salavando no banco de dados


        // Cadastrando usuario no banco de dados
        const user = await prismaClinte.user.create({
            data:{
                name: name,
                email: email,
                password: passwordHash
            },
            select:{  // Devolvendo apenas esses itens ao insomnia
                id: true,
                name: true,
                email: true
                
            }
        })

        return user

    }
}

export {CreateUserServices }