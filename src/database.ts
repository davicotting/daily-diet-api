import knex, { Knex } from "knex";

export const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "src/db/app.db",
  },
  migrations: {
    extension: "ts",
    directory: "src/db/migrations"
  }
};

export const db = knex(config);