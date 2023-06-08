import { Request, Response } from 'express'
import { CheckSubscriptionService } from '../../services/haircut/CheckSubscriptionService'

class CheckSubscriptionControlle {
    async handle(req: Request, res: Response) {
        const user_id = req.user_id;
        const checkSubscreiptionService = new CheckSubscriptionService();

        const status = await checkSubscreiptionService.execute({
            user_id
        })

        return res.json(status)
    }
}

export { CheckSubscriptionControlle }