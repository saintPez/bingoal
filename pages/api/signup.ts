import { NextApiRequest, NextApiResponse } from 'next'

import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken'

import Config from 'lib/config'
import User, { IUser } from 'lib/database/models/user'

import ValidationError from 'lib/error/validation'
import ValidationErrors from 'lib/error/validations'
import validationSignup from 'lib/validation/signup'

export default async function Login(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    await Config({ req, method: ['POST', 'GET'] })
    validationSignup(
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.birth_date
    )

    if (await User.findOne({ 'email.data': req.body.email }))
      throw new ValidationErrors('Email is alrady use \n', [
        new ValidationError(req.body.email, 'email', 'Email is alrady use'),
      ])

    const salt = await bcrypt.genSalt(10)

    const user: IUser = await new User({
      name: req.body.name,
      email: { data: req.body.email },
      password: await bcrypt.hash(req.body.password, salt),
      birth_date: { data: new Date(req.body.birth_date) },
      zone: { private: true, data: 'America/Bogota' },
    }).save()

    const token: Secret = await jwt.sign(
      { _id: user._id },
      process.env.TOKEN_SECRET,
      {
        expiresIn: 60 * 60 * 24,
      }
    )

    res.status(200).json({
      user,
      token,
    })
  } catch (error) {
    if (error.name === 'InternalError') {
      console.log(error)
      res.status(500).json({
        error: `${error.name}: ${error.message}`,
      })
    } else {
      res.status(400).json({
        error: error.errors || `${error.name}: ${error.message}`,
      })
    }
  }
}
