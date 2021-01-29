import Connection from './database/connection'
import InternalError from './error/internal'

export default async function Config(): Promise<void> {
  if (!process.env.MONGO_URI) throw new InternalError('ENV', 'MONGO_URI')
  if (!process.env.TOKEN_SECRET) throw new InternalError('ENV', 'TOKEN_SECRET')

  await Connection()
}
