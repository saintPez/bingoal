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

    let game: IGame = await Game.findById(
      req.query.game || req.body.game
    ).populate({
      path: 'cards',
      populate: {
        path: 'data',
      },
    })

    if (!game) throw new BingoalError('Game not found')
    if (game.played) throw new BingoalError('Game has already been played')
    if (!game.playing) throw new BingoalError('Game is not playing')

    const balls = game.balls.filter((ball) => ball.saved === false)

    const ball = balls[Math.floor(Math.random() * balls.length)]
    ball.saved = true

    const cards = game.cards.filter(
      (card) =>
        card.purchased === true &&
        (card.data as ICard).data.find((number) => number === ball.data)
    )

    for (const card of cards) {
      const index = (card.data as ICard).data.findIndex(
        (number) => number === ball.data
      )
      card.score[index] = true

      if (card.score.find((score) => score === false) === undefined) {
        card.won = true

        const user: IUser = await User.findById(card.user)
        const user_game = user.games.find(
          (user_game) => `${user_game.data}` === `${game._id}`
        )
        user_game.won = true

        await User.updateOne(
          { _id: card.user as string, 'games.data': game._id },
          {
            'games.$': { ...user_game },
          }
        )
      }

      await Game.updateOne(
        { _id: req.query.game || req.body.game, 'cards._id': card._id },
        { $set: { 'cards.$': { ...card } } }
      )
    }

    await Game.updateOne(
      { _id: req.query.game || req.body.game, 'balls._id': ball._id },
      { $set: { 'balls.$': { ...ball } } }
    )

    if (cards.find((card) => card.won === true))
      await Game.updateOne(
        { _id: req.query.game || req.body.game },
        { played: true, playing: false }
      )

    game = await Game.findOne({
      _id: req.query.game || req.body.game,
    }).populate({
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
