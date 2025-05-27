import { Hono } from 'jsr:@hono/hono'
import userRouter from "./user/index.ts"
import productRouter from "./product/index.ts";
import reviewRouter from "./review/index.ts";
import badgeRouter from "./badge/index.ts";

const functionName = 'flavorpal-server'
const app = new Hono().basePath(`/${functionName}`)


app.route('/user', userRouter)
app.route('/product', productRouter)
app.route('/review', reviewRouter)
app.route('/badge', badgeRouter)

app.get('/', (c) => {
  return c.json({
    message: 'Hello, World!',
    functionName,
  })
})

Deno.serve(app.fetch)