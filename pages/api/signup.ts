/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */

import { NextApiRequest, NextApiResponse } from 'next'

import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken'
import Joi from 'joi'

import Config from 'lib/config'
import User, { IUser } from 'lib/database/models/user'

import validation from 'lib/validation/user'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    await Config({ req, method: 'POST' })
    await validation.validateAsync({
      name: req.body.name,
      'email.data': req.body.email,
      password: req.body.password,
      'birth_date.data': req.body.birth_date,
      'time_zone.data': req.body.time_zone,
    })

    {
      const user: IUser = await User.findOne({
        'email.data': req.body.email,
      })

      const obj = Joi.object({
        email: Joi.custom((value, helpers) => {
          if (user) {
            return helpers.message(`\"email\" is already in use` as any)
          }
          return value
        }, 'custom valid'),
      })
      await obj.validateAsync({ email: req.body.email })
    }

    const salt = await bcrypt.genSalt(10)

    const user: IUser = await new User({
      name: req.body.name,
      email: { data: req.body.email },
      password: await bcrypt.hash(req.body.password, salt),
      birth_date: { data: new Date(req.body.birth_date) },
      time_zone: { data: req.body.time_zone },
    }).save()

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
