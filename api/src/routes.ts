import { Router } from 'express'
import multer from 'multer'
import { CreateUserController } from './controllers/user/createUserController'
import { AuthUserController } from './controllers/user/AuthUserController'
import { DetailuserServices } from './controllers/user/DetailUserController'
import { isAuthenticated } from './middlewares/isAuthenticated'
import {CreateCategoryController} from './controllers/category/CreateCategoryController'
import { ListCategoryController } from './controllers/category/ListCategoryController'
import {CreateProductController} from './controllers/product/CreateProductController'
import uploadConfig from './config/multer'
import { ListByCategoryController } from './controllers/product/ListByCategoryController'
import { CreateOrdefController } from './controllers/order/CreateOrdefController'
import { RemoveOrderController } from './controllers/order/RemoveOrderController'
import { AddItemController } from './controllers/order/AddItemController'
import {RemoveItemController} from './controllers/order/RemoveItemController'
import { SendOrderController } from './controllers/order/SendOrderController'
import { ListOrderController } from './controllers/order/ListOrderController'
import { DetailOrderController } from './controllers/order/DetailOrderController'
import { FinishOrderController }  from './controllers/order/FinishOrderController'

const router = Router();

const upload = multer(uploadConfig.upload("./tmp"));
// -- ROTAS USER --
router.post('/users', new CreateUserController().handle)

router.post('/session', new AuthUserController().handle)

router.get('/me', isAuthenticated, new DetailuserServices().handle)   //"get"  Pra poder buscar informações do usuário

// ==ROTAS DE CATEGORY
router.post('/category', isAuthenticated, new CreateCategoryController().handle)

router.get('/category',isAuthenticated, new ListCategoryController().handle) //Listando as categorias, por isso get

// --- Rota product

router.post('/product', isAuthenticated, upload.single('file'), new CreateProductController().handle) //Pra criar algo

router.get('/category/product', isAuthenticated, new ListByCategoryController().handle )  //Pegar as os produtos

// -----Rotas de Order
router.post('/order', isAuthenticated, new CreateOrdefController().handle) //cadastrar pedido

router.delete('/order', isAuthenticated, new RemoveOrderController().handle)

router.post('/order/add', isAuthenticated, new AddItemController().handle)

router.delete('/order/remove', isAuthenticated, new RemoveItemController().handle)

router.put('/order/send', isAuthenticated, new SendOrderController().handle) //ATUALIZAR 

router.get('/orders', isAuthenticated, new ListOrderController().handle) //Listar todos os produtos

router.get('/order/detail', isAuthenticated, new DetailOrderController().handle)

router.put('/order/finish', isAuthenticated, new FinishOrderController().handle )

export { router }


