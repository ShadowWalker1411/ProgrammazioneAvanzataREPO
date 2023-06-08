# Background Processing with RabbitMQ, Python and Flask
A simple job worker that uses RabbitMQ for job management. Full doc and explanation [here](https://medium.com/@naveed125/background-processing-with-rabbitmq-python-and-flask-5ca62acf409c).

Questo repository contiene un semplice job worker che utilizza RabbitMQ per la gestione dei job. Lo scopo di questo progetto è mostrare come eseguire attività di elaborazione in background utilizzando RabbitMQ, Python e Flask.

## Indice
- [Obiettivo](#obiettivo)
- [Progettazione](#progettazione)
  - [Diagrammi UML](#diagrammi-uml)
  - [Descrizione dei Pattern](#descrizione-dei-pattern)
- [Avvio del Progetto](#avvio-del-progetto)
  - [Utilizzo di Docker Compose](#utilizzo-di-docker-compose)
  - [Test del Progetto](#test-del-progetto)

## Obiettivo
L'obiettivo di questo progetto è mostrare come implementare l'elaborazione in background utilizzando RabbitMQ, Python e Flask. Viene fornito un esempio di job worker in grado di gestire attività asincrone in modo efficiente.

## Progettazione
### Diagrammi UML
In questa sezione sono presenti i diagrammi UML che illustrano la progettazione del progetto. Si prega di fare riferimento alla cartella [Diagrammi UML](uml-diagrams/) per visualizzare i diagrammi.

### Descrizione dei Pattern
Il progetto utilizza diversi pattern di progettazione per ottenere un'elaborazione in background efficiente e scalabile. Vengono utilizzati i seguenti pattern:
- Pattern 
- Pattern 

Per informazioni dettagliate sui pattern di progettazione e sulle motivazioni alla base della loro scelta, fare riferimento alla cartella [Progettazione](design/).

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

Questo avvierà il server RabbitMQ e l'applicazione Flask.

5. L'applicazione sarà accessibile all'indirizzo `http://localhost:3001`.
