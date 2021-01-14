import { useEffect, useState } from 'react'
import Axios from 'axios'
import styles from 'styles/components/Game.module.scss'

import Card from 'components/card'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import { IGame } from 'models/Game'

interface IProps {
  id?: string,
  data?: IGame
}

export default function InfoGame (props: IProps) {
  const [game, setGame] = useState<IGame | false>(props.data || false)
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
        <main className={styles.main}>
          <Grid className={styles.grid} container spacing={3}>
            {game.cards.map((card) => (
              <Grid key={card._id} item xs={12} sm={6} md={4} lg={3}>
                <Card data={card}/>
              </Grid>
            ))}
          </Grid>
        </main>
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
