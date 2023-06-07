FROM ubuntu:18.04
#FROM python:3.9

RUN apt-get update -y &&\
    apt update -y && apt upgrade -y &&\
    apt install -y python3.10 &&\
    # apt-get install -y python3.6 &&\
    apt-get install -y python3-pip python3-dev

COPY ./requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip3 install --upgrade pip && \
    pip3 install pika && \
    pip3 install -r requirements.txt

WORKDIR /app

COPY . /app

ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

CMD celery -A app worker -l info

# COPY . .

# CMD ["python", "-u", "app.py"]