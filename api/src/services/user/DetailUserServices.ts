import prismaClinte from "../../prisma";

class DetailUserServices{
    async execute(user_id: string){

        const user = await prismaClinte.user.findFirst({
            where:{
                id: user_id
            },
            select:{  //devolver essas informações
                id: true,
                name: true,
                email: true


            }
        })
        return user

    }

}


export {DetailUserServices}