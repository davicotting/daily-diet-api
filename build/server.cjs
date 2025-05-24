"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/server.ts
var import_fastify = __toESM(require("fastify"), 1);

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
function user(app2) {
  return __async(this, null, function* () {
    app2.post("/", (request, reply) => __async(null, null, function* () {
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

// src/routes/snacks.ts
var zod2 = __toESM(require("zod"), 1);

// src/middlewares/check-if-user-have-cookies.ts
function checkIfUserCookiesExists(request, reply) {
  return __async(this, null, function* () {
    const { userId } = request.cookies;
    if (!userId) {
      return reply.code(401).send({ message: "Usuario nao autenticado" });
    }
  });
}

// src/routes/snacks.ts
var import_crypto = require("crypto");
function snacks(app2) {
  return __async(this, null, function* () {
    app2.addHook("onRequest", checkIfUserCookiesExists);
    app2.patch("/:snack_id", (request, reply) => __async(null, null, function* () {
      const requestParamsSchema = zod2.object({
        snack_id: zod2.string().uuid()
      });
      const requestBodySchema = zod2.object({
        name: zod2.string().optional(),
        description: zod2.string().optional(),
        inDiet: zod2.boolean().optional()
      });
      const { snack_id } = requestParamsSchema.parse(request.params);
      const { name, description, inDiet } = requestBodySchema.parse(request.body);
      const { userId } = request.cookies;
      const snack = yield db("snacks").where("snack_id", snack_id).andWhere("user_id", userId).first();
      if (!snack) {
        return reply.code(404).send({ message: "snack nao encontrada" });
      }
      yield db("snacks").where("snack_id", snack_id).andWhere("user_id", userId).update({
        name,
        description,
        inDiet
      });
      return reply.code(200).send();
    }));
    app2.get("/:snack_id", (request, reply) => __async(null, null, function* () {
      const requestParamsSchema = zod2.object({
        snack_id: zod2.string().uuid()
      });
      const { snack_id } = requestParamsSchema.parse(request.params);
      const { userId } = request.cookies;
      const data = yield db("snacks").where("snack_id", snack_id).andWhere("user_id", userId).first();
      if (!data) {
        return reply.code(404).send("Snack nao encontrado");
      }
      return reply.code(200).send({ data });
    }));
    app2.delete("/:snack_id", (request, reply) => __async(null, null, function* () {
      const requestParamsSchema = zod2.object({
        snack_id: zod2.string().uuid()
      });
      const { snack_id } = requestParamsSchema.parse(request.params);
      const { userId } = request.cookies;
      const data = yield db("snacks").where("snack_id", snack_id).andWhere("user_id", userId).delete();
      if (!data) {
        return reply.code(404).send({ message: "Snack nao encontrado" });
      }
      return reply.code(200).send();
    }));
    app2.get("/", (request, reply) => __async(null, null, function* () {
      const { userId } = request.cookies;
      const data = yield db("snacks").where("user_id", userId);
      return reply.send({ data });
    }));
    app2.post("/", (request, reply) => __async(null, null, function* () {
      const requestBodySchema = zod2.object({
        name: zod2.string(),
        description: zod2.string(),
        inDiet: zod2.boolean()
      });
      const { name, description, inDiet } = requestBodySchema.parse(request.body);
      const userId = request.cookies.userId;
      yield db("snacks").insert({
        name,
        description,
        inDiet,
        user_id: userId,
        snack_id: (0, import_crypto.randomUUID)()
      });
      return reply.code(201).send();
    }));
    app2.get("/analytics", (request, reply) => __async(null, null, function* () {
      const { userId } = request.cookies;
      const snack = yield db("snacks").andWhere("user_id", userId).first();
      if (!snack) {
        return reply.code(404).send({ message: "voce nao tem nenhuma snack" });
      }
      const inDietTrueTotal = yield db("snacks").where("inDiet", true).count({ total: "*" }).first();
      const inDietFalseTotal = yield db("snacks").where("inDiet", false).count({ total: "*" }).first();
      const totalSnacks = yield db("snacks").where("user_id", userId).count({ total: "*" }).first();
      return reply.code(200).send({
        analytics: {
          inDiet: inDietTrueTotal,
          notInDiet: inDietFalseTotal,
          totalSnacks
        }
      });
    }));
  });
}

// src/server.ts
var import_cookie = __toESM(require("@fastify/cookie"), 1);
var app = (0, import_fastify.default)();
app.register(import_cookie.default);
app.register(snacks, {
  prefix: "snacks"
});
app.register(user, {
  prefix: "users"
});
app.listen({
  port: 2323
}).then(() => {
  console.log("Server is running on PORT 2323");
});
