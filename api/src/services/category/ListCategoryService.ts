import prismaClinte from "../../prisma";



class ListCategoryService{
    async execute(){  //Buscar todas as cateorias
        

        const category = await prismaClinte.category.findMany({  //Trazer tudo que ele encontrar
            select:{ //Somente com essas informações
                id: true,
                name: true,
            }
        })
        return category;
    }
}


export {ListCategoryService}