var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/routes.ts
var routes_exports = {};
__export(routes_exports, {
  router: () => router
});
module.exports = __toCommonJS(routes_exports);
var import_express = __toESM(require("express"));

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/user/CreateUserService.ts
var import_bcryptjs = require("bcryptjs");
var CreateUserService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ name, email, password }) {
      if (!email) {
        throw new Error("Email incorreto");
      }
      const userAlreadyExists = yield prisma_default.user.findFirst({
        where: {
          email
        }
      });
      if (userAlreadyExists) {
        throw new Error("User/Email already exists");
      }
      const passwordHash = yield (0, import_bcryptjs.hash)(password, 8);
      const user = yield prisma_default.user.create({
        data: {
          name,
          email,
          password: passwordHash
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      });
      return { user };
    });
  }
};

// src/controllers/user/CreateUserController.ts
var CreateUserController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const { name, email, password } = req.body;
      const createUserService = new CreateUserService();
      const user = yield createUserService.execute({
        name,
        email,
        password
      });
      return res.json({ user, ok: "deu certo" });
    });
  }
};

// src/services/user/AuthUserService.ts
var import_bcryptjs2 = require("bcryptjs");
var import_jsonwebtoken = require("jsonwebtoken");
var AuthUserService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ email, password }) {
      var _a, _b;
      const user = yield prisma_default.user.findFirst({
        where: {
          email
        },
        include: {
          subscriptions: true
        }
      });
      if (!user) {
        throw new Error("Email/password incorret");
      }
      const passwordMatch = yield (0, import_bcryptjs2.compare)(password, user == null ? void 0 : user.password);
      if (!passwordMatch) {
        throw new Error("Email/password incorret");
      }
      const token = (0, import_jsonwebtoken.sign)(
        {
          name: user.name,
          email: user.email
        },
        process.env.JWT_SECRET,
        {
          subject: user.id,
          expiresIn: "30d"
        }
      );
      return {
        id: user == null ? void 0 : user.id,
        name: user == null ? void 0 : user.name,
        email: user == null ? void 0 : user.email,
        endereco: user == null ? void 0 : user.endereco,
        token,
        subscriptions: user.subscriptions ? {
          id: (_a = user == null ? void 0 : user.subscriptions) == null ? void 0 : _a.id,
          status: (_b = user == null ? void 0 : user.subscriptions) == null ? void 0 : _b.status
        } : null
      };
    });
  }
};

// src/controllers/user/AuthUserService.ts
var AuthUserController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const { email, password } = req.body;
      const authUserService = new AuthUserService();
      const session = yield authUserService.execute({
        email,
        password
      });
      return res.json(session);
    });
  }
};

// src/services/user/DetailUserService.ts
var UserDetailService = class {
  execute(user_id) {
    return __async(this, null, function* () {
      const user = yield prisma_default.user.findFirst({
        where: {
          id: user_id
        },
        select: {
          id: true,
          name: true,
          email: true,
          endereco: true,
          subscriptions: {
            select: {
              id: true,
              priceId: true,
              status: true
            }
          }
        }
      });
      return user;
    });
  }
};

// src/controllers/user/DetailUserController.ts
var DetailUserController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const user_id = req.user_id;
      const userDetailService = new UserDetailService();
      const detailUser = yield userDetailService.execute(user_id);
      return res.json(detailUser);
    });
  }
};

// src/middlewares/isAuthenticated.ts
var import_jsonwebtoken2 = require("jsonwebtoken");
function isAuthenticated(req, res, next) {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).end();
  }
  const [, token] = authToken.split(" ");
  try {
    const { sub } = (0, import_jsonwebtoken2.verify)(token, process.env.JWT_SECRET);
    req.user_id = sub;
    return next();
  } catch (err) {
    return res.status(401).end();
  }
}

// src/services/user/UpdateUserServce.ts
var UpdateUserService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ user_id, name, endereco }) {
      try {
        const userAlreadyExists = yield prisma_default.user.findFirst({
          where: {
            id: user_id
          }
        });
        if (!userAlreadyExists) {
          throw new Error("User not exists!");
        }
        const userUpdate = yield prisma_default.user.update({
          where: {
            id: user_id
          },
          data: {
            name,
            endereco
          },
          select: {
            name: true,
            email: true,
            endereco: true
          }
        });
        return userUpdate;
      } catch (err) {
        console.log(err);
        throw new Error("Error an update the user!");
      }
    });
  }
};

// src/controllers/user/UpdateUserController.ts
var UpdateUserController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const { name, endereco } = req.body;
      const user_id = req.user_id;
      const updateUser = new UpdateUserService();
      const user = yield updateUser.execute({
        user_id,
        name,
        endereco
      });
      return res.json(user);
    });
  }
};

// src/services/haircut/CreateHaircutService.ts
var CreateHaircutService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ user_id, name, price }) {
      var _a;
      if (!name || !price) {
        throw new Error("Error");
      }
      const myHaircut = yield prisma_default.haircut.count({
        where: {
          user_id
        }
      });
      const user = yield prisma_default.user.findFirst({
        where: {
          id: user_id
        },
        include: {
          subscriptions: true
        }
      });
      if (myHaircut >= 3 && ((_a = user == null ? void 0 : user.subscriptions) == null ? void 0 : _a.status) !== "active") {
        throw new Error("Not authorized");
      }
      const haircut = yield prisma_default.haircut.create({
        data: {
          name,
          price,
          user_id
        }
      });
      return haircut;
    });
  }
};

// src/controllers/haircut/CreateHaircutController.ts
var CreateHaircutController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const { name, price } = req.body;
      const user_id = req.user_id;
      const createHaircutService = new CreateHaircutService();
      const haircut = yield createHaircutService.execute({
        user_id,
        name,
        price
      });
      return res.json(haircut);
    });
  }
};

// src/services/haircut/ListHaircutService.ts
var ListHaircutService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ user_id, status }) {
      const haircut = yield prisma_default.haircut.findMany({
        where: {
          user_id,
          status: status === "true" ? true : false
        }
      });
      return haircut;
    });
  }
};

// src/controllers/haircut/ListHaircutController.ts
var ListHaircutController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const user_id = req.user_id;
      const status = req.query.status;
      const listHaircuts = new ListHaircutService();
      const haircuts = yield listHaircuts.execute({
        user_id,
        status
      });
      return res.json(haircuts);
    });
  }
};

// src/services/haircut/UpdateHaircutService.ts
var UpdateHaircutService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ user_id, haircut_id, name, price, status = true }) {
      var _a;
      const user = yield prisma_default.user.findFirst({
        where: {
          id: user_id
        },
        include: {
          subscriptions: true
        }
      });
      if (((_a = user == null ? void 0 : user.subscriptions) == null ? void 0 : _a.status) !== "active") {
        throw new Error("Not authorized");
      }
      const haircut = yield prisma_default.haircut.update({
        where: {
          id: haircut_id
        },
        data: {
          name,
          price,
          status: status === true ? true : false
        }
      });
      return haircut;
    });
  }
};

// src/controllers/haircut/UpdateHaircutController.ts
var UpdateHaircutController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const user_id = req.user_id;
      const { name, price, status, haircut_id } = req.body;
      const updateHaircut = new UpdateHaircutService();
      const haircut = yield updateHaircut.execute({
        user_id,
        name,
        price,
        status,
        haircut_id
      });
      return res.json(haircut);
    });
  }
};

// src/services/haircut/CheckSubscriptionService.ts
var CheckSubscriptionService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ user_id }) {
      const status = yield prisma_default.user.findFirst({
        where: {
          id: user_id
        },
        select: {
          subscriptions: {
            select: {
              id: true,
              status: true
            }
          }
        }
      });
      return status;
    });
  }
};

// src/controllers/haircut/CheckSubscriptionController.ts
var CheckSubscriptionControlle = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const user_id = req.user_id;
      const checkSubscreiptionService = new CheckSubscriptionService();
      const status = yield checkSubscreiptionService.execute({
        user_id
      });
      return res.json(status);
    });
  }
};

// src/services/haircut/CountHaircutsService.ts
var CountHaircutsService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ user_id }) {
      const count = yield prisma_default.haircut.count({
        where: {
          user_id
        }
      });
      return count;
    });
  }
};

// src/controllers/haircut/CountHaircutsController.ts
var CountHaircutsController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const user_id = req.user_id;
      const countHaircutsService = new CountHaircutsService();
      const count = yield countHaircutsService.execute({
        user_id
      });
      return res.json(count);
    });
  }
};

// src/services/haircut/DetailHaircutService.ts
var DetailHaircutService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ haircut_id }) {
      const haircut = yield prisma_default.haircut.findFirst({
        where: {
          id: haircut_id
        }
      });
      return haircut;
    });
  }
};

// src/controllers/haircut/DetailHaircutController.ts
var DetailHaircutController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const haircut_id = req.query.haircut_id;
      const detailHaircut = new DetailHaircutService();
      const haircut = yield detailHaircut.execute({
        haircut_id
      });
      return res.json(haircut);
    });
  }
};

// src/services/schedule/NewScheduleService.ts
var NewScheduleService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ user_id, haircut_id, customer }) {
      if (customer === "" || haircut_id === "") {
        throw new Error("Error schedule new service.");
      }
      const schedule = yield prisma_default.service.create({
        data: {
          customer,
          haircut_id,
          user_id
        }
      });
      return schedule;
    });
  }
};

// src/controllers/schedule/NewScheduleController.ts
var NewScheduleController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const { customer, haircut_id } = req.body;
      const user_id = req.user_id;
      const newShedule = new NewScheduleService();
      const schedule = yield newShedule.execute({
        user_id,
        haircut_id,
        customer
      });
      return res.json(schedule);
    });
  }
};

// src/services/schedule/ListScheduleService.ts
var ListScheduleService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ user_id }) {
      const shedule = yield prisma_default.service.findMany({
        where: {
          user_id
        },
        select: {
          id: true,
          customer: true,
          haircut: true
        }
      });
      return shedule;
    });
  }
};

// src/controllers/schedule/ListScheduleController.ts
var ListScheduleController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const user_id = req.user_id;
      const listSchedule = new ListScheduleService();
      const schedule = yield listSchedule.execute({
        user_id
      });
      return res.json(schedule);
    });
  }
};

// src/services/schedule/FinishScheduleService.ts
var FinishScheduleService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ schedule_id, user_id }) {
      if (schedule_id === "" || user_id === "") {
        throw new Error("Error.");
      }
      try {
        const belongsToUser = yield prisma_default.service.findFirst({
          where: {
            id: schedule_id,
            user_id
          }
        });
        if (!belongsToUser) {
          throw new Error("Not authorized");
        }
        yield prisma_default.service.delete({
          where: {
            id: schedule_id
          }
        });
        return { message: "Finalizado com sucesso!" };
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    });
  }
};

// src/controllers/schedule/FinishScheduleController.ts
var FinishScheduleController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const user_id = req.user_id;
      const schedule_id = req.query.schedule_id;
      const finishScheduleService = new FinishScheduleService();
      const schedule = yield finishScheduleService.execute({
        user_id,
        schedule_id
      });
      return res.json(schedule);
    });
  }
};

// src/services/subscriptions/SubscribeService.ts
var import_stripe = __toESM(require("stripe"));
var SubscribeService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ user_id }) {
      const stripe2 = new import_stripe.default(
        process.env.STRIPE_API_KEY,
        {
          apiVersion: "2022-11-15",
          appInfo: {
            name: "barberpro",
            version: "1"
          }
        }
      );
      const findUser = yield prisma_default.user.findFirst({
        where: {
          id: user_id
        }
      });
      let customerId = findUser.stripe_customer_id;
      if (!customerId) {
        const stripeCustomer = yield stripe2.customers.create({
          email: findUser.email
        });
        yield prisma_default.user.update({
          where: {
            id: user_id
          },
          data: {
            stripe_customer_id: stripeCustomer.id
          }
        });
        customerId = stripeCustomer.id;
      }
      const stripeCheckoutSession = yield stripe2.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        billing_address_collection: "required",
        line_items: [
          { price: process.env.STRIPE_PRICE, quantity: 1 }
        ],
        mode: "subscription",
        allow_promotion_codes: true,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL
      });
      return { sessionId: stripeCheckoutSession.id };
    });
  }
};

// src/controllers/subscription/SubscribeController.ts
var SubscribeController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const user_id = req.user_id;
      const subscribeService = new SubscribeService();
      const subscribe = yield subscribeService.execute({
        user_id
      });
      return res.json(subscribe);
    });
  }
};

// src/ultis/stripe.ts
var import_stripe2 = __toESM(require("stripe"));
var stripe = new import_stripe2.default(
  process.env.STRIPE_API_KEY,
  {
    apiVersion: "2022-11-15",
    appInfo: {
      name: "barberpro",
      version: "1"
    }
  }
);

// src/ultis/manageSubscription.ts
function saveSubscription(subscriptionId, customerId, createAction = false, deleteAction = false) {
  return __async(this, null, function* () {
    const findUser = yield prisma_default.user.findFirst({
      where: {
        stripe_customer_id: customerId
      },
      include: {
        subscriptions: true
      }
    });
    const subscription = yield stripe.subscriptions.retrieve(subscriptionId);
    const subscriptionData = {
      id: subscription.id,
      userId: findUser.id,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id
    };
    if (createAction) {
      console.log(subscriptionData);
      try {
        yield prisma_default.subscription.create({
          data: subscriptionData
        });
      } catch (err) {
        console.log("ERRO CREATE");
        console.log(err);
      }
    } else {
      if (deleteAction) {
        yield prisma_default.subscription.delete({
          where: {
            id: subscriptionId
          }
        });
        return;
      }
      try {
        yield prisma_default.subscription.update({
          where: {
            id: subscriptionId
          },
          data: {
            status: subscription.status,
            priceId: subscription.items.data[0].price.id
          }
        });
      } catch (err) {
        console.log("ERRO UPDATE HOOK");
        console.log(err);
      }
    }
  });
}

// src/controllers/subscription/WebhooksController.ts
var WebhooksController = class {
  handle(request, response) {
    return __async(this, null, function* () {
      let event = request.body;
      const signature = request.headers["stripe-signature"];
      let endpointSecret = "whsec_d7ebe22e128eedac1949291c0916a275f89fd9f981640f03851a6425a1d5b0a9";
      if (endpointSecret) {
        try {
          event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
        } catch (err) {
          return response.status(400).send(`Wehook error: ${err.message}`);
        }
      }
      switch (event.type) {
        case "customer.subscription.deleted":
          const payment = event.data.object;
          yield saveSubscription(
            payment.id,
            payment.customer.toString(),
            false,
            true
          );
          break;
        case "customer.subscription.updated":
          const paymentIntent = event.data.object;
          yield saveSubscription(
            paymentIntent.id,
            paymentIntent.customer.toString(),
            false
          );
          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object;
          yield saveSubscription(
            checkoutSession.subscription.toString(),
            checkoutSession.customer.toString(),
            true
          );
          break;
        default:
          console.log(`Evento desconhecido ${event.type}`);
      }
      response.send();
    });
  }
};

// src/services/subscriptions/CreatePortalService.ts
var import_stripe5 = __toESM(require("stripe"));
var CreatePortalService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ user_id }) {
      const stripe2 = new import_stripe5.default(
        process.env.STRIPE_API_KEY,
        {
          apiVersion: "2022-11-15",
          appInfo: {
            name: "barberpro",
            version: "1"
          }
        }
      );
      const findUser = yield prisma_default.user.findFirst({
        where: {
          id: user_id
        }
      });
      let sessionId = findUser.stripe_customer_id;
      if (!sessionId) {
        console.log("Nao tem id");
        return { message: "User not found" };
      }
      const portalSession = yield stripe2.billingPortal.sessions.create({
        customer: sessionId,
        return_url: process.env.STRIPE_SUCCESS_URL
      });
      return { sessionId: portalSession.url };
    });
  }
};

// src/controllers/subscription/CreatePortalController.ts
var CreatePortalController = class {
  handle(req, res) {
    return __async(this, null, function* () {
      const user_id = req.user_id;
      const createPortal = new CreatePortalService();
      const portal = yield createPortal.execute({
        user_id
      });
      return res.json(portal);
    });
  }
};

// src/routes.ts
var router = (0, import_express.Router)();
router.get("/", (req, res) => {
  return res.json({ ok: "hello word" });
});
router.post("/users", new CreateUserController().handle);
router.post("/session", new AuthUserController().handle);
router.get("/me", isAuthenticated, new DetailUserController().handle);
router.put("/users", isAuthenticated, new UpdateUserController().handle);
router.post("/haircut", isAuthenticated, new CreateHaircutController().handle);
router.get("/haircuts", isAuthenticated, new ListHaircutController().handle);
router.put("/haircut", isAuthenticated, new UpdateHaircutController().handle);
router.get("/haircut/check", isAuthenticated, new CheckSubscriptionControlle().handle);
router.get("/haircut/count", isAuthenticated, new CountHaircutsController().handle);
router.get("/haircut/detail", isAuthenticated, new DetailHaircutController().handle);
router.post("/schedule", isAuthenticated, new NewScheduleController().handle);
router.get("/schedule", isAuthenticated, new ListScheduleController().handle);
router.delete("/schedule", isAuthenticated, new FinishScheduleController().handle);
router.post("/subscribe", isAuthenticated, new SubscribeController().handle);
router.post("/webhooks", import_express.default.raw({ type: "application/json" }), new WebhooksController().handle);
router.post("/create-portal", isAuthenticated, new CreatePortalController().handle);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  router
});
