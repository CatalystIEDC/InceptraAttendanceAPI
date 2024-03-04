import { Application, Router } from "oak";
import { addAgent } from "./database.ts";

const router = new Router();

router.get("/", async (ctx) => {
  ctx.response.redirect("https://xditya.me");
});

router.post("/api/addData", async (ctx) => {
  const { agentID } = await ctx.request.body().value;
  await addAgent(agentID);
  ctx.response.body = { error: null, agentID };
});

const app = new Application();
app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  await next();
});
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("error", (e) => {
  console.log(e);
});

console.log("Listening on port 8000.");
await app.listen({ port: 8000 });
