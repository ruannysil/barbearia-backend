import prismaClient from "../../prisma";

interface HaircutRequest {
    user_id: string;
    name: string;
    price: number;
}

// Verificar quantos modelos esse usuario já tem cadastrado
// verificar se ele é premium se nao limitamos a quantidade de modelos para cadastrar

class CreateHaircutService {
    async execute({ user_id, name, price }: HaircutRequest) {
        if (!name || !price) {
            throw new Error("Error")
        }

        const myHaircut = await prismaClient.haircut.count({
            where: {
                user_id: user_id
            }
        })

        const user = await prismaClient.user.findFirst({
            where: {
                id: user_id,
            },
            include: {
                subscriptions: true,
            }
        })

        // Podemos criar uma validação ou limite
        if (myHaircut >= 3 && user?.subscriptions?.status !== 'active') {
            throw new Error("Not authorized")
        }

        const haircut = await prismaClient.haircut.create({
            data: {
                name: name,
                price: price,
                user_id: user_id
            }
        })

        return haircut
    }
}

export { CreateHaircutService }