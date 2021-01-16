import { useEffect, useState } from 'react'
import Axios from 'axios'

import InfoGame from 'components/infoGame'

import { IGame } from 'models/Game'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

export default function GameId () {
  const [games, setGames] = useState<IGame[] | false>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadGames = async () => {
      try {
        const { data } = await Axios.get('/api/games', {
          headers: {
            token: `${localStorage.getItem('BINGOAL_TOKEN')}`
          },
          data: {}
        })
        setGames((data.data as IGame[]))
      } catch (error) {
        setGames(false)
      }
    }
    loadGames()
    setLoading(false)
  }, [])

  if (!loading && games) {
    return (
      <>
        <Grid container spacing={3}>
          {
            (games as Array<IGame>).map((game) => {
              if (!game.played && !game.playing) {
                return (
                  <Grid key={`${game._id}`} item xs={12} md={6} lg={4}>
                    <InfoGame data={game}/>
                  </Grid>
                )
              } else {
                return (
                  <></>
                )
              }
            })
          }
        </Grid>
      </>
    )
  } else if (loading && !games) {
    return (
      <>
        <CircularProgress />
      </>
    )
  } else {
    return (
      <>
        <Typography component='h1' variant='body1'>Games not found</Typography>
      </>
    )
  }
}
