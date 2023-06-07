from celery import Celery
from celery.utils.log import get_task_logger
import face_alignment
import cv2

logger = get_task_logger(__name__)

celery_app = Celery('app', broker='amqp://admin:admin@rabbitmq:5672', backend='rpc://')

@celery_app.task()
def longtime_add(image_path):
    logger.info('Got Request - Starting work ')
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    fa = face_alignment.FaceAlignment(face_alignment.LandmarksType._2D, device='cpu', face_detector='sfd')
    det = fa.get_landmarks_from_image(image)
    return det
    

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