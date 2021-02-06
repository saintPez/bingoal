import { NextApiRequest, NextApiResponse } from 'next'

import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken'

import Config from 'lib/config'
import User, { IUser } from 'lib/database/models/user'

import ValidationError from 'lib/error/validation'
import ValidationErrors from 'lib/error/validations'
import validationSignin from 'lib/validation/signin'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    await Config({ req, method: ['POST'] })
    validationSignin(req.body.email, req.body.password)

    const user: IUser = await User.findOne({ 'email.data': req.body.email })
    if (!user)
      throw new ValidationErrors('Email or Password is wrong \n', [
        new ValidationError(undefined, 'body', 'Email or Password is wrong'),
      ])

    const correctPassword: boolean = await bcrypt.compare(
      req.body.password,
      user.password
    )
    if (!correctPassword)
      throw new ValidationErrors('Email or Password is wrong \n', [
        new ValidationError(undefined, 'body', 'Email or Password is wrong'),
      ])

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
        error: `${error.name}: ${error.message}`,
      })
    } else {
      res.status(error.status || 400).json({
        success: false,
        error: error.errors || `${error.name}: ${error.message}`,
      })
    }
  }
}
