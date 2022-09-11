const amqp = require("amqplib");
const CONN_URL = process.env.BASE_URL_RABBITMQ;

const MQService = {
  async publishToQueue(queueName, data) {
    amqp.connect(CONN_URL).then((conn) => {
      return conn
        .createChannel()
        .then((ch) => {
          ch.assertQueue(queueName, { durable: false });
          ch.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
        })
        .finally(() => {
          //Tutup koneksi ke RabbitMQ setelah selesai menggunakan.
          setTimeout(function () {
            conn.close();
          }, 500);
        });
    });
  },
};

module.exports = MQService;
