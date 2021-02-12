import { NextApiRequest, NextApiResponse } from 'next'

import Config from 'lib/config'
import User, { IUser } from 'lib/database/models/user'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    await Config({ req, method: 'GET', auth: true })

    const profile: IUser = await User.findById(req.body._id)

    const ofset =
      parseInt(req.query.ofset as string) | parseInt(req.body.ofset) | 0
    const limit =
      parseInt(req.query.limit as string) | parseInt(req.body.limit) | 20

    const countDocuments = await User.countDocuments()
    let last_document: number

    if (limit === 0 || ofset + limit >= countDocuments) {
      if (ofset >= countDocuments) last_document = null
      else last_document = -1
    } else last_document = ofset + limit

    let user: IUser[]

    if (profile.admin) {
      user = await User.find({}, null, {
        skip: ofset,
        limit: limit,
      })
    } else {
      user = await User.find(
        {},
        {
          email: {
            $cond: [
              { $eq: ['$email.private', true] },
              { private: true },
              '$email',
            ],
          },
          birth_date: {
            $cond: [
              { $eq: ['$birth_date.private', true] },
              { private: true },
              '$birth_date',
            ],
          },
          time_zone: {
            $cond: [
              { $eq: ['$time_zone.private', true] },
              { private: true },
              '$time_zone',
            ],
          },
          avatar_url: 1,
          language: 1,
          verified: 1,
          baned: 1,
          admin: 1,
          name: 1,
          games: 1,
          createdAt: 1,
          updatedAt: 1,
        },
        {
          skip: ofset,
          limit: limit,
        }
      )
    }

    res.status(200).json({
      success: true,
      user,
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
