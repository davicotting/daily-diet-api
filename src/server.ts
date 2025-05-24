import fastify from "fastify";
import { user } from "./routes/users";
import { snacks } from "./routes/snacks";
import cookie from '@fastify/cookie';

const app = fastify();

app.register(cookie);

app.register(snacks, {
    prefix: "snacks"
});

app.register(user, {
    prefix: "users"
});

app.listen({
    port: 2323,
}).then(() => {
    console.log('Server is running on PORT 2323');
});