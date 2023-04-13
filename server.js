const express = require('express');
const cors = require('cors');
const kafka = require('kafka-node');
const app = express();
const bodyParser = require('body-parser');
const { execSync } = require('child_process');
const { exec } = require('child_process');


app.use(cors());
app.use(bodyParser.json());


// messages_out_no_memory
let newMessage = '';
let messages = [];


// messages_from_timestamp_out
let newMessageTimestamp = '';
let messagesTimestamp = [];

const Consumer = kafka.Consumer;
let client = new kafka.KafkaClient();
//client.setMaxListeners(100000); // Establecer límite de escuchadores, CUIDADO FUGAS DE MEMORIA


const client2 = new kafka.KafkaClient();


let consumerTimestamp = new Consumer(
  client,
  [{ topic: 'messages_from_timestamp_out', partition: 0, offset: 0 }], // topic, partition y offset
  { autoCommit: false }
);



const consumer = new Consumer(client2, [{ topic: 'messages_out_no_memory', partition: 0, offset: 0 }], {
  autoCommit: true
});


let counterExecutions = 0; // cuenta el numero de veces que el usuario busca por un timestamp. Se utiliza para ejecutar kill $sparkTimestamp sin que provoque errores
// para que no provoque errores, debe ejecutarse unicamente si existe un proceso PID



function createNewConsumer() {
  setTimeout(() => {
    messagesTimestamp = [];
    consumerTimestamp.close();
    client = new kafka.KafkaClient();
    consumerTimestamp = new Consumer(
      client,
      [{ topic: 'messages_from_timestamp_out', partition: 0, offset: 0 }], // topic, partition y offset
      { autoCommit: false }
    );

    consumerTimestamp.on('message', message => {
      if (message.topic === "messages_from_timestamp_out") {
        newMessageTimestamp = message.value;
        messagesTimestamp.unshift(newMessageTimestamp);
      }
      console.log(messagesTimestamp.length, "messages_timestamp");
    });

    console.log("termina timeout y nuevo consumer creado, permitimos la recepcion de mensajes al array")

  }, 7000);
}

consumer.on('message', message => {

  if (message.topic === "messages_out_no_memory") {
    if (newMessage !== message.value) {
      newMessage = message.value;
      // Añadir el nuevo mensaje al principio del array
      messages.unshift(newMessage);
    }
  }
  //console.log(messages, "messages_out_no_memory");

});



app.get('/messages', (req, res) => {
  res.send(messages); //envio el array (string) completo a quien me lo pida con fetch
});


app.get('/messages-timestamp', (req, res) => {
  res.send(messagesTimestamp);
});


app.post('/run-scala-code', (req, res) => {


  // Al llamar al botón submit, limpiamos el array messagesTimestamp y bloqueamos recepcion de mensajes
  messagesTimestamp = [];

  // Obtenemos variables del dashboard
  const { resultDate, resultDay, selectedIDSend } = req.body;
  console.log(resultDate, resultDay, selectedIDSend);

  const routeScript = `/app/dashboard/scripts`;
  //const routeLibrary = `/app/streamingProject/bibliotecas_jars`;
  //const routeToJar = `/app/streamingProject/target/scala-2.11`;
  const args = [resultDay, resultDate, selectedIDSend];
  const commandExec = `curl http://localhost:5006/spark-submit/${resultDay}/${resultDate}/${selectedIDSend}`;

  //console.log(commandExec);
  console.log(counterExecutions);

  if (counterExecutions > 0) { //si existe un proceso spark-submit previo
    counterExecutions = counterExecutions + 1;

    try {
      console.log(args.join(' '));
      const resultScript = execSync(`cd ${routeScript} && ./script.sh`).toString(); //tomamos PID y eliminamos proceso spark-submit previo

      // Ejecucion de manera asincrona 
      const result = exec(`${commandExec}`).toString();

      createNewConsumer();

      res.send({ result });

    } catch (error) {
      res.status(500).send({ error: error.message });
    }

  }

  else { // si no existe un proceso spark-submit previo
    counterExecutions = counterExecutions + 1;

    try {
      console.log(args.join(' '));

      // Ejecucion de manera asincrona
      const result = exec(`${commandExec}`).toString();

      createNewConsumer();

      res.send({ result });
      console.log(result);

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

});

app.listen(3001, () => {
  console.log('Server is listening on port 3001');
});


