import prismaClinte from "../../prisma";
interface ProductRequest {
    name: string,
    price: string,
    description: string,
    category_id: string,
    banner: string,
}
class CreateProductService {
    async execute({ name, price, description, banner, category_id }: ProductRequest) {

        const product = await prismaClinte.product.create({
            data: {
                name: name,
                price: price,
                description: description,
                banner: banner,
                category_id: category_id,
            }
        })
        return product
    }
}

export { CreateProductService }

