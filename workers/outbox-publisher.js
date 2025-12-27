const con = require('./config/db.js').default;

const mysql = require('mysql2/promise');
const amqp = require('amqplib');

const RABBIT_URL = 'amqp://guest:guest@rabbitmq:5672';

async function connectRabbit() {
  let conn;
  while (!conn) {
    try {
      conn = await amqp.connect(RABBIT_URL);
    } catch (err) {
      console.log('Waiting for RabbitMQ...');
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  return conn;
}

async function publishOutbox() {
  const conn = await connectRabbit();
  const channel = await conn.createChannel();

  await channel.assertQueue('order_events', { durable: true });

  while (true) {
    const [rows] = await pool.query('SELECT * FROM outbox WHERE published = FALSE LIMIT 10');

    if (!rows.length) {
      // nothing to publish, wait a bit
      await new Promise(r => setTimeout(r, 2000));
      continue;
    }

    for (const row of rows) {
    try {
        const event = {
        type: row.event_type,          // e.g., "order.created"
        aggregate_type: row.aggregate_type,
        aggregate_id: row.aggregate_id,
        payload: row.payload           // this is your items array
        };

        channel.sendToQueue(
        'order_events',
        Buffer.from(JSON.stringify(event)),
        { persistent: true }
        );

        await pool.query('UPDATE outbox SET published = TRUE WHERE id = ?', [row.id]);

        console.log(`Published event ${row.event_type} for aggregate ${row.aggregate_type}:${row.aggregate_id}`);
    } catch (err) {
        console.error('Failed to publish:', err);
    }
    }

  }
}

publishOutbox().catch(console.error);
