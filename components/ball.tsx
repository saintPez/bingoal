import styles from 'styles/components/Ball.module.scss'

interface IPorps {
  ball: number,
  disabled?: boolean
}

export default function Ball (props : IPorps) {
  return (
    <div className={props.disabled ? styles.disabled : styles.ball}>
      {props.ball}
    </div>
  )
}
