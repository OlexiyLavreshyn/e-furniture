const con = require('./config/db.js').default;

const amqp = require('amqplib');
const mysql = require('mysql2/promise');

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


async function startSubscriber() {
  const conn = await connectRabbit();
  console.log('Connected to RabbitMQ!');

  const channel = await conn.createChannel();

  await channel.assertQueue('order_events', { durable: true });
  console.log('Inventory subscriber listening for order_events...');

  channel.consume('order_events', async (msg) => {
    console.log('Received a message!');
    if (!msg) return;

    //console.log('Raw message:', msg.content.toString());  

    const event = JSON.parse(msg.content.toString());

    console.log('Event type:', event.type);
    console.log('Event payload:', event.payload);

    //console.log('Parsed event:', event);
    if (event.type === 'order.created') {
      //console.log('Processing order:', event.aggregate_id);

      // event.payload should contain order_items
      const orderItems = event.payload.items;
        console.log(orderItems);
        console.log("adwa");
      // decrease inventory
      for (const item of orderItems) {
        await pool.query(
          'UPDATE goods SET quantity_in_stock = quantity_in_stock - ? WHERE idgoods = ?',
          [item.quantity, item.good_id]
        );
        console.log(`Decreased stock of good ${item.good_id} by ${item.quantity}`);
      }
    }
    else{
        console.log("hui");
    }
    // acknowledge message
    channel.ack(msg);
  });
}

startSubscriber().catch(console.error);
