import { useState, useEffect } from 'react'
import Axios from 'axios'

import styles from 'styles/drashboard/Admin.module.scss'

import Game from 'components/admin/game'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Fab from '@material-ui/core/Fab'

import AddIcon from '@material-ui/icons/Add'

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
        setGames(games)
      }
    }
    loadGames()
    setLoading(false)
  }, [games])

  const handleClik = async () => {
    try {
      const { data } = await Axios.post('/api/create/game', {}, {
        headers: {
          token: `${localStorage.getItem('BINGOAL_TOKEN')}`
        }
      })
      const newGames: IGame[] = games as IGame[]
      newGames.push((data.data as IGame))
      setGames(newGames)
    } catch (error) {
      setGames(games)
    }
  }

  if (!loading && games) {
    return (
      <>
        <Grid container spacing={3} className={styles.grid}>
          {
            (games as Array<IGame>).map((game) => (
              <Grid key={`${game._id}`} item xs={12} md={6} lg={4} className={styles.griditem}>
                <Game data={game} admin={true}/>
              </Grid>
            ))
          }
        </Grid>
        <Fab color="primary" aria-label="add" className={styles.fab} onClick={handleClik}>
          <AddIcon />
        </Fab>
      </>
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
