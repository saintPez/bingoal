import { NextApiRequest, NextApiResponse } from 'next'

import Config from 'lib/config'
import Card, { ICard } from 'lib/database/models/card'
import Game from 'lib/database/models/game'

import validation from 'lib/validation/card'
import createCard from 'lib/create/card'

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

      const card: ICard[] = await Card.find({}, null, {
        skip: ofset,
        limit: limit,
      })

      res.status(200).json({
        success: true,
        card,
        last_document: last_document,
      })
    } else {
      let card: ICard

      if (!req.body.card) {
        const data = await createCard()
        card = new Card({ data: data })
      } else {
        await validation.validateAsync({ data: req.body.card })

        await Card.findOne(
          {
            data: { $all: req.body.card },
          },
          null,
          {},
          (error, doc) => {
            if (doc) card = doc
            else card = new Card({ data: req.body.card })
          }
        )
      }

      await Game.updateMany(
        { played: false, playing: false },
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          $push: { cards: { purchased: false, won: false, data: card } } as any,
        },
        { multi: true }
      )

      res.status(200).json({
        success: true,
        card,
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
