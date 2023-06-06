import time
from celery import Celery
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)

celery_app = Celery('app', broker='amqp://admin:admin@rabbitmq:5672', backend='rpc://')

@celery_app.task()
def longtime_add(x, y):
    logger.info('Got Request - Starting work ')
    time.sleep(4)
    logger.info('Work Finished ')
    return x + y
    

"""import pika

def main():
    #params = pika.URLParameters('amqp://admin:admin@rabbitmq:5672') #TODO: replace with env variable
    #connection = pika.BlockingConnection(params)
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='amqp://admin:admin@rabbitmq:5672'))
    channel = connection.channel()
    channel = connection.channel()
    channel.queue_declare(queue='queue')

    def callback(ch, method, properties, body):
        print(" [x] Received %r" % body)
        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_consume(callback, queue='queue', no_ack=True)

    channel.start_consuming()

if __name__ == '__main__':
    main()
"""