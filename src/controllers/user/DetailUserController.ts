import { Request, Response } from "express";
import { UserDetailService } from "../../services/user/DetailUserService";

class DetailUserController {
    async handle(req: Request, res: Response) {

        const user_id = req.user_id;

        const userDetailService = new UserDetailService();

        const detailUser = await userDetailService.execute(user_id);

        const response = {
            detailUser,
            message: "Você esta na rota / meus"
        }

        return res.json(response)
    }
}

export { DetailUserController }