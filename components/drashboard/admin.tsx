import { useState, useEffect } from 'react'
import Axios from 'axios'

import Game from 'components/admin/game'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import { IGame } from 'models/Game'

export default function Admin () {
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
      <Grid container spacing={3}>
        {
          (games as Array<IGame>).map((game) => (
            <Grid key={`${game._id}`} item xs={12} md={6} lg={4}>
              <Game data={game} admin={true}/>
            </Grid>
          ))
        }
      </Grid>
    )
  } else {
    return (
      <>
        <CircularProgress/>
        <Typography component='h1' variant='body1'>Games not found</Typography>
      </>
    )
  }
}
