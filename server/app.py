from flask import Flask
import pika
import time

app = Flask(__name__)


@app.route('/')
def index():
    return 'OK'


@app.route('/add-job')
def add():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()
    channel.queue_declare(queue='task_queue', durable=True)
    channel.basic_publish(
        exchange='',
        routing_key='task_queue',
        body="CIAO MAX"+ str(time.time()),
        properties=pika.BasicProperties(
            delivery_mode=2,  # make message persistent
        ))
    connection.close()
    body="CIAO MAX",

    return " [x] Sent: %s" % body


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
