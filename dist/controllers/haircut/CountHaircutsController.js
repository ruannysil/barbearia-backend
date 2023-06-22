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

// src/controllers/haircut/CountHaircutsController.ts
var CountHaircutsController_exports = {};
__export(CountHaircutsController_exports, {
  CountHaircutsController: () => CountHaircutsController
});
module.exports = __toCommonJS(CountHaircutsController_exports);

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CountHaircutsController
});
