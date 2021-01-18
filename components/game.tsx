import { useEffect, useState, ReactNode } from 'react'
import Axios from 'axios'
import styles from 'styles/components/Game.module.scss'

import Card from 'components/card'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'

import { IGame } from 'models/Game'

function a11yProps (index: number) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`
  }
}

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel (props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

interface IProps {
  id?: string,
  data?: IGame,
  user?: string
}

export default function Game (props: IProps) {
  const [game, setGame] = useState<IGame | false>(props.data || false)
  const [loading, setLoading] = useState<boolean>(true)
  const [value, setValue] = useState<number>(0)

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
      <main className={styles.main}>
        <Paper className={styles.paper}>
          <Tabs
            value={value}
            onChange={(event, newValue: number) => { setValue(newValue) }}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Cards" {...a11yProps(0)}/>
            <Tab label="Purchased Cards" {...a11yProps(1)}/>
          </Tabs>
        </Paper>
        <div className={styles.tabPanels}>
          <TabPanel value={value} index={0}>
            <div className={styles.content}>
            {game.cards.map((card) => (
              <Card key={card._id} data={card} disabled={game.playing || game.played} game={game._id}/>
            ))}
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className={styles.content}>
            {game.purchasedCards.map((purchasedCard) => (
              <Card key={`${purchasedCard.card}`} id={`${purchasedCard.card}`} disabled={true} user={props.user === `${purchasedCard.user}`} game={game._id}/>
            ))}
            </div>
          </TabPanel>
        </div>
      </main>
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
