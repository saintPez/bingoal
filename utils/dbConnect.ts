import { connect, connection } from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export default async function dbConnect () {
  try {
    if (connection.readyState === 1 || connection.readyState === 2) return
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not defined')
    if (!process.env.TOKEN_SECRET) throw new Error('TOKEN_SECRET is not defined')

    connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    connection.once('connected', () => {
      console.log(
                `INFO: Database is connected to '${process.env.MONGO_URI}'`
      )
    })
  } catch (error) {
    console.log(`ERROR: an error has occured in the database: ${error}`)
  }
}
