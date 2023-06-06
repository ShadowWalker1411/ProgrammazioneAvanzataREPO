FROM ubuntu:18.04
#FROM python:3

RUN apt-get update -y && \
   apt-get install -y python3-pip python3-dev

COPY ./requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip3 install pika && \
    pip3 install -r requirements.txt

WORKDIR /app

COPY . /app

ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

CMD celery -A app worker -l info

# COPY . .

# CMD ["python", "-u", "app.py"]