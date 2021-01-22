import Card from 'components/card'

export default function PlayCard ({ data, game }) {
  return (
    <div>
      {
        JSON.stringify(data, null, 4)
      }
      <Card id={data.card} game={game} score={data.score} disabled={true}/>
    </div>
    // <Card className={styles.mycard} variant='outlined'>
    //   <CardContent>
    //     <div className={styles.header}>
    //       <div>B</div>
    //       <div>I</div>
    //       <div>N</div>
    //       <div>G</div>
    //       <div>O</div>
    //     </div>
    //     <div className={styles.content}>
    //       {
    //         (data.data.data as Array<any>)?.map((ball) => (
    //           <Ball key={`${data._id}-${ball}`} ball={ball}/>
    //         ))
    //       }
    //       </div>
    //   </CardContent>
    // </Card>
  )
}
