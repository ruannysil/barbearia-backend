import prismaClient from "../../prisma";


interface ListScheduleRequest {
    user_id: string;
}

class ListScheduleService {
    async execute({ user_id }: ListScheduleRequest) {
        const shedule = await prismaClient.service.findMany({
            where: {
                user_id: user_id,
            },
            select: {
                id: true,
                customer: true,
                haircut: true,
            }
        })

        return shedule;
    }
}

export { ListScheduleService }