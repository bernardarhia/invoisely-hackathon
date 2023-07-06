## INVOISELY-HACKATHON
This contains api for communicating with our nodejs server;
It uses expressjs, typescript and mongodb

## Installation
Before installing the project, make sure you have the following installed on your machine

* [Nodejs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)  ^14
* [Mongodb](https://www.mongodb.com/docs/manual/installation/)


## Folder Structure
Folder  | Description
------------- | -------------
.gihub | Contains workflow script for running tests
constants  | Contains constant variables that the api uses
controllers  | This folder has the functionality and controls the api behaviour
core  | All app base setup can be found here. It has database connection, Job configurations and server configurations
helpers  | All helper functions for base app is here
interfaces  | Almost all interfaces for the app variables and services are here
middleware  | This folder contains the middleware for security and authentication
database  | Database schemas and hooks are here
services  | Database manipulation can be found here
tests  | All tests files are here
utils  | Contains utility functions

## Instructions

- cd into your root directory and run

```bash
npm install
```
## setting up mongodb
download mongodb compass from the mongodb official site [Download](https://www.mongodb.com/docs/manual/installation/)


## Starting the app
```bash
 npm run build-api
 ```
This command builds the app from typescript into javascript

```
 npm run start-api
```
This command starts the app

## Starting the app documentation

- npm run build-docs

This builds the api documentation into a docs folder in the root directory, view the html file in the docs folder to preview docs. 
You can also install [LIve Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) if you're running the app in vscode to serve the docs live


## Running test
```
 npm run test
```
This command allows you to run the tests that comes along the api.

Read more about the test here [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/)


For more information on nodejs,  visit the [Nodejs documentation](https://nodejs.org/en/docs).