import { Request, Response } from "express";
import {DetaiOrderService} from '../../services/order/DetaiOrderService'


class DetailOrderController{
    async handle(req: Request, res: Response){

        const order_id = req.query.order_id as string

        const detaiOrderService = new DetaiOrderService()

        const order = await detaiOrderService.execute({
            order_id
        })
        return res.json(order)
    }
}

export {DetailOrderController}