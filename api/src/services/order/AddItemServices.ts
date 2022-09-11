import prismaClinte from "../../prisma";

interface ItemRequest{
    order_id: string,
    product_id: string,
    amount: number
}


class AddItemServices{
    async execute({order_id, product_id, amount}: ItemRequest){
        const order = await prismaClinte.item.create({
            data:{
                order_id: order_id,
                product_id: product_id,
                amount
            }
        })

        return order;
    }

}


export {AddItemServices}