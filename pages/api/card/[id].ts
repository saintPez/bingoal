import { NextApiRequest, NextApiResponse } from 'next'

import Config from 'lib/config'
import User, { IUser } from 'lib/database/models/user'
import Card, { ICard } from 'lib/database/models/card'

import validation from 'lib/validation/card'
import AdminError from 'lib/error/admin'

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

    const profile: IUser = await User.findById(req.body._id)

    if (req.method === 'GET') {
      const card: ICard = await Card.findById(req.query.id as string)

      res.status(200).json({
        success: true,
        card,
      })
    } else if (req.method === 'PUT') {
      if (!profile.admin)
        throw new AdminError('You need to be an admin to access')

      const update = req.body.update || req.body
      delete update._id

      await validation.validateAsync(update)

      await Card.updateOne({ _id: req.query.id as string }, { ...update })
      const card: ICard = await Card.findById(req.query.id as string)

      res.status(200).json({
        success: true,
        card,
      })
    } else {
      if (!profile.admin)
        throw new AdminError('You need to be an admin to access')

      await Card.findByIdAndDelete(req.query.id as string)

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
