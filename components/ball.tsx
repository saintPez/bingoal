import styles from 'styles/components/Ball.module.scss'

export default function Ball ({ ball }) {
  return (
    <div className={styles.ball}>
      {ball}
    </div>
  )
}
