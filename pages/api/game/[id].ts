import { NextApiRequest, NextApiResponse } from 'next'

import Config from 'lib/config'
import User, { IUser } from 'lib/database/models/user'
import Game, { IGame } from 'lib/database/models/game'

import validation from 'lib/validation/game'
import AdminError from 'lib/error/admin'
import BingoalError from 'lib/error/bingoal'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    await Config({
      req,
      method: ['GET', 'PUT', 'DELETE'],
      auth: [false, true, true],
    })

    const game: IGame = await Game.findById(req.query.id as string)
      .populate({
        path: 'cards',
        populate: {
          path: 'user',
        },
      })
      .populate({
        path: 'cards',
        populate: {
          path: 'data',
        },
      })

    if (!game) throw new BingoalError('Game not found')

    const profile: IUser = await User.findById(req.body._id)

    if (req.method === 'GET') {
      res.status(200).json({
        success: true,
        game,
      })
    } else if (req.method === 'PUT') {
      if (!profile.admin)
        throw new AdminError('You need to be an admin to access')

      const update = req.body.update || req.body
      delete update._id
      delete update.cards
      delete update.balls

      await validation.validateAsync(update)

      await Game.updateOne({ _id: req.query.id as string }, { ...update })
      const game: IGame = await Game.findById(req.query.id as string)

      res.status(200).json({
        success: true,
        game,
      })
    } else {
      if (!profile.admin)
        throw new AdminError('You need to be an admin to access')

      await Game.findByIdAndDelete(req.query.id as string)

      res.status(200).json({
        success: true,
      })
    }
  } catch (error) {
    if (error.name === 'InternalError') {
      console.log(error)
      res.status(error.status || 500).json({
        success: false,
        error: { ...error, name: error.name, message: error.message },
      })
    } else {
      res.status(error.status || 400).json({
        success: false,
        error: { ...error, name: error.name, message: error.message },
      })
    }
  }
}
