import { json, Request, Response } from "express";
import {AddItemServices} from '../../services/order/AddItemServices'


class AddItemController{
    async handle(req: Request, res: Response){

        const {order_id, product_id, amount} = req.body;

        const addItem = new AddItemServices()

        const order = await addItem.execute({
            order_id,
            product_id, 
            amount
        })
        return res.json(order)

    }

}


export {AddItemController}