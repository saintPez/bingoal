import Head from 'next/head'
import styles from 'styles/Error.module.scss'

export default function Error () {
  return (
    <>
      <Head>
        <title>Error - Bingo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.h1}>ERROR</h1>
      <div className={styles.div}>
        <h2 className={styles.h2}>An error occurred.</h2>
      </div>
    </>
  )
}
