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

// src/controllers/subscription/CreatePortalController.ts
var CreatePortalController_exports = {};
__export(CreatePortalController_exports, {
  CreatePortalController: () => CreatePortalController
});
module.exports = __toCommonJS(CreatePortalController_exports);

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/subscriptions/CreatePortalService.ts
var import_stripe = __toESM(require("stripe"));
var CreatePortalService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ user_id }) {
      const stripe = new import_stripe.default(
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
      const portalSession = yield stripe.billingPortal.sessions.create({
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreatePortalController
});
