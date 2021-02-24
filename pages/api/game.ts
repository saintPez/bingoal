import { NextApiRequest, NextApiResponse } from 'next'

import Config from 'lib/config'
import Card, { ICard } from 'lib/database/models/card'
import Game, { IGame } from 'lib/database/models/game'

import validation from 'lib/validation/game'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    await Config({ req, method: ['GET', 'POST'], auth: [false, true] })

    if (req.method === 'GET') {
      const ofset =
        parseInt(req.query.ofset as string) | parseInt(req.body.ofset) | 0
      const limit =
        parseInt(req.query.limit as string) | parseInt(req.body.limit) | 20

      const countDocuments = await Card.countDocuments()
      let last_document: number

      if (limit === 0 || ofset + limit >= countDocuments) {
        if (ofset >= countDocuments) last_document = null
        else last_document = -1
      } else last_document = ofset + limit

      const game: IGame[] = await Game.find({}, null, {
        skip: ofset,
        limit: limit,
      })

      res.status(200).json({
        success: true,
        game,
        last_document: last_document,
      })
    } else {
      await validation.validateAsync({ game_date: req.body.game.game_date })

      const cards = ((await Game.find({}, { _id: 1 })) as ICard[]).map(
        (card) => ({
          data: card._id,
        })
      )

      const balls = createBalls().map((ball) => ({
        data: ball,
      }))

      const game: IGame = await new Game({
        played: false,
        playing: false,
        cards,
        balls,
        game_date: new Date(req.body.game.game_date),
      }).save()

      res.status(200).json({
        success: true,
        game,
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

function createBalls() {
  const result: Array<number> = []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const BINGO = [...(Array(75).keys() as any)].map((ball) => ball + 1)

  for (let i = 0; i < 75; i++) {
    result.push(
      ...BINGO.splice(Math.floor(Math.random() * (BINGO.length - 0)) + 0, 1)
    )
  }
  return result
}
