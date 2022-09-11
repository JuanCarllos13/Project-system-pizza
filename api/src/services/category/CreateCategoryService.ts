import prismaClinte from "../../prisma";

interface categoryRequest{
    name: string
}


class CreateCategoryService{
    async execute({name}: categoryRequest){

        if (name == ''){
            throw new Error("Name invalid")
        }

        const category = await prismaClinte.category.create({
            data:{
                name: name,
            },
            select:{
                id: true,
                name:true
            }
        })
        return category

    }
}


export { CreateCategoryService}