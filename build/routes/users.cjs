"use strict";
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

// src/routes/users.ts
var users_exports = {};
__export(users_exports, {
  user: () => user
});
module.exports = __toCommonJS(users_exports);

// src/database.ts
var import_knex = __toESM(require("knex"), 1);
var config = {
  client: "sqlite3",
  connection: {
    filename: "src/db/app.db"
  },
  migrations: {
    extension: "ts",
    directory: "src/db/migrations"
  }
};
var db = (0, import_knex.default)(config);

// src/routes/users.ts
var import_node_crypto = require("crypto");
var zod = __toESM(require("zod"), 1);
function user(app) {
  return __async(this, null, function* () {
    app.post("/", (request, reply) => __async(null, null, function* () {
      const requestBodySchema = zod.object({
        name: zod.string()
      });
      const { name } = requestBodySchema.parse(request.body);
      let id = (0, import_node_crypto.randomUUID)();
      if (!request.cookies.userId) {
        reply.setCookie("userId", id, {
          maxAge: 60 * 60 * 24 * 30
          // 30 days
        });
      }
      yield db("users").insert({
        name,
        id
      });
      return reply.code(201).send({
        message: "Usuario criado com sucesso"
      });
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  user
});
