import { NextApiRequest, NextApiResponse } from 'next'
import cors from 'cors'
import dbConnect from 'utils/dbConnect'
import User, { IUser } from 'models/User'
import { initMiddleware, validate } from 'utils/middleware'
import tokenValidation from 'validation/token.validation'
import meValidation from 'validation/profile/me.validation'

const validateAuth = initMiddleware(validate(tokenValidation))
const validateReq = initMiddleware(validate(meValidation))
const middlewareCors = initMiddleware(cors())

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await middlewareCors(req, res)
    switch (req.method) {
      case 'GET': {
        await dbConnect()
        await validateAuth(req, res)
        const user: IUser = await User.findById(req.body._id)
        if (!user) throw new Error('user not found')

        res.status(200).json(
          JSON.stringify(
            {
              success: true,
              data: user
            },
            null,
            4
          )
        )
        break
      }
      case 'PUT': {
        await dbConnect()
        await validateAuth(req, res)
        await validateReq(req, res)

        const user: IUser = await User.findById(req.body._id)

        if (user.nickname !== req.body.nickname) {
          const pads = '0000'
          const hash = (
            await User.countDocuments({
              nickname: {
                $regex: new RegExp(req.body.nickname, 'i')
              }
            })
          ).toString()
          req.body.hash = pads.substring(0, pads.length - hash.length) + hash
        }

        await User.updateOne({ _id: req.body._id }, {
          nickname: req.body.nickname,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: req.body.password,
          dateOfBirth: req.body.dateOfBirth,
          hash: req.body.hash
        })

        const newUser: IUser = await User.findById(req.body._id)

        if (!newUser) throw new Error('user not found')

        res.status(200).json(
          JSON.stringify(
            {
              success: true,
              data: newUser
            },
            null,
            4
          )
        )
        break
      }
      default: throw new Error('method is invalid')
    }
  } catch (error) {
    res.status(400).json(
      JSON.stringify(
        {
          success: false,
          error: error
        },
        null,
        4
      )
    )
  }
}
