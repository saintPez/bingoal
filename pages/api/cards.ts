import { NextApiRequest, NextApiResponse } from 'next'
import cors from 'cors'
import dbConnect from 'utils/dbConnect'
import User, { IUser } from 'models/User'
import Card, { ICard } from 'models/Card'
import Game, { IGame } from 'models/Game'
import { initMiddleware, validate } from 'utils/middleware'
import cardsValidation from 'validation/cards.validation'
import tokenValidation from 'validation/token.validation'

const validateReq = initMiddleware(validate(cardsValidation))
const validateAuth = initMiddleware(validate(tokenValidation))
const middlewareCors = initMiddleware(cors())

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await middlewareCors(req, res)
    switch (req.method) {
      case 'GET': {
        await dbConnect()
        await validateAuth(req, res)
        await validateReq(req, res)

        const user: IUser = await User.findById(req.body._id)
        if (!user) throw new Error('user not found')

        const game: IGame = await Game.findOne(
          req.body.game ? { _id: req.body.game } : {}
        ).populate('cards')
        if (!game) {
          const cards: ICard[] = await Card.find({})
          if (!cards) throw new Error('card not found')

          return res.status(200).json(
            JSON.stringify(
              {
                success: true,
                data: cards
              },
              null,
              4
            )
          )
        }

        res.status(200).json(
          JSON.stringify(
            {
              success: true,
              data: game.cards
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
