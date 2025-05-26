import { Hono } from 'jsr:@hono/hono'

const functionName = 'flavorpal-server'
const app = new Hono().basePath(`/${functionName}`)

app.get('/', (c) => {
  return c.json({
    message: 'Hello, World!',
    functionName,
  })
})

Deno.serve(app.fetch)