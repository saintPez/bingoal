import { NextApiRequest, NextApiResponse } from 'next'

import Config from 'lib/config'
import User, { IUser } from 'lib/database/models/user'

export default async function Signin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    await Config({ req, method: ['GET'], auth: true })

    const user: IUser = await User.findById(req.query.id as string, {
      email: {
        $cond: [{ $eq: ['$email.private', true] }, { private: true }, '$email'],
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

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    if (error.name === 'InternalError') {
      console.log(error)
      res.status(500).json({
        error: `${error.name}: ${error.message}`,
      })
    } else {
      res.status(400).json({
        error: error.errors || `${error.name}: ${error.message}`,
      })
    }
  }
}
