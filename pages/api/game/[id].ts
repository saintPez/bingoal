import { NextApiRequest, NextApiResponse } from 'next'
import cors from 'cors'
import dbConnect from 'utils/dbConnect'
import User, { IUser } from 'models/User'
import Game, { IGame } from 'models/Game'
import { initMiddleware, validate } from 'utils/middleware'
import tokenValidation from 'validation/token.validation'

const validateAuth = initMiddleware(validate(tokenValidation))
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

        const game: IGame = await Game.findById(req.query.id).populate('cards').populate('purchasedCards')
        if (!game) throw new Error('Game not found')

        res.status(200).json(
          JSON.stringify(
            {
              success: true,
              data: game
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
          error: {
            message: error.message
          }
        },
        null,
        4
      )
    )
  }
}
