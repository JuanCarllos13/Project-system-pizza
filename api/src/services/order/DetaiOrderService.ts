import prismaClinte from "../../prisma";


interface DetailRequest{  //Listar todos com o id do produto
    order_id: string  //Passando como paramentro
}


class DetaiOrderService{
    async execute({order_id}: DetailRequest){

        const orders = await prismaClinte.item.findMany({
            where:{
                order_id: order_id
            },
            include:{ //Incluir tudo que tiver no produto e no pedido na response
                product: true,
                order: true
            }
        }) 
        
        return orders

    }
}


export {DetaiOrderService}