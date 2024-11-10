import Link from 'next/link';
import { Button } from 'react-bootstrap';

export default function Home() {
  return (<>
    <h1 className="text-3xl font-bold underline mb-5">
      Lorawan Sensor Dashboard
    </h1>

    <ul style={{listStyle: "none"}}>
      <li className="mb-2"><Link href="/dashboard/sensor/list"><Button>List Sensors</Button></Link></li>
      <li><Link href="/dashboard/sensor/add"><Button>Add Sensor</Button></Link></li>
    </ul>
  </>);
}
