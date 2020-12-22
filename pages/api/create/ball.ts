import { NextApiRequest, NextApiResponse } from 'next'
import cors from 'cors'
import dbConnect from 'utils/dbConnect'
import User, { IUser } from 'models/User'
import Game, { IGame } from 'models/Game'
import PurchasedCard, { IPurchasedCard } from 'models/purchasedCard'
import { initMiddleware, validate } from 'utils/middleware'
import tokenValidation from 'validation/token.validation'
import ballValidation from 'validation/create/ball.validation'
import createBalls from 'utils/create/balls'

const validateAuth = initMiddleware(validate(tokenValidation))
const validateReq = initMiddleware(validate(ballValidation))
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

        let game: IGame = await Game.findOne(
          req.body.game ? { _id: req.body.game } : {}
        ).populate({
          path: 'purchasedCards',
          populate: {
            path: 'user'
          }
        }).populate({
          path: 'purchasedCards',
          populate: {
            path: 'card'
          }
        })

        if (!game) throw new Error('game not found')
        if (game.played) throw new Error('game has already been played')
        if (!game.playing) throw new Error('game is not playing')

        if (!game.remainingBalls.length) await game.updateOne({ remainingBalls: createBalls() })

        game = await Game.findOne(
          req.body.game ? { _id: req.body.game } : {}
        ).populate({
          path: 'purchasedCards',
          populate: {
            path: 'user'
          }
        }).populate({
          path: 'purchasedCards',
          populate: {
            path: 'card'
          }
        })

        const index: number = Math.floor(Math.random() * (game.remainingBalls.length - 0)) + 0

        await game.updateOne({
          $push: {
            balls: game.remainingBalls[index]
          },
          $pull: {
            remainingBalls: game.remainingBalls[index]
          }
        })

        game = await Game.findOne(
          req.body.game ? { _id: req.body.game } : {}
        ).populate({
          path: 'purchasedCards',
          populate: {
            path: 'user'
          }
        }).populate({
          path: 'purchasedCards',
          populate: {
            path: 'card'
          }
        })

        const purchasedCards: IPurchasedCard[] = game.purchasedCards.filter(
          (element) =>
            element.card.data.find(
              (e) => e === game.balls[game.balls.length - 1]
            )
        )

        if (purchasedCards === undefined || !purchasedCards.length) {
          return res.status(200).json(
            JSON.stringify({
              success: true,
              data: game
            },
            null,
            4
            )
          )
        }

        const cards: IPurchasedCard[] = await PurchasedCard.find({
          _id: purchasedCards.map((element) => element._id)
        })
          .populate('card')
          .populate('user')

        // eslint-disable-next-line no-labels
        card: for (const card of cards) {
          const ind = card.card.data.findIndex(
            (element) => element === game.balls[game.balls.length - 1]
          )
          card.score[ind] = true
          await PurchasedCard.findOneAndUpdate(
            { _id: card._id },
            { score: card.score }
          )
          let count = 0
          for (const bool of card.score) {
            if (count === 2) {
              // eslint-disable-next-line no-labels
              continue card
            }
            if (!bool) count++
          }
          await game.updateOne({ $push: { winningCards: card._id }, played: true, playing: false })
          await card.save()
          await card.user.updateOne({ wonGames: game._id })
        }

        game = await Game.findOne(
          req.body.game ? { _id: req.body.game } : {}
        )
          .populate({
            path: 'purchasedCards',
            populate: {
              path: 'user'
            }
          })
          .populate({
            path: 'purchasedCards',
            populate: {
              path: 'card'
            }
          })

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
    console.log(error)
    res.status(400).json(
      JSON.stringify(
        {
          success: false,
          error
        },
        null,
        4
      )
    )
  }
}
