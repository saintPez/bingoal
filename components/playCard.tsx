export default function PlayCard ({ data }) {
  return (
    <div>
      {
        JSON.stringify({ data }, null, 4)
      }
    </div>
  )
}
