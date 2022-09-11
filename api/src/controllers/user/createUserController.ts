import {Request, response, Response} from 'express'
import {CreateUserServices} from '../../services/user/createUserService'

class CreateUserController{
    async handle(req: Request, res: Response){
        const { name, email, password} = req.body

        const createUserService = new CreateUserServices()

        const user = await createUserService.execute({
            name,
            email,
            password
        })

        return res.json(user)

    }
}

export {CreateUserController}