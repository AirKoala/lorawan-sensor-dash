export default function Page({ params }: { params: {
  sensorid: string,
}}) {
  return (
    <>
      { params.sensorid }
    </>
  )
}
