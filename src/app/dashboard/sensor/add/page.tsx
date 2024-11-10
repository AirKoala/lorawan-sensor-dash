'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
// import Form from 'react-bootstrap/Form';

export default function Page() {
  const [readingCount, setReadingCount] = useState(1);

  return (
    <div>
      <h5>Add a new sensor</h5>
      <Form action="/dashboard/sensor/add/confirm-add" method="get">
        <Form.Group as={Row}
          className="mb-3"
          controlId="readingCount">
          { /*<Form.Label column sm="4">Number of readings</Form.Label>*/}
          <Col sm="8">
            <Form.Control
              required
              value={readingCount}
              onChange={(e) => {
                if (e.target.value === '') {
                  setReadingCount(1);
                  return;
                }
                const newVal = parseInt(e.target.value);
                if (!isNaN(newVal)) {
                  setReadingCount(newVal);
                }
              }}
              type="number"
              min="1"
              name="readingCount" />
          </Col>
        </Form.Group>
        <Button type="submit"
          variant="primary"
          className="mt-3">
          Register sensor on TTN
        </Button>
      </Form>
    </div>
  );
}
