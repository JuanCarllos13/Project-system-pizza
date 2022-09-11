import { Request, Response } from "express";
import { ListOrdersService } from "../../services/order/ListOrderService";


class ListOrderController{ //listando todos os pedidos
    async handle(req:Request, res:Response){

        const listOrdesServices = new ListOrdersService

        const orders = await listOrdesServices.execute()
        
        return res.json(orders)
    }
}


export {ListOrderController}