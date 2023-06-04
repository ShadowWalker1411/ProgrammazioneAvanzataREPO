#FROM ubuntu:18.04

#RUN apt-get update -y && \
#    apt-get install -y python3-pip python3-dev && \
#    pip3 install setuptools wheel pip --upgrade

#COPY ./requirements.txt /app/requirements.txt

#WORKDIR /app

#RUN pip3 install pika && \
#    pip3 install -r requirements.txt

#COPY . /app

#ENV FLASK_ENV=development

#ENTRYPOINT [ "python3" ]

#CMD [ "app.py" ]

FROM node:14

EXPOSE 3001

RUN npm install i npm@latest -g

WORKDIR /src

COPY ../package.json ../package*.json ./

# RUN npm install -g express pg sequelize jsonwebtoken bcrypt joi

RUN npm install

COPY . .

CMD ["node", "index.js"]