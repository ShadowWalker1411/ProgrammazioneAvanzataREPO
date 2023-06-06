FROM ubuntu:18.04

RUN apt-get update -y && \
    apt-get install -y python3-pip python3-dev && \
    pip3 install setuptools wheel pip --upgrade

COPY ./requirements.txt /requirements.txt

RUN pip3 install pika && \
    pip3 install -r requirements.txt

COPY . .

ENV FLASK_ENV=development

ENTRYPOINT [ "python3" ]

CMD [ "app.py" ]