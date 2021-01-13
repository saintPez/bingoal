import { useEffect, useState, ChangeEvent, ReactNode } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import Axios from 'axios'
import styles from 'styles/components/Profile.module.scss'

import InfoGame from 'components/infoGame'

import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'

import { IUser } from 'models/User'

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

export default function Profile ({ id }) {
  const [user, setUser] = useState<IUser | false>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [value, setValue] = useState<number>(0)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await Axios.get(`/api/profile/${id}`, {
          headers: {
            token: `${localStorage.getItem('BINGOAL_TOKEN')}`
          },
          data: {}
        })
        setUser(data.data as IUser)
      } catch (error) {
        setUser(false)
        setTimeout(() => {
          Router.push('/')
        }, 3000)
      }
    }
    loadUser()
    setLoading(false)
  }, [])

  if (!loading && user) {
    return (
      <>
        <Head>
            <title>{`${user.nickname}#${user.hash} - BinGoal`}</title>
        </Head>
        <main className={styles.main}>
          {/* <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <Typography component='span' variant='overline'>{`${user._id}`}</Typography>
              Avatar
            </Grid>
            <Grid item xs={12} md={8}>
            <Typography component='h1' variant='h5'>{`${user.nickname}#${user.hash}`}</Typography>
            <Typography component='h2' variant='h5'>{`${user.firstname} ${user.lastname}`}</Typography>
            <Typography component='h2' variant='h5'>{`${user.email}`}</Typography>
            <Typography component='h2' variant='h5'>{`${user.dateOfBirth}`}</Typography>
            </Grid>
          </Grid> */}
          <div className={styles.user}>
            <div className={styles.userId}>
              <Typography component='span' color="textSecondary" className={styles.id}>{`ID: ${user._id}`}</Typography>
            </div>
            <div className={styles.userAvatar}>
              <Avatar className={styles.avatar}>{`${user.firstname.substr(0, 1)}${user.lastname.substr(0, 1)}`}</Avatar>
            </div>
            <div className={styles.userInfo}>
              <Typography component='h1' variant='h6'>{`${user.firstname} ${user.lastname}`}</Typography>
              <Typography component='h2' variant='body1'>{`${user.nickname}#${user.hash}`}</Typography>
              <Typography component='h2' variant='body1'>{`${user.email}`}</Typography>
              <Typography component='h2' variant='body1'>{`${user.dateOfBirth}`}</Typography>
            </div>
          </div>
          <Paper className={styles.paper}>
            <Tabs
              value={value}
              onChange={(event: ChangeEvent, newValue: number) => { setValue(newValue) }}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Purchased Games" {...a11yProps(0)}/>
              <Tab label="Won Games" {...a11yProps(1)}/>
            </Tabs>
          </Paper>
          <div className={styles.tabPanels}>
          <TabPanel value={value} index={0}>
            <Grid container spacing={3}>
            {
              !user.purchasedGames.length
                ? (
                <Grid item xs={12}>
                  <Typography component='p' variant='body1'>Purchased Games not found</Typography>
                </Grid>
                  )
                : user.purchasedGames.map((game) => (
                  <Grid key={`${game}`} item xs={12} md={6} lg={4}>
                    <InfoGame id={`${game}`} won={!!user.wonGames.find((element) => element === game)}/>
                  </Grid>
                ))
            }
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Grid container spacing={3}>
            {
              !user.wonGames.length
                ? (
                <Grid item xs={12}>
                  <Typography component='p' variant='body1'>Won Games not found</Typography>
                </Grid>
                  )
                : user.wonGames.map((game) => (
                  <Grid key={`${game}`} item xs={12} md={6} lg={4}>
                    <InfoGame id={`${game}`} won={true}/>
                  </Grid>
                ))
            }
            </Grid>
          </TabPanel>
          </div>
        </main>
      </>
    )
  } else if (loading) {
    return (
      <>
        <Head>
          <title>LOADING - BinGoal</title>
        </Head>
        <CircularProgress />
      </>
    )
  } else {
    return (
      <>
        <Head>
          <title>User not found - BinGoal</title>
        </Head>
        <Typography component='h1' variant='h3'>User not found</Typography>
      </>
    )
  }
}
