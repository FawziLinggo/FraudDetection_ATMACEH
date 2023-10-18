import json
import socket
import subprocess
from confluent_kafka import avro
from confluent_kafka.avro import AvroProducer
import time
import os

# GET ENVIRONMENT VARIABLES
try:
  KAFKA_BROKERS = os.environ['KAFKA_BROKERS']
  SCHEMA_REGISTRY = os.environ['SCHEMA_REGISTRY']
  CLIENT_ID = os.environ['CLIENT_ID']
except KeyError as e:
  KAFKA_BROKERS = "localhost:9092"

  SCHEMA_REGISTRY = "http://localhost:8081"

  CLIENT_ID = "atm-transactions-producer"

conf = {
    'bootstrap.servers': KAFKA_BROKERS,
    'client.id': CLIENT_ID,
    'schema.registry.url': SCHEMA_REGISTRY
}

value_schema_str = """
{
	"namespace": "ATM_TRANSACTION",
	"type": "record",
	"name": "value",
	"fields": [
		{"name": "account_id", "type": "string"},
		{"name": "atm",  "type": "string"},
		{"name": "amount", "type": "int"},
		{"name": "transaction_id",  "type": "string"},
		{"name": "location",  "type": {"type": "map", "values": "double"}},
		{"name": "timestamp",  "type": "string"},
		{"name": "address",  "type": "string"}
	]
}
"""

key_schema_str = """
{
   "namespace": "ATM_TRANSACTION",
   "name": "key",
   "type": "record",
   "fields" : [
     {
       "name" : "transaction_id",
       "type" : "string"
     }
   ]
}
"""

value_schema = avro.loads(value_schema_str)
key_schema = avro.loads(key_schema_str)

avroProducer  = AvroProducer(conf, default_key_schema=key_schema, default_value_schema=value_schema)

proc = subprocess.Popen(["nc -luv 6900"], shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

while True:
  response = proc.stdout.readline()
  jsonString = str(response, 'utf-8')
  print(jsonString)
  if jsonString != '':
        
    value = json.loads(jsonString)
    key = {"transaction_id": value['transaction_id']}
    try:
        avroProducer.produce(topic='ATM_TRANSACTION', value=value, key=key)
        print(f"Produced record to topic {value}")
    except Exception as e:
        print(f"Exception while producing record value - {value} to topic - 'ATM_TRANSACTION': {e}")
    else:
        print(f"key - {key}")

    avroProducer.flush()

# Terminate process
proc.terminate()