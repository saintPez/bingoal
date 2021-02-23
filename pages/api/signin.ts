/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */

import { NextApiRequest, NextApiResponse } from 'next'

import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken'
import Joi from 'joi'

import Config from 'lib/config'
import User, { IUser } from 'lib/database/models/user'

import validation from 'lib/validation/signin'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    await Config({ req, method: ['POST'] })

    await validation.validateAsync({
      email: req.body.email,
      password: req.body.password,
    })

    const user: IUser = await User.findOne({
      'email.data': req.body.email,
    })

    {
      const correctPassword: boolean = await bcrypt.compare(
        req.body.password,
        user.password
      )

      const obj = Joi.object({
        email: Joi.custom((value, helpers) => {
          if (!user) {
            return helpers.message(`\"email\"  or \"password\" is wrong` as any)
          }
          return value
        }, 'custom valid'),
        password: Joi.custom((value, helpers) => {
          if (!correctPassword) {
            return helpers.message(`\"email\"  or \"password\" is wrong` as any)
          }
          return value
        }, 'custom valid'),
      })
      await obj.validateAsync({ email: req.body.email })
    }

    const token: Secret = await jwt.sign(
      { _id: user._id },
      process.env.TOKEN_SECRET,
      {
        expiresIn: 60 * 60 * 24,
      }
    )

    res.status(200).json({
      success: true,
      user,
      token,
    })
  } catch (error) {
    if (error.name === 'InternalError') {
      console.log(error)
      res.status(error.status || 500).json({
        success: false,
        error: { ...error, name: error.name, message: error.message },
      })
    } else {
      res.status(error.status || 400).json({
        success: false,
        error: { ...error, name: error.name, message: error.message },
      })
    }
  }
}
