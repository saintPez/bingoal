import { useEffect, useState } from 'react'
import Axios from 'axios'
import styles from 'styles/components/Card.module.scss'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import { ICard } from 'models/Card'

interface IProps {
  id?: string,
  game?: string,
  data?: ICard
}

export default function Card (props: IProps) {
  const [card, setCard] = useState<ICard | false>(props.data || false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadGame = async () => {
      try {
        if (!card && props.id) {
          const { data } = await Axios.get(`/api/card/${props.id}`, {
            headers: {
              token: `${localStorage.getItem('BINGOAL_TOKEN')}`
            },
            data: {
              game: props.game || {}
            }
          })
          setCard(data.data as ICard)
        }
      } catch (error) {
        setCard(false)
      }
    }
    loadGame()
    setLoading(false)
  }, [])

  if (!loading && card) {
    return (
      <>
        <Grid container spacing={3} className={styles.grid}>
          {
            (card.data as Array<any>).map((ball, index) => (
              <Grid key={`${card._id}-${index}`} item xs={2}>
                {ball}
              </Grid>
            ))
          }
        </Grid>
      </>
    )
  } else if (loading) {
    return (
      <CircularProgress />
    )
  } else {
    return (
      <Typography component='h1' variant='body1'>Card not found</Typography>
    )
  }
}
