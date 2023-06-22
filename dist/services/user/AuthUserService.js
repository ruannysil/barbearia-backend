var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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

// src/services/user/AuthUserService.ts
var AuthUserService_exports = {};
__export(AuthUserService_exports, {
  AuthUserService: () => AuthUserService
});
module.exports = __toCommonJS(AuthUserService_exports);

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/user/AuthUserService.ts
var import_bcryptjs = require("bcryptjs");
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
      const passwordMatch = yield (0, import_bcryptjs.compare)(password, user == null ? void 0 : user.password);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthUserService
});
