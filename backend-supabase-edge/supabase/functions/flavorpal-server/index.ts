import { Hono } from 'jsr:@hono/hono'
import { cors } from 'jsr:@hono/hono/cors'
import userRouter from "./user/index.ts"
import productRouter from "./product/index.ts";
import reviewRouter from "./review/index.ts";
import badgeRouter from "./badge/index.ts";

const functionName = 'flavorpal-server'
const app = new Hono().basePath(`/${functionName}`)

app.use('*', cors({
  origin: 'https://localhost:5173',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}))

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