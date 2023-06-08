import prismaClient from "../../prisma";

interface DetailRequest {
    haircut_id: string;
}

class DetailHaircutService {
    async execute({ haircut_id }: DetailRequest) {
        const haircut = await prismaClient.haircut.findFirst({
            where:{
                id: haircut_id
            }
        })

        return haircut;
    }
}

export { DetailHaircutService }