const Kafka = require('node-rdkafka');

const client = Kafka.AdminClient.create({
  'client.id': 'kafka-admin',
  'metadata.broker.list': 'localhost:9092',
});

const createTopic = async (topicName) => {
  console.log(`Creating new topic ${topicName}...`);
  return new Promise((resolve, reject) => {
    client.createTopic(
      {
        topic: topicName,
        num_partitions: 1,
        replication_factor: 1,
      },
      function (err, data) {
        if (err) {
          console.log(err);
          reject(err);
        }
        console.log('topic created');
        console.log(data);
        resolve(data);
      }
    );
  });
};

module.exports = createTopic;
