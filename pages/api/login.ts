import { NextApiRequest, NextApiResponse } from 'next'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken'
import dbConnect from 'utils/dbConnect'
import User, { IUser } from 'models/User'
import { initMiddleware, validate } from 'utils/middleware'
import loginValidation from 'validation/login.validation'
import { ValidationError } from 'utils/errors'

const validateReq = initMiddleware(validate(loginValidation))
const middlewareCors = initMiddleware(cors())

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await middlewareCors(req, res)
    switch (req.method) {
      case 'POST': {
        await dbConnect()
        await validateReq(req, res)
        const user: IUser = await User.findOne({
          email: req.body.email
        })
        if (!user) {
          throw new ValidationError({
            value: req.body.password,
            message: 'Email is not correct',
            param: 'email',
            location: 'body'
          })
        }

        const correctPassword: boolean = await bcrypt.compare(req.body.password, user.password)
        if (!correctPassword) {
          throw new ValidationError({
            value: req.body.password,
            message: 'Password is not correct',
            param: 'password',
            location: 'body'
          })
        }

        const token: Secret = await jwt.sign(
          { _id: user._id },
          process.env.TOKEN_SECRET,
          {

          }
        )

        res.status(200).json(
          JSON.stringify(
            {
              success: true,
              data: user,
              token: token
            },
            null,
            4
          )
        )
        break
      }
      default: throw new ValidationError({
        value: req.method,
        message: 'Method is invalid',
        param: 'method',
        location: 'req'
      })
    }
  } catch (error) {
    res.status(400).json(
      JSON.stringify(
        {
          success: false,
          error: error.name === 'ValidationError'
            ? {
                value: error.value,
                message: error.message,
                param: error.param,
                location: error.location
              }
            : {
                message: error.message
              }
        },
        null,
        4
      )
    )
  }
}
