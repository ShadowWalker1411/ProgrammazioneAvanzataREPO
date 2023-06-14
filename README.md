# PixelHub

PixelHub è un hub di modelli e dataset per la computer vision, che offre risorse per lo sviluppo e l'implementazione di algoritmi e applicazioni visive avanzate.

## Indice

- [Obiettivo](#obiettivo)
- [Progettazione](#progettazione)
  - [Diagrammi UML](#diagrammi-uml)
  - [Descrizione dei Pattern](#descrizione-dei-pattern)
- [Avvio del Progetto](#avvio-del-progetto)
  - [Utilizzo di Docker Compose](#utilizzo-di-docker-compose)
  - [Importazione delle Rotte da Postman](#importazione-delle-rotte-da-postman)
  - [Utilizzo ottimale del Sistema](#utilizzo-ottimale-del-sistema)
- [Documentazione Delle API](#documentazione-dellapi)

## Obiettivo

L'obiettivo di questo progetto consiste nello sviluppo del backend di un portale che offre funzionalità avanzate per la gestione e l'elaborazione di dataset e modelli neurali. Il portale è accessibile agli utenti registrati e consente loro di caricare i propri dataset, che possono includere un insieme di dati come immagini o video. Inoltre, gli utenti possono anche caricare i propri modelli neurali, che rappresentano reti neurali pre-addestrate.

Una volta caricati i dataset e i modelli, il sistema offre la possibilità di effettuare inferenze su di essi. Questo processo di inferenza può richiedere un tempo di elaborazione maggiore rispetto alle richieste standard, poiché comporta l'applicazione dei modelli neurali ai dati presenti nei dataset.

L'obiettivo è quindi fornire un ambiente sicuro e scalabile in cui gli utenti possano gestire i propri dataset e modelli, eseguire inferenze e monitorare i task che richiedono tempi di elaborazione più lunghi. Si presta particolare attenzione all'ottimizzazione delle prestazioni e all'efficienza dell'elaborazione, al fine di garantire un'esperienza fluida e responsiva agli utenti durante l'utilizzo del portale.

Il risultato finale è un backend funzionale, affidabile e scalabile che consente agli utenti registrati di gestire i propri dataset e modelli neurali, eseguire inferenze e monitorare i task di elaborazione più complessi, fornendo al contempo una piattaforma sicura e performante per le operazioni di elaborazione dei dati.

## Progettazione
### Diagrammi

In questa sezione sono presenti i diagrammi UML che illustrano la progettazione del progetto.

#### Diagramma dei Casi d'Uso

Come possiamo vedere dalla foto sottostante, abbiamo rappresentato, i casi d'uso e quindi le funzionalità a cui le tipologie di utente potranno accedere. ![Diagramma dei casi d'uso](./images/UseCase/UseCase.png)

#### Diagrammi delle Sequenze

Con i diagrammi delle sequenze, siamo andati a rappresentare, come l'utente muovendosi su una singola rotta, vada in realtà ad azionare vari meccanismi sottostanti, possiamo vederne alcuni esempi nelle foto sottostanti


**Sequence Diagram per la creazione di un utente con privilegi di Amministratore**
![Sequence Diagram per la creazione di un utente con privilegi di Amministratore](./images/Sequence/CreateUserAdmin.png)


**Sequence Diagram per l'aggiunta da parte di un amministratori di crediti ad un determinato utente**
![Sequence Diagram per l'aggiunta da parte di un amministratori di crediti ad un determinato utente](./images/Sequence/AddCredits.png)


**Sequence Diagram per l'aggiunta di file da una zip**
![Sequence Diagram per l'aggiunta di file da una zip](./images/Sequence/UploadImageFromZip.png)


**Sequence Diagram per svolgere un'inferenza di un'immagine su un modello**
![Sequence Diagram per svolgere un'inferenza di un'immagine su un modello](./images/Sequence/InferenceModel.png)
e i restanti nella cartella [Diagrammi](./images/Sequence)

#### Diagramma delle classi

Nell'immagine sottostante, abbiamo rappresentato le classi che abbiamo utilizzato nel progetto.
![Diagramma delle classi](./images/Class/Class.png)

### Descrizione dei Pattern

Il progetto utilizza diversi pattern di progettazione per ottenere un'elaborazione in background efficiente e scalabile. Vengono utilizzati i seguenti pattern:
- MVVM(Model-View-ViewModel) 
- DAO 
- Chain Of Responsibility
- Message Queue

#### MVVM(Model-View-ViewModel)

Il Model-View-ViewModel (MVVM) è un pattern architetturale utilizzato nel design del software per separare la logica di presentazione dall'implementazione dei dati sottostanti.

Abbiamo adattato il pattern Model-View-ViewModel (MVVM) per gestire l'organizzazione del codice e la separazione delle responsabilità. Utilizzando Express, abbiamo esposto le rotte tramite URL, consentendo l'interazione con l'applicazione attraverso strumenti come Postman.

Il controller agisce come il ViewModel nel contesto di MVVM. È responsabile di elaborare la richiesta ricevuta, interagire con i modelli di dati pertinenti e preparare i dati per la risposta. Il controller può richiamare metodi nel modello di dati per accedere, manipolare o recuperare informazioni dal database PostgreSQL.

La separazione tra controller e modello consente di gestire in modo modulare la logica di business e di mantenere un codice pulito e ben strutturato. In questo modo, è possibile riutilizzare i modelli di dati in diverse parti dell'applicazione, facilitando la manutenzione e il testing.

#### DAO

Abbiamo implementato il pattern architetturale DAO (Data Access Object) utilizzando Sequelize come ORM (Object-Relational Mapping) con Postgres nel nostro progetto. Sequelize semplifica la comunicazione con il database e ci permette di definire modelli di dati in modo intuitivo. Sequelize crea automaticamente DAO per ogni entità del nostro sistema, come User, Model e Dataset. 

Ogni DAO offre metodi per eseguire operazioni CRUD (Create, Read, Update, Delete) sul database utilizzando le funzionalità fornite da Sequelize. Questa implementazione ci consente di separare la logica di accesso ai dati dal resto del codice, garantendo una maggiore modularità e facilitando la manutenzione del sistema.

#### Chain Of Responsibility

Abbiamo implementato il pattern Chain of Responsibility nel nostro server utilizzando i middlewares "checkAuth", "checkOwner" e "checkAdmin". Ogni middleware svolge un ruolo specifico nel processo di elaborazione delle richieste. 

In particolare, "checkAuth" si occupa di verificare l'autenticazione degli utenti, "checkOwner" si assicura che gli utenti siano i proprietari delle risorse richieste e "checkAdmin" verifica i privilegi di amministrazione. 

Abbiamo organizzato questi middlewares in una catena sequenziale, consentendo una gestione flessibile e modulare delle richieste. Grazie a questa implementazione, il nostro server garantisce la sicurezza, l'accesso appropriato alle risorse e una struttura di codice altamente scalabile e manutenibile.

#### Message Queue

Abbiamo utilizzato il pattern architetturale Message Queue per implementare un sistema distribuito composto da un producer (produttore) e un worker (lavoratore). La comunicazione asincrona tra il producer e i worker è gestita utilizzando RabbitMQ come sistema di messaggistica e Celery come framework per la gestione delle code dei job.

Il producer è responsabile di generare i job o le attività da eseguire. Questi job vengono incapsulati in messaggi e inviati a una coda specifica all'interno di RabbitMQ utilizzando il protocollo AMQP (Advanced Message Queuing Protocol). Il producer non deve attendere una risposta immediata dai worker, ma può continuare a generare e inviare ulteriori job.

I worker, d'altra parte, sono i destinatari dei messaggi contenenti i job. Essi sono costantemente in ascolto delle code di RabbitMQ per prelevare i messaggi pendenti. Quando un messaggio contenente un job viene ricevuto, il worker lo estrae dalla coda, lo elabora e produce il risultato desiderato. Una volta completato il job, il worker può inviare eventuali risultati o informazioni di stato ad altre code o sistemi, se necessario.

## Avvio del Progetto
Per eseguire il progetto, è possibile utilizzare Docker Compose per configurare facilmente i servizi necessari.

### Utilizzo di Docker Compose

1. Installa Docker e Docker Compose, se non l'hai già fatto.

2. Clona questo repository sul tuo computer locale.

3. Apri un terminale e naviga fino alla directory del progetto.

4. Esegui il seguente comando per avviare i servizi:

```bash
docker-compose up --build
```

Questo comando avvierà i servizi specificati nel Docker Compose, compreso il server RabbitMQ, l'applicazione Flask, il server Node e PostgreSQL. Se durante il primo avvio dovessero esserci dei problemi, riprovare con lo stesso comendo.

5. L'applicazione sarà accessibile all'indirizzo `http://localhost:3001`.

### Importazione delle Rotte da Postman

Se desideri utilizzare le rotte definite in Postman nel tuo progetto, puoi seguire i seguenti passaggi:

1. Assicurati di avere Postman installato sul tuo sistema. Puoi scaricarlo da https://www.postman.com/downloads/.

2. Scarica il file di collezione delle API dal repository. Puoi trovarlo nella cartella "postman".

3. Apri Postman e fai clic sul pulsante "Import" nell'angolo in alto a sinistra.

4. Seleziona l'opzione "Import From File" e carica il file di collezione delle API scaricato.

5. Una volta importato il file, dovresti vedere tutte le rotte e le relative configurazioni in Postman.

6. Puoi testare le rotte direttamente in Postman per confermarne il funzionamento.

## Utilizzo ottimale del Sistema

Per sfruttare a dovere le potenzialità del sistema, è in necessario:

1. Creare un utente, sfruttando la funzione Create User, come descritto successivamente nella [Documentazione](#documentazione-dellapi).

2. Creare un utente con privilegi da amministratore, usando la funzione Create User Admin.

3. Effettuare l'accesso, attraverso la Login e copiare e incollare il token restituito nelle variabili d'ambiente globali.

4. Proseguire ad utilizzare il sistema, chiamando le rotte predefinite importate precedentemente in Postman.

## Documentazione dell'API

**Get All Users**

Route: 
```bash
GET /users/
```

Authorization: 
```bash
Bearer {token}
```

Response: 
```json
[
    {
        "uid": 4,
        "username": "massiadmin",
        "email": "massimilianopiccinini.9@gmail.com",
        "password": "$2b$08$7jZoYiVPwF8hMjlS.LOHnOTCo9VZ5Wj1ymy1etTQIEQBEFqz0mWEy",
        "credits": 4948.5,
        "admin": true,
        "createdAt": "2023-06-05T22:41:31.376Z",
        "updatedAt": "2023-06-12T20:21:05.836Z"
    },
    {
        "uid": 6,
        "username": "massi2",
        "email": "massimilianopiccinini.8@gmail.com",
        "password": "$2b$08$uux.MPk1QAgJ8UXgG7vuqex6l2sH.rSvnP/diZyDlarMt9.M0vtrK",
        "credits": 5000,
        "admin": false,
        "createdAt": "2023-06-12T16:36:16.059Z",
        "updatedAt": "2023-06-12T16:36:16.059Z"
    }
]
```

**Get User**

Route:
```bash
GET /users/{id}
```

Authorization: 
```bash
Bearer {token}
```

Response: 
```json
{
    "uid": 4,
    "username": "massiadmin",
    "email": "massimilianopiccinini.9@gmail.com",
    "password": "$2b$08$7jZoYiVPwF8hMjlS.LOHnOTCo9VZ5Wj1ymy1etTQIEQBEFqz0mWEy",
    "credits": 4948.5,
    "admin": true,
    "createdAt": "2023-06-05T22:41:31.376Z",
    "updatedAt": "2023-06-12T20:21:05.836Z"
}
```

**Create User**

Route: 
```bash
POST /users/
```

Authorization: 
```bash
Bearer {token}
```

Body: 
```json
{
    "username": "massi2",
    "email": "massimilianopiccinini.8@gmail.com",
    "password": "password"
}
```

Response: 
```json
{
    "credits": 5000,
    "uid": 10,
    "username": "massi3",
    "email": "massimilianopiccinini.12@gmail.com",
    "password": "$2b$08$tW.1DTHRpUoIMYts4lsoEeOlMzIfwnHvFBGQG.pEihHyRwagFcIWW",
    "admin": false,
    "updatedAt": "2023-06-13T17:35:47.712Z",
    "createdAt": "2023-06-13T17:35:47.712Z"
}
```

**Update User**

Route: 
```bash
PUT /users/{id}
```

Authorization: 
```bash
Bearer {token}
```

Body: 
```json
{
    "username": "massi2",
    "email": "massimilianopiccinini.8@gmail.com",
}
```

Response: 
```json
{
    "credits": 5000,
    "uid": 10,
    "username": "massi2",
    "email": "massimilianopiccinini.8@gmail.com",
    "password": "$2b$08$tW.1DTHRpUoIMYts4lsoEeOlMzIfwnHvFBGQG.pEihHyRwagFcIWW",
    "admin": false,
    "updatedAt": "2023-06-13T17:35:47.712Z",
    "createdAt": "2023-06-13T17:35:47.712Z"
}
```

**Delete User**

Route:
```bash
DELETE /users/{id}
```

Authorization: 
```bash
Bearer {token}
```


Response: 
```json
{
    "uid": 4,
    "username": "massiadmin",
    "email": "massimilianopiccinini.9@gmail.com",
    "password": "$2b$08$7jZoYiVPwF8hMjlS.LOHnOTCo9VZ5Wj1ymy1etTQIEQBEFqz0mWEy",
    "credits": 4948.5,
    "admin": true,
    "createdAt": "2023-06-05T22:41:31.376Z",
    "updatedAt": "2023-06-12T20:21:05.836Z"
}
```

**Login**

Route:
```bash
POST /users/login
```

Body: 
```json
{
    "username": "massi2",
    "password": "massiadmin",
}
```

Response: 
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjg2Njg0NDU3LCJleHAiOjE2ODY2ODgwNTd9.gwaG0u5maHO49BtaUih1OynNBW9yfsKSBIONQfvCOpM"
}
```

**Get Credits**

Route:
```bash
GET /users/credits/mine
```

Authorization: 
```bash
Bearer {token}
```

Response: 
```json
{
    "credits": 4948.5
}
```

**Add Credits**

Route:
```bash
POST /users/credits/{email}
```

Authorization: 
```bash
Bearer {token}
```

Body: 
```json
{
    "credits": 50
}
```

Response: 
```json
{
    "message": "Success"
}
```


**Get All Models**

Route: 
```bash
GET /models/all
```

Authorization: 
```bash
Bearer {token}
```

Response: 
```json
[
    {
        "uid": 1,
        "name": "Faces",
        "datasetUID": 3,
        "userUID": 5,
        "createdAt": "2023-06-06T08:11:31.048Z",
        "updatedAt": "2023-06-06T08:11:31.048Z"
    },
    {
        "uid": 3,
        "name": "Bodies",
        "datasetUID": 3,
        "userUID": 4,
        "createdAt": "2023-06-08T19:58:55.891Z",
        "updatedAt": "2023-06-08T19:58:55.891Z"
    },
    {
        "uid": 5,
        "name": "Dogs",
        "datasetUID": 4,
        "userUID": 4,
        "createdAt": "2023-06-12T21:27:12.698Z",
        "updatedAt": "2023-06-12T21:27:12.698Z"
    }
]
```

**Get Mine Models**

Route: 
```bash
GET /models/
```

Authorization: 
```bash
Bearer {token}
```

Response: 
```json
[
    {
        "uid": 3,
        "name": "Bodies",
        "datasetUID": 3,
        "userUID": 4,
        "createdAt": "2023-06-08T19:58:55.891Z",
        "updatedAt": "2023-06-08T19:58:55.891Z"
    },
    {
        "uid": 5,
        "name": "Dogs",
        "datasetUID": 4,
        "userUID": 4,
        "createdAt": "2023-06-12T21:27:12.698Z",
        "updatedAt": "2023-06-12T21:27:12.698Z"
    }
]
```

**Get Model**

Route:
```bash
GET /models/{id}
```

Authorization: 
```bash
Bearer {token}
```

Response: 
```json
{
    "uid": 3,
    "name": "Bodies",
    "datasetUID": 3,
    "userUID": 4,
    "createdAt": "2023-06-08T19:58:55.891Z",
    "updatedAt": "2023-06-08T19:58:55.891Z"
}
```

**Create User**

Route: 
```bash
POST /models/
```

Authorization: 
```bash
Bearer {token}
```

Body: 
```json
{
    "name": "Cats",
    "datasetUID": 4
}
```

Response: 
```json
{
    "uid": 6,
    "name": "Cats",
    "datasetUID": 4,
    "userUID": 4,
    "updatedAt": "2023-06-13T19:34:25.913Z",
    "createdAt": "2023-06-13T19:34:25.913Z"
}
```

**Update User**

Route: 
```bash
PUT /models/{id}
```

Authorization: 
```bash
Bearer {token}
```

Body: 
```json
{
    "name": "Tigers",
    "datasetUID": 4
}
```

Response: 
```json
{
    "uid": 6,
    "name": "Tigers",
    "datasetUID": 4,
    "userUID": 4,
    "updatedAt": "2023-06-13T19:34:25.913Z",
    "createdAt": "2023-06-13T19:34:25.913Z"
}
```

**Delete User**

Route:
```bash
DELETE /models/{id}
```

Authorization: 
```bash
Bearer {token}
```


Response: 
```json
{
    "uid": 6,
    "name": "Tigers",
    "datasetUID": 4,
    "userUID": 4,
    "updatedAt": "2023-06-13T19:34:25.913Z",
    "createdAt": "2023-06-13T19:34:25.913Z"
}
```

**Add Model File**

Route: 
```bash
POST /models/image/{id}
```

Authorization: 
```bash
Bearer {token}
```

Body: 
```json
{
    "file": "model.py"
}
```

Response: 
```json
{
    "message": "Upload completed successfully"
}
```

**Model Inference Request**

Route: 
```bash
GET /models/inference/{id}
```

Authorization: 
```bash
Bearer {token}
```

Response: 
```json
{
    "model": {
        "uid": 5,
        "name": "Dogs",
        "datasetUID": 4,
        "userUID": 4,
        "createdAt": "2023-06-12T21:27:12.698Z",
        "updatedAt": "2023-06-12T21:27:12.698Z"
    },
    "dataset": {
        "uid": 4,
        "name": "Bodies",
        "tags": 4,
        "numClasses": 12,
        "userUID": 4,
        "createdAt": "2023-06-12T21:25:34.431Z",
        "updatedAt": "2023-06-12T21:26:19.128Z"
    },
    "message": "Inference request sent successfully",
    "job_id": "34fed117-f221-499a-8e0b-44dc37cf018b"
}
```

**Model Inference Status**

Route: 
```bash
GET /models/status/{job_id}
```

Authorization: 
```bash
Bearer {token}
```

Response: 
```json
{
    "status": "SUCCESS",
    "job_id": "34fed117-f221-499a-8e0b-44dc37cf018b"
}
```

**Model Inference Result**

Route: 
```bash
GET /models/result/{job_id}
```

Authorization: 
```bash
Bearer {token}
```

Response: 
```json
{
    "result": [
        [249, 267], [249, 285], [249, 309],
        [],
        [],
        [],
        [334, 326], [321, 326], [309, 325]
    ],
    "job_id": "34fed117-f221-499a-8e0b-44dc37cf018b"
}
```

**Get Datasets**

Route: 
```bash
GET /datasets/all
```

Authorization: 
```bash
Bearer {token}
```

Response: 
```json
[
    {
        "uid": 1,
        "name": "Face",
        "tags": 4,
        "numClasses": 3,
        "userUID": 1,
        "createdAt": "2023-06-13T20:34:18.489Z",
        "updatedAt": "2023-06-13T20:34:18.489Z"
    },
    {
        "uid": 2,
        "name": "Prova1",
        "tags": 5,
        "numClasses": 2,
        "userUID": 1,
        "createdAt": "2023-06-13T20:34:27.991Z",
        "updatedAt": "2023-06-13T20:34:27.991Z"
    },
    {
        "uid": 3,
        "name": "Prova2",
        "tags": 1,
        "numClasses": 9,
        "userUID": 1,
        "createdAt": "2023-06-13T20:34:46.635Z",
        "updatedAt": "2023-06-13T20:34:46.635Z"
    }
]
```

**Get Mine Datasets**

Route: 
```bash
GET /datasets/
```

Authorization: 
```bash
Bearer {token}
```

Response: 
```json
[
    {
        "uid": 1,
        "name": "Face",
        "tags": 4,
        "numClasses": 3,
        "userUID": 1,
        "createdAt": "2023-06-13T20:34:18.489Z",
        "updatedAt": "2023-06-13T20:34:18.489Z"
    },
    {
        "uid": 2,
        "name": "Prova1",
        "tags": 5,
        "numClasses": 2,
        "userUID": 1,
        "createdAt": "2023-06-13T20:34:27.991Z",
        "updatedAt": "2023-06-13T20:34:27.991Z"
    }
]
```

**Get Dataset**

Route:
```bash
GET /datasets/{id}
```

Authorization: 
```bash
Bearer {token}
```

Response: 
```json
{
    "uid": 3,
    "name": "Prova2",
    "tags": 1,
    "numClasses": 9,
    "userUID": 1,
    "updatedAt": "2023-06-13T20:34:46.635Z",
    "createdAt": "2023-06-13T20:34:46.635Z"
}
```


**Create Dataset**

Route: 
```bash
POST /datasets/
```

Authorization: 
```bash
Bearer {token}
```

Body: 
```json
{
    "name": "Prova2",
    "tags": 1,
    "numClasses": 9
}
```

Response: 
```json
{
    "uid": 3,
    "name": "Prova2",
    "tags": 1,
    "numClasses": 9,
    "userUID": 1,
    "updatedAt": "2023-06-13T20:34:46.635Z",
    "createdAt": "2023-06-13T20:34:46.635Z"
}
```

**Update Dataset**

Route: 
```bash
PUT /datasets/{id}
```

Authorization: 
```bash
Bearer {token}
```

Body: 
```json
{
    "name": "Prova2",
    "tags": 10,
    "numClasses": 10
}
```

Response: 
```json
{
    "uid": 3,
    "name": "Prova2",
    "tags": 10,
    "numClasses": 10,
    "userUID": 1,
    "createdAt": "2023-06-13T20:34:46.635Z",
    "updatedAt": "2023-06-14T07:50:01.347Z"
}
```

**Delete Dataset**

Route:
```bash
DELETE /datasets/{id}
```

Authorization: 
```bash
Bearer {token}
```


Response: 
```json
{
    "uid": 3,
    "name": "Prova2",
    "tags": 10,
    "numClasses": 10,
    "userUID": 1,
    "createdAt": "2023-06-13T20:34:46.635Z",
    "updatedAt": "2023-06-14T07:50:01.347Z"
}
```

**Add Dataset Image**

Route: 
```bash
POST /datasets/image/{id}
```

Authorization: 
```bash
Bearer {token}
```

Body: 
```json
{
    "file": "image.png"
}
```

Response: 
```json
{
    "message": "Upload completed successfully"
}
```

**Add Dataset Images**

Route: 
```bash
POST /datasets/images/{id}
```

Authorization: 
```bash
Bearer {token}
```

Body: 
```json
{
    "files": "image.png",
    "files": "image1.png",
    "files": "image2.png"
}
```

Response: 
```json
{
    "message": "Upload completed successfully"
}
```

**Add Dataset Zip**

Route: 
```bash
POST /datasets/zip/{id}
```

Authorization: 
```bash
Bearer {token}
```

Body: 
```json
{
    "file": "test.zip"
}
```

Response: 
```json
{
    "message": "Upload completed successfully"
}
```