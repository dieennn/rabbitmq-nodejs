const amqp = require("amqplib");
const db = require("./models/todo.js");
const formatData = require("./util/formatData");
const mq = require("./services/MQService");

const clientToDo = async () =>
  amqp
    .connect(process.env.BASE_URL_RABBITMQ)
    .then(async (conn) => {
      return conn.createChannel().then((ch) => {
        const createTodo = ch.assertQueue("req.create.todo", {
          durable: false,
        });
        if (createTodo) {
          createTodo
            .then(() => {
              return ch.consume(
                "req.create.todo",
                (msg) => {
                  let _ = JSON.parse(msg.content.toString()) || {};
                  db.create(formatData.todo(_));
                  mq.publishToQueue("todo.created", formatData.todo(_));
                  console.log("created: ", _);
                },
                { noAck: true }
              );
            })
            .then(() => {
              console.log(
                "* Waiting for messages req.create.todo. Ctrl+C to exit"
              );
            });
        }

        const deletedTodo = ch.assertQueue("req.delete.todo", {
          durable: false,
        });
        if (deletedTodo) {
          deletedTodo
            .then(() => {
              return ch.consume(
                "req.delete.todo",
                async (msg) => {
                  let _ = JSON.parse(msg.content.toString()) || {};
                  console.log("deleted: ", _);
                  let deleteItem = await db.read(_.id);
                  mq.publishToQueue("todo.deleted", deleteItem);
                  db.delete(_.id);
                },
                { noAck: true }
              );
            })
            .then(() => {
              console.log(
                "* Waiting for messages req.delete.todo. Ctrl+C to exit"
              );
            });
        }
      });
    })
    .catch(console.warn);

module.exports = clientToDo;
