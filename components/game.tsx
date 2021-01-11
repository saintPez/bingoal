import { useEffect, useState } from 'react'
import Axios from 'axios'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

import { IGame } from 'models/Game'

export default function Game ({ id }) {
  const [game, setGame] = useState<IGame | false>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadGame = async () => {
      try {
        const { data } = await Axios.get(`/api/game/${id}`, {
          headers: {
            token: `${localStorage.getItem('BINGOAL_TOKEN')}`
          },
          data: {}
        })
        setGame(data.data as IGame)
      } catch (error) {
        setGame(false)
      }
    }
    loadGame()
    setLoading(false)
  }, [])

  if (!loading && game) {
    return (
      <>
        {
          JSON.stringify(game, null, 4)
        }
      </>
    )
  } else if (loading) {
    return (
      <>
        <CircularProgress />
      </>
    )
  } else {
    return (
      <>
        <Typography component='h1' variant='body1'>Game not found</Typography>
      </>
    )
  }
}
