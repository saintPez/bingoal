import { NextApiRequest, NextApiResponse } from 'next'
import cors from 'cors'
import dbConnect from 'utils/dbConnect'
import Game, { IGame } from 'models/Game'
import User, { IUser } from 'models/User'
import { initMiddleware, validate } from 'utils/middleware'
import playValidation from 'validation/play.validation'
import tokenValidation from 'validation/token.validation'

const validateReq = initMiddleware(validate(playValidation))
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
        if (!user.admin) throw new Error('user is not admin')
        const game: IGame = await Game.findOne({
          _id: req.query.id || req.body.game
        })
        if (!game) throw new Error('game not found')

        if (game.gameDate > new Date()) throw new Error('game has not started yet')

        if (!game.played) throw new Error('game has already been played')

        if (game.playing) throw new Error('game is playing')

        game.updateOne({ playing: true })

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
          error: error
        },
        null,
        4
      )
    )
  }
}
