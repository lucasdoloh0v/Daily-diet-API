import { app } from './app'
import { env } from './env'

app.listen({ port: env.port }).then(() => console.log('http server running'))
