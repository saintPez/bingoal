import { NextApiRequest, NextApiResponse } from 'next'

import Config from 'lib/config'
import User, { IUser } from 'lib/database/models/user'
import { ICard } from 'lib/database/models/card'
import Game, { IGame } from 'lib/database/models/game'

import AdminError from 'lib/error/admin'
import BingoalError from 'lib/error/bingoal'

import validation from 'lib/validation/ball'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    await Config({ req, method: 'POST', auth: true })

    const profile: IUser = await User.findById(req.body._id)

    if (!(profile.admin || `${profile._id}` === `${req.query.id}`))
      throw new AdminError('You need to be an admin to access')

    await validation.validateAsync({ game: req.query.game || req.body.game })

    let game: IGame = await Game.findById(req.query.game || req.body.game)
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
    // if (game.played) throw new BingoalError('Game has already been played')
    // if (!game.playing) throw new BingoalError('Game is not playing')

    const balls = game.balls.filter((ball) => ball.saved === false)

    const ball = balls[Math.floor(Math.random() * balls.length)]

    const cards = game.cards.filter((card) =>
      // card.purchased === true &&
      (card.data as ICard).data.find((number) => number === ball.data)
    )

    for (const card of cards) {
      const index = (card.data as ICard).data.findIndex(
        (number) => number === ball.data
      )
      card.score[index] = true

      if (!card.score.find((score) => score === false)) card.won = true

      await Game.updateOne(
        { _id: req.query.game || req.body.game, 'cards._id': card._id },
        { $set: { 'cards.$': { ...card } } }
      )
    }

    game = await Game.findOne({ _id: req.query.game || req.body.game })

    if (game.cards.find((card) => card.won === true))
      await Game.updateOne(
        { _id: req.query.game || req.body.game },
        { played: true }
      )

    game = await Game.findOne({ _id: req.query.game || req.body.game })
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

    res.status(200).json({
      success: true,
      game,
    })
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
