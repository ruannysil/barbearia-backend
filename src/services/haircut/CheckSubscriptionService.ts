import prismaClient from "../../prisma";

interface CheckSubscription {
    user_id: string;
}

class CheckSubscriptionService {
    async execute({ user_id }: CheckSubscription) {

        const status = await prismaClient.user.findFirst({
            where: {
                id: user_id,
            },
            select: {
                subscriptions: {
                    select: {
                        id: true,
                        status: true,
                    }
                }
            }
        })

        return status;
    }
}

export { CheckSubscriptionService }