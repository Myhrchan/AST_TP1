
# Asynchronous Server Technologies Project by Mariane CHAMPALIER

![Build status](https://travis-ci.org/Myhrchan/AST_TP1.svg?branch=master)

## Introduction
This website is a basic javascript site working with Node.js.
It stores couples key-value in a local database with a timestamp.
It then prints the values in a graph according to the date.


## Installation
Run the `server.ts` script on node.js (with the instruction `node server.ts`, or `npx nodemon` if ou want it to automatically refresh on update), then connect to you localhost on port 8080 : `http://localhost:8080/`

## Usage
To create the database, run the command `npm run populate`.
You can then connect with one of the two users:
- username: mariane, password: m
- username: arthur, password: a

You can create your own account by doing a POST request at the url `http://localhost:8080/user` with the following information:
  { "username":your username, "email":your email ,"password": your password }
Or go on the address `http://localhost:8080/signup` in your browser and enter your information.
You will then need to login.

To access your metrics, go on the url : `http://localhost:8080`
To see them click on "Bring the metrics". 
To add a metric, click on "Add metrics".
To change a metric, click on "Update". You can only modify the value of the metric, you cannot change the key or timestamp.

You need to be logged in to access your metrics.