import { NextApiRequest, NextApiResponse } from 'next'

import Config from 'lib/config'
import User, { IUser } from 'lib/database/models/user'
import Game, { IGame } from 'lib/database/models/game'

import BingoalError from 'lib/error/bingoal'

import validation from 'lib/validation/buy'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    await Config({ req, method: 'POST', auth: true })

    const id = req.query.card || req.body.card

    await validation.validateAsync({
      card: id,
    })

    let game: IGame = await Game.findOne({
      played: false,
      playing: false,
      'cards._id': id,
      'cards.purchased': false,
    })
    if (!game) throw new BingoalError('Card not found')

    const profile: IUser = await User.findById(req.body._id)
    const card = game.cards.find((card) => `${card._id}` === `${id}`)
    card.user = profile._id
    card.purchased = true

    await Game.updateOne({ 'cards._id': id }, { 'cards.$': { ...card } })

    if (
      profile.games.find((element) => `${element.data}` === `${game._id}`) ===
      undefined
    )
      await User.updateOne(
        { _id: req.body._id },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { $push: { games: { data: game._id, won: false } } as any }
      )

    const user: IUser = await User.findById(req.body._id)

    game = await Game.findById(game._id)

    res.status(200).json({
      success: true,
      user,
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
