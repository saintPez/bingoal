import { useEffect, useState } from 'react'
import Axios from 'axios'
import styles from 'styles/components/Card.module.scss'

import Ball from 'components/ball'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'

import { ICard } from 'models/Card'

interface IProps {
  id?: string,
  data?: ICard
  purchased: boolean
}

export default function GameCard (props: IProps) {
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
        <Card className={styles.card} variant='outlined'>
          <CardContent>
            <div className={styles.header}>
              <div>B</div>
              <div>I</div>
              <div>N</div>
              <div>G</div>
              <div>O</div>
            </div>
            <div className={styles.content}>
              {
                (card.data as Array<any>)?.map((ball) => (
                  <Ball key={`${card._id}-${ball}`} ball={ball}/>
                ))
              }
            </div>
          </CardContent>
          {
            !props.purchased && (
              <CardActions>
                <Button size="small">Buy</Button>
              </CardActions>
            )
          }
        </Card>
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
