import { NextApiRequest, NextApiResponse } from 'next'

import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken'

import Config from 'lib/config'
import User, { IUser } from 'lib/database/models/user'

import MethodError from 'lib/error/method'
import ValidationError from 'lib/error/validation'

export default async function Login(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    await Config()
    if (req.method !== 'POST') throw new MethodError(`${req.method}`)

    const user: IUser = await User.findOne({
      email: req.body.email,
    })
    if (!user)
      throw new ValidationError(undefined, 'Email or Password', 'is wrong')

    const correctPassword: boolean = await bcrypt.compare(
      req.body.password,
      user.password
    )
    if (!correctPassword)
      throw new ValidationError(undefined, 'Email or Password', 'is wrong')

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
    console.log(error)
    res.status(400).json({ error: `${error.name}: ${error.message}` })
  }
}
