console.log('Consumer started...');
const Kafka = require('node-rdkafka');

const consumer = Kafka.KafkaConsumer(
  {
    'group.id': 'kafka',
    'metadata.broker.list': 'localhost:9092',
  },
  {}
);

consumer.connect();

consumer
  .on('ready', () => {
    console.log('consumer ready...');
    _queryWatermarkOffsets();
    consumer.subscribe(['test', 'myData']);
    consumer.consume();
  })
  .on('data', (data) => {
    if (data.topic === 'myData') {
      let dataValue = JSON.parse(data.value);
      console.log('data object received');
      console.log(dataValue);
    } else {
      console.log('Data received: ', data.value.toString());
    }
  });

function exitHandler(options, exitCode) {
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) {
    consumer.unsubscribe();
    consumer.disconnect();
    console.log('Cleaning up...');
    setTimeout(() => {
      process.exit();
    }, 1500);
  }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

const _queryWatermarkOffsets = () => {
  consumer.queryWatermarkOffsets('test', 0, 5000, function (err, offsets) {
    if (err) {
      console.log('===== queryWatermarkOffsets ====');
      console.log(err);
      console.log('=====  ====');
    } else {
      var high = offsets.highOffset;
      var low = offsets.lowOffset;
      console.log(high);
      console.log(offsets);
    }
  });
};
