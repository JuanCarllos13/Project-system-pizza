import { Request, Response } from "express";
import {CreateOrderServices} from '../../services/order/CreateOrderServices'


class CreateOrdefController{
    async handle(req: Request, res: Response){

        const {table, name} = req.body

        const createOrderService = new CreateOrderServices()

        const order = await createOrderService.execute({
            table, name
        })
        return res.json(order)

    }
}


export {CreateOrdefController}