import { connect, connection } from 'mongoose'

export default async function Connection(): Promise<void> {
  try {
    if (connection.readyState === 1 || connection.readyState === 2) return

    connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })

    connection.once('connected', () => {
      console.log(`Info: Database is connected to '${process.env.MONGO_URI}'`)
      import('lib/database/models/user')
      import('lib/database/models/card')
      import('lib/database/models/game')
    })
  } catch (error) {
    console.log(`${error.name}: ${error.message}`)
  }
}
