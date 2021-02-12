## ExpressJs microservices + MongoDB + Docker Compose

Build two Express microservices that share the same data storage and have two endpoints:
1. POST: expects a CSV payload and saves the data to a MongoDB database
2. GET: reads data from the same database and serves JSON responses. Add Filters on the data as query parameters.

### Run the app inside docker

#### `docker-compose up --build`

It builds 4 images: 
- microservices-mongo-csv-importer_apifilters
- microservices-mongo-csv-importer_dataimporter 
- mongo
- node 
and 3 containers: 
- apifilters
- dataimporter 
- mongodb
The containers communicate with each other on a network named 'micro-app'.

### Run each microservice separately

```
npm run start
npm run dev
```

### Test API endpoints

1. CSV Importer

With a tool like *Postman*, make a POST request at http://localhost:5000/ 
(it suppose the input file name is 'emissions')

<kbd><img src="https://github.com/girls-incode/microservices-mongo-csv-importer/blob/master/express-microservice-csv-import-mongodb.jpg" alt="" /></kbd>
<br/><br/>

To see the mongodb data:
```shell
docker exec -it mongodb bash
mongo
show dbs
use vizuality
show collections

# try some filters
db.emissions.find({country:"CZE"}).pretty()
db.emissions.find({parent_sector: {$ne: ""} }).pretty()
db.emissions.aggregate([{
	$match: {
        country: "ABW",
        sector: "Total including LULUCF",
        emissions.year: 1850
    }
}])
```

2. API Filters

See all endpoints at http://localhost:4000/api-docs

<kbd><img src="https://github.com/girls-incode/microservices-mongo-csv-importer/blob/master/express-microservice-swagger-api.jpg" alt="" /></kbd>
<br/><br/>

Test urls:
- http://localhost:4000/api/v1/sectors
- http://localhost:4000/api/v1/countries
- http://localhost:4000/api/v1/countries/pol
- http://localhost:4000/api/v1/countries/arg/Total%20including%20LULUCF/2000

## Tech Stack

- [x] Node
- [x] Express
- [x] Cors
- [x] Morgan
- [x] Nodemon
- [x] Typescript
- [x] Mongoose
- [x] Multer
- [x] CSV-parser
- [x] Swagger-jsdoc
- [x] Swagger-ui-express

> In case that docker get stuck on windows, run:

```shell
wsl -l -v
wsl --unregister docker-desktop
```

#### Other docker commands

```shell
# start/stop docker
docker-compose down
docker-compose up -d

# last running containers
docker ps

# show all containers
docker ps -a

# stop containers
docker stop $(docker ps -a -q)
docker stop e8

# remove containers
docker rm $(docker ps -aq)

# list images
docker images -a

# remove image(s)
docker rmi -f 23
docker rmi $(docker images -aq)

# volumes
docker volume ls
docker volume rm $(docker volume ls -q)
```
