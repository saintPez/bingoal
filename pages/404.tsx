import Head from 'next/head'
import styles from 'styles/Error.module.scss'

export default function Error () {
  return (
    <>
      <Head>
        <title>404 - BinGoal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.h1}>404</h1>
      <div className={styles.div}>
        <h2 className={styles.h2}>This page could not be found.</h2>
      </div>
    </>
  )
}
