# PixelHub

PixelHub è un hub di modelli e dataset per la computer vision, che offre risorse per lo sviluppo e l'implementazione di algoritmi e applicazioni visive avanzate.

## Indice
- [Obiettivo](#obiettivo)
- [Progettazione](#progettazione)
  - [Diagrammi UML](#diagrammi-uml)
  - [Descrizione dei Pattern](#descrizione-dei-pattern)
- [Avvio del Progetto](#avvio-del-progetto)
  - [Utilizzo di Docker Compose](#utilizzo-di-docker-compose)
  - [Test del Progetto](#test-del-progetto)

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
- MVC(Model-View-Controller) 
- Pattern 


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

Questo comando avvierà i servizi specificati nel Docker Compose, compreso il server RabbitMQ, l'applicazione Flask, il server Node e PostgreSQL.

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

1. Creare un utente, sfruttando la funzione Create User, come descritto successivamente nella [Documentazione](#Documentazione dell'API).

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
    "name": "Cats",
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
    "name": "Cats",
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