import { NextApiRequest, NextApiResponse } from 'next'

import Config from 'lib/config'
import Card, { ICard } from 'lib/database/models/card'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    await Config({ req, method: 'GET' })

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
  } catch (error) {
    if (error.name === 'InternalError') {
      console.log(error)
      res.status(error.status || 500).json({
        success: false,
        error: `${error.name}: ${error.message}`,
      })
    } else {
      res.status(error.status || 400).json({
        success: false,
        error: error.errors || `${error.name}: ${error.message}`,
      })
    }
  }
}
