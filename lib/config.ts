import { NextApiRequest } from 'next'

import Connection from 'lib/database/connection'
import InternalError from 'lib/error/internal'
import MethodError from 'lib/error/method'

import jwt from 'jsonwebtoken'

interface IPayload {
  _id: string
  iat: number
  exp: number
}

type IMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'PATCH'

interface IConfig {
  req: NextApiRequest
  method?: IMethod | IMethod[]
  auth?: boolean
}

export default async function Config(config?: IConfig): Promise<void> {
  if (!process.env.MONGO_URI) throw new InternalError('ENV', 'MONGO_URI')
  if (!process.env.TOKEN_SECRET) throw new InternalError('ENV', 'TOKEN_SECRET')

  await Connection()

  if (config) {
    method: if (config.method) {
      if (Array.isArray(config.method)) {
        for (const method of config.method) {
          if (method === config.req.method) {
            break method
          }
        }
        throw new MethodError(config.req.method)
      } else if (config.method !== config.req.method)
        throw new MethodError(config.req.method)
    }
  }

  if (config.auth) {
    const payload = (await jwt.verify(
      config.req.headers.token || config.req.body.token,
      process.env.TOKEN_SECRET
    )) as IPayload
    config.req.body._id = payload._id
  }
}