'use client';

import Link from 'next/link';
import { readingsCsv } from './actions';
import { DownloadIcon } from 'lucide-react';

export default function DownloadButton({ sensorId }: { sensorId: string }) {
  return <Link href="#" passHref={true}
    onClick={async () => {
      const csv = await readingsCsv(sensorId);
      const csvBlob = new Blob([csv], { type: "text/csv" });

      const url = window.URL.createObjectURL(csvBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "readings.csv";
      a.click();

      window.URL.revokeObjectURL(url);
    }}
  >
    <DownloadIcon className="ms-2" />
  </Link>
} 
