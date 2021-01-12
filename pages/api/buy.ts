import { NextApiRequest, NextApiResponse } from 'next'
import cors from 'cors'
import dbConnect from 'utils/dbConnect'
import User, { IUser } from 'models/User'
import Game, { IGame } from 'models/Game'
import PurchasedCard, { IPurchasedCard } from 'models/purchasedCard'
import { initMiddleware, validate } from 'utils/middleware'
import buyValidation from 'validation/buy.validation'
import tokenValidation from 'validation/token.validation'

const validateReq = initMiddleware(validate(buyValidation))
const validateAuth = initMiddleware(validate(tokenValidation))
const middlewareCors = initMiddleware(cors())

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await middlewareCors(req, res)
    switch (req.method) {
      case 'POST': {
        await dbConnect()
        await validateAuth(req, res)
        await validateReq(req, res)

        const user: IUser = await User.findById(req.body._id).populate('purchasedGames')
        if (!user) throw new Error('user not found')

        const game: IGame = await Game.findOne(
          req.body.game ? { _id: req.body.game } : {}
        ).populate('cards')
        if (!game) throw new Error('game not found')

        const card = game.cards.find((element) => element)
        if (!card) throw new Error('card not found')

        if (!user.purchasedGames.find((element) => element._id === game._id)) {
          await user.updateOne({
            $push: {
              purchasedGames: game._id
            }
          })
        }

        const purchasedCard: IPurchasedCard = new PurchasedCard({
          user: req.body._id,
          card: card._id,
          score: [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
          ]
        })

        const newPurchasedCard = await purchasedCard.save()

        await game.updateOne({
          $push: {
            purchasedCards: newPurchasedCard._id
          },
          $pull: {
            cards: card._id
          }
        })

        res.status(201).json(
          JSON.stringify(
            {
              success: true,
              data: newPurchasedCard
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
