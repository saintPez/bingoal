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

type IAuth = null | true | false

interface IConfig {
  req: NextApiRequest
  method?: IMethod | IMethod[]
  auth?: IAuth | IAuth[]
}

export default async function Config(config?: IConfig): Promise<void> {
  if (!process.env.MONGO_URI) throw new InternalError('ENV', 'MONGO_URI')
  if (!process.env.TOKEN_SECRET) throw new InternalError('ENV', 'TOKEN_SECRET')

  await Connection()

  if (config) {
    if (config.method) {
      if (!Array.isArray(config.method) && config.method !== config.req.method)
        throw new MethodError(config.req.method)
      else if (
        Array.isArray(config.method) &&
        !config.method.find((method) => method === config.req.method)
      )
        throw new MethodError(config.req.method)
    }

    if (config.auth === null || config.auth) {
      if (Array.isArray(config.method) && Array.isArray(config.auth)) {
        const index = config.method.findIndex(
          (method) => method === config.req.method
        )
        if (config.auth[index] === null || config.auth[index])
          await Auth(config.req, !(config.auth[index] === null))
      } else await Auth(config.req, !(config.auth === null))
    }
  }
}

export async function Auth(
  req: NextApiRequest,
  $throw: boolean
): Promise<void> {
  await jwt.verify(
    req.headers.token || req.body.token,
    process.env.TOKEN_SECRET,
    (error, decoded: IPayload) => {
      if (!error) req.body._id = decoded._id
      else if ($throw) throw error
    }
  )
}
