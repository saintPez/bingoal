import { NextApiRequest, NextApiResponse } from 'next'

import Config from 'lib/config'
import User, { IUser } from 'lib/database/models/user'

import AdminError from 'lib/error/admin'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    await Config({ req, method: ['GET', 'PUT', 'DELETE'], auth: true })

    const profile: IUser = User.findById(req.body._id)

    if (req.method === 'GET') {
      let user: IUser

      if (profile.admin || profile._id === req.query.id)
        user = await User.findById(req.query.id as string)
      else {
        user = await User.findById(req.query.id as string, {
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
          createdAt: 1,
          updatedAt: 1,
        })
      }

      res.status(200).json({
        success: true,
        user,
      })
    } else if (req.method === 'PUT') {
      if (!(profile.admin || profile._id === req.query.id))
        throw new AdminError('You need to be an admin to access')

      const update = req.body.update

      await User.updateOne({ _id: req.query.id as string }, update)
      const user: IUser = User.findById(req.query.id as string)

      res.status(200).json({
        success: true,
        user,
      })
    } else {
      if (!(profile.admin || profile._id === req.query.id))
        throw new AdminError('You need to be an admin to access')

      await User.findByIdAndDelete(req.query.id as string)

      res.status(200).json({
        success: true,
      })
    }
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
