import prismaClinte from "../../prisma";

interface OrderRequest{
    order_id
}

class SendOrderService{
     async execute({order_id}: OrderRequest ){

        const order = await prismaClinte.order.update({ //Atualizar no banco apenas um item
            where:{
                id: order_id  // Atualizar se p id for o mesmo que o usuario esteja passando
            },
            data:{
                draft: false  // Vai atualizar na tabela order apenas o item de draft
            }
        })  
        return order;

     }
}

export { SendOrderService}