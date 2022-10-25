#Start kafka
docker-compose rm -svf
docker-compose up

# open -a Terminal "`pwd`"
# Create topic
docker exec -it kafka /opt/bitnami/kafka/bin/kafka-topics.sh \
    --create \
    --bootstrap-server localhost:9092 \
    --replication-factor 1 \
    --partitions 1 \
    --topic test

# Start node apps
npm run start:producer
npm run start:consumer
