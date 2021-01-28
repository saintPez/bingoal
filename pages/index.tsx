import Head from 'next/head'

export default function Home(): JSX.Element {
  document.cookie = 's=s'
  return (
    <>
      <Head>
        <title>HOME - BinGoal</title>
      </Head>
      <main></main>
    </>
  )
}
