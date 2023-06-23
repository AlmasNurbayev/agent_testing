async function sendToRabbit() {
  // const queue = 'transactions';
  // const conn = await amqplib.connect(`amqp://${process.env.RMUSER}:${process.env.RMPASSWORD}@localhost`);
  // const ch2 = await conn.createChannel();
  // await ch2.assertQueue(queue);
  // await ch2.sendToQueue(queue, Buffer.from(JSON.stringify(
  //   {
  //     user: String(user.id), 
  //     message: "new_transactions",
  //     payload: arrNewTrans, 
  //     count: index
  //   }
  // )));
}
