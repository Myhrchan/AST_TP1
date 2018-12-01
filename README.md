
# Asynchronous Server Technologies TP by Mariane CHAMPALIER

![Build status](https://travis-ci.org/Myhrchan/AST_TP1.svg?branch=master)

## Introduction
This website is a basic javascript site working with Node.js.
It stores couples key-value in a local database with a timestamp.


## Installation
Run the `server.ts` script on node.js (with the instruction `node server.ts`, or `nps nodemon` if ou want it to automatically refresh on update), then connect to you localhost on port 8080 : `http://localhost:8080/`

## Usage
You can do GET, POST or DELETE requests on the database.
For GET and DELETE requests, connect to the url : `http://localhost:8080/metrics/yourKey` and replace yourKey with the key you want to register. 
For POST request, add a json in the body of the request with the following shape:
[
  { "timestamp":your timestamp, "value":your value }
]


/login
/logout
/signup
/metrics/:id
/user/:id