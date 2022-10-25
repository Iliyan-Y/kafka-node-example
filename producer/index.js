const Kafka = require('node-rdkafka');
const createTopic = require('./createTopic');

(async () => {
  await createTopic('test');
  await createTopic('myData');
})();

console.log('Producer started...');

const stream = Kafka.Producer.createWriteStream(
  {
    'metadata.broker.list': 'localhost:9092',
  },
  {},
  { topic: 'test' }
);

const myDataStream = Kafka.Producer.createWriteStream(
  {
    'metadata.broker.list': 'localhost:9092',
  },
  {},
  { topic: 'myData' }
);

stream.on('error', function (err) {
  // Here's where we'll know if something went wrong sending to Kafka
  console.error('Error in our kafka stream');
  console.error(err);
});

myDataStream.on('error', function (err) {
  // Here's where we'll know if something went wrong sending to Kafka
  console.error('Error in our kafka stream myData');
  console.error(err);
});

const addMessage = () => {
  const result = stream.write(Buffer.from('HELLO Kafka'));

  if (result) {
    console.log('Message added to the stream');
  } else {
    console.log('error happen on addMessage');
  }
};

const addToMyData = () => {
  const result = myDataStream.write(
    Buffer.from(
      JSON.stringify({
        message: 'my message',
        title: 'New topic ',
        randomArray: ['error 1', 'value 2'],
      })
    )
  );

  if (result) {
    console.log('Message added to myData ');
  } else {
    console.log('error happen on addMessage');
  }
};

setInterval(() => {
  addMessage();
}, 3000);

setInterval(() => {
  addToMyData();
}, 5000);
