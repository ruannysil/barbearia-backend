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

// src/ultis/manageSubscription.ts
var manageSubscription_exports = {};
__export(manageSubscription_exports, {
  saveSubscription: () => saveSubscription
});
module.exports = __toCommonJS(manageSubscription_exports);

// src/ultis/stripe.ts
var import_stripe = __toESM(require("stripe"));
var stripe = new import_stripe.default(
  process.env.STRIPE_API_KEY,
  {
    apiVersion: "2022-11-15",
    appInfo: {
      name: "barberpro",
      version: "1"
    }
  }
);

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  saveSubscription
});
