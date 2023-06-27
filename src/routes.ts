// import express, { Router, Request, Response, } from 'express';

// import { CreateUserController } from './controllers/user/CreateUserController';
// import { AuthUserController } from './controllers/user/AuthUserService';
// import { DetailUserController } from './controllers/user/DetailUserController';

// import isAuthenticated from './middlewares/isAuthenticated';
// import { UpdateUserController } from './controllers/user/UpdateUserController';
// import { CreateHaircutController } from './controllers/haircut/CreateHaircutController';

// import { ListHaircutController } from './controllers/haircut/ListHaircutController';
// import { UpdateHaircutController } from './controllers/haircut/UpdateHaircutController';
// import { CheckSubscriptionControlle } from './controllers/haircut/CheckSubscriptionController';
// import { CountHaircutsController } from './controllers/haircut/CountHaircutsController';
// import { DetailHaircutController } from './controllers/haircut/DetailHaircutController';
// import { NewScheduleController } from './controllers/schedule/NewScheduleController';
// import { ListScheduleController } from './controllers/schedule/ListScheduleController';
// import { FinishScheduleController } from './controllers/schedule/FinishScheduleController';
// import { SubscribeController } from './controllers/subscription/SubscribeController';
// import { WebhooksController } from './controllers/subscription/WebhooksController';
// import { CreatePortalController } from './controllers/subscription/CreatePortalController';

// const router = Router();

// router.get('/', (req: Request, res: Response) => {

//     return res.json({ ok: 'hello word' })
// })

// // --- ROTA USER --

// router.post("/users", new CreateUserController().handle)
// router.post("/session", new AuthUserController().handle)
// router.get("/me", isAuthenticated, new DetailUserController().handle)
// router.put("/users", isAuthenticated, new UpdateUserController().handle)

// // --- ROTA HAIRCUTS
// router.post("/haircut", isAuthenticated, new CreateHaircutController().handle)
// router.get("/haircuts", isAuthenticated, new ListHaircutController().handle)
// router.put("/haircut", isAuthenticated, new UpdateHaircutController().handle)
// router.get("/haircut/check", isAuthenticated, new CheckSubscriptionControlle().handle)
// router.get("/haircut/count", isAuthenticated, new CountHaircutsController().handle)
// router.get("/haircut/detail", isAuthenticated, new DetailHaircutController().handle)

// // -- ROTA SCHEDULE / SERVICOS
// router.post("/schedule", isAuthenticated, new NewScheduleController().handle)
// router.get("/schedule", isAuthenticated, new ListScheduleController().handle)
// router.delete("/schedule", isAuthenticated, new FinishScheduleController().handle)


// // --ROTA PAGAMENTOS --
// router.post("/subscribe", isAuthenticated, new SubscribeController().handle)
// router.post("/webhooks", express.raw({ type: 'application/json' }), new WebhooksController().handle)
// router.post("/create-portal", isAuthenticated, new CreatePortalController().handle)

// export { router };