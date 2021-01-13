import { useEffect, useState } from 'react'
import Axios from 'axios'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

import { IGame } from 'models/Game'

interface IProps {
  id?: string,
  _game?: IGame
}

export default function InfoGame (props: IProps) {
  const [game, setGame] = useState<IGame | false>(props._game || false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadGame = async () => {
      try {
        if (!game && props.id) {
          const { data } = await Axios.get(`/api/game/${props.id}`, {
            headers: {
              token: `${localStorage.getItem('BINGOAL_TOKEN')}`
            },
            data: {}
          })
          setGame(data.data as IGame)
        }
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
      <CircularProgress />
    )
  } else {
    return (
      <Typography component='h1' variant='body1'>Game not found</Typography>
    )
  }
}
