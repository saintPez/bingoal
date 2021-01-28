import Connection from './database/connection'
import EnvError from './error/env'

export default async function Config(): Promise<void> {
  if (!process.env.MONGO_URI) throw new EnvError('MONGO_URI')
  if (!process.env.TOKEN_SECRET) throw new EnvError('TOKEN_SECRET')

  await Connection()
}
