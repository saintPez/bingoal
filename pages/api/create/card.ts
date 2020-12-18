import { NextApiRequest, NextApiResponse } from 'next'
import cors from 'cors'
import dbConnect from 'utils/dbConnect'
import User, { IUser } from 'models/User'
import Card, { ICard } from 'models/Card'
import Game, { IGame } from 'models/Game'
import { initMiddleware, validate } from 'utils/middleware'
import tokenValidation from 'validation/token.validation'
import cardValidation from 'validation/create/card.validation'
import createCard from 'libs/create/card'

const validateAuth = initMiddleware(validate(tokenValidation))
const validateReq = initMiddleware(validate(cardValidation))
const middlewareCors = initMiddleware(cors())

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await middlewareCors(req, res)
    switch (req.method) {
      case 'POST': {
        await dbConnect()
        await validateAuth(req, res)
        await validateReq(req, res)

        const user: IUser = await User.findById(req.body._id)
        if (!user) throw new Error('user not found')
        if (!user.admin) throw new Error('user is not admin')

        if (req.body.data === undefined || req.body.data === []) {
          const data = await createCard()
          req.body.data = data
        } else {
          const card: ICard = await Card.findOne({
            data: { $all: req.body.data }
          })
          if (card) throw new Error('data already exists')
        }

        const card: ICard = new Card({
          data: req.body.data
        })

        const newCard = await card.save()

        const games: IGame[] = await Game.find({})
        if (games !== []) {
          for (const game of games) {
            game.updateOne({
              $push: {
                cards: newCard._id
              }
            })
          }
        }

        res.status(201).json(
          JSON.stringify(
            {
              success: true,
              data: newCard
            },
            null,
            4
          )
        )
        break
      }
      default: throw new Error('method is invalid')
    }
  } catch (error: unknown) {
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
