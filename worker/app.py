from celery import Celery
from celery.utils.log import get_task_logger
#import face_alignment
#import cv2

logger = get_task_logger(__name__)

celery_app = Celery('app', broker='amqp://admin:admin@rabbitmq:5672', backend='rpc://')

@celery_app.task()
def longtime_add():
    logger.info('Got Request - Starting work ')
    ''' image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    fa = face_alignment.FaceAlignment(face_alignment.LandmarksType._2D, device='cpu', face_detector='sfd')
    det = fa.get_landmarks_from_image(image)
    return det
'''
    return [[249., 267.],
        [249., 285.],
        [249., 309.],
        [252., 329.],
        [260., 348.],
        [270., 362.],
        [286., 374.],
        [300., 374.],
        [293., 325.],
        [345., 374.],
        [363., 373.],
        [377., 360.],
        [389., 344.],
        [396., 327.],
        [396., 306.],
        [396., 281.],
        [396., 262.],
        [267., 239.],
        [272., 227.],
        [284., 227.],
        [298., 227.],
        [310., 227.],
        [338., 227.],
        [347., 227.],
        [364., 227.],
        [375., 227.],
        [382., 234.],
        [324., 245.],
        [324., 255.],
        [322., 266.],
        [327., 276.],
        [309., 296.],
        [316., 296.],
        [324., 298.],
        [332., 299.],
        [339., 299.],
        [279., 255.],
        [287., 250.],
        [297., 250.],
        [304., 255.],
        [297., 259.],
        [287., 258.],
        [343., 254.],
        [351., 247.],
        [362., 247.],
        [369., 253.],
        [362., 257.],
        [351., 258.],
        [290., 325.],
        [302., 319.],
        [311., 315.],
        [322., 315.],
        [334., 314.],
        [343., 321.],
        [351., 328.],
        [341., 330.],
        [331., 333.],
        [320., 334.],
        [310., 332.],
        [301., 328.],
        [295., 323.],
        [309., 323.],
        [321., 325.],
        [334., 325.],
        [347., 327.],
        [334., 326.],
        [321., 326.],
        [309., 325.]]

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