import {Request, Response} from 'express'
import { CreateProductService } from '../../services/product/CreateProductService'


class CreateProductController{
    async handle(req: Request, res: Response){
        const {name, price, description, category_id} = req.body  // Pegando o valor do usuário, obrigatorio pro typeScript


        const createProductService = new CreateProductService()

        if(!req.file){
            throw new Error("error upload file")
        }else{
            const {originalname, filename: banner} = req.file
            

            const product = await createProductService.execute({
                name, price, description, category_id, banner
            })
            return res.json(product)
        }
        
    }
}

export {CreateProductController}
