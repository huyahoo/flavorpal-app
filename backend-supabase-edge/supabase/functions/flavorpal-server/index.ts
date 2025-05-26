import { Hono } from 'jsr:@hono/hono'
import userRouter from "./user/index.ts"

const functionName = 'flavorpal-server'
const app = new Hono().basePath(`/${functionName}`)


app.route('/user', userRouter)

app.get('/', (c) => {
  return c.json({
    message: 'Hello, World!',
    functionName,
  })
})

Deno.serve(app.fetch)