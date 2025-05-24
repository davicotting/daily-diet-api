import { Knex } from "knex";

declare module 'knex/types/tables' {
    export interface Tables {
        users: {
            name: string;
            id: string
        };

        snacks: {
            name: string;
            description: string;
            created_at: string;
            inDiet: boolean;
            user_id: string;
            snack_id: string;
        }
    }
}