from flask import Flask, jsonify
from celery import Celery

flask_app = Flask(__name__)
celery_app = Celery('app', broker='amqp://admin:admin@rabbitmq:5672', backend='rpc://')


@flask_app.route('/')
def index():
    return jsonify({"MESSAGE": 'Start a job: /start-job/<x>'})


@flask_app.route('/start-job/<x>')
def start(x):
    flask_app.logger.info("Invoking Method")
    result = celery_app.send_task('app.longtime_add', kwargs={'image_path': ""})#.delay()
    flask_app.logger.info(result.backend)
    return jsonify({"id": result.id})
    """connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
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
    return " [x] Sent: %s" % body"""

@flask_app.route('/status/<job_id>')
def status(job_id):
    result = celery_app.AsyncResult(job_id, app=celery_app)
    print("Invoking Method ")
    return jsonify({"status": str(result.state)})

@flask_app.route('/result/<job_id>')
def task_result(job_id):
    result = celery_app.AsyncResult(job_id).result
    return jsonify({"result": str(result)})


if __name__ == '__main__':
    flask_app.run(debug=True, host='0.0.0.0')
