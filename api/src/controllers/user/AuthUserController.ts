import {Request, Response} from 'express'

import {AuthUserServices} from '../../services/user/AuthUserServices'


class AuthUserController{
    async handle(req: Request, res: Response){
        const { email, password} = req.body  //Pegando o valor no body, que o usuario tá digitando
        
        const authUserServices = new AuthUserServices();

        const auth = await authUserServices.execute({
            email,
             password
        })

        return res.json(auth)

    }

}


export {AuthUserController}