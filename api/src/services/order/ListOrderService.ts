import prismaClinte from "../../prisma";

class ListOrdersService{
    async execute(){
        const orders = await prismaClinte.order.findMany({  // Buscar varios produtos
            where:{
                draft: false,
                status: false,
            },
            orderBy:{
                created_at: 'desc'
            }
        })
        return orders
    }
}

export {ListOrdersService}