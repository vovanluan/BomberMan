var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

app.use(express.static('client'));

app.get('/', function(req, res){
  //res.sendFile(__dirname + '/index.html');
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/test', function(req, res){
  res.sendFile(__dirname + '/index.html');
  //res.sendFile(__dirname + '/client/index.html');
});

io.on('connection',function(socket){
	console.log('a user connected');

	//handle push from room1 player
	socket.on('updateRoom1', function(msg){
	    console.log('messageRoom1: ' + msg);
	    io.emit("notifyRoom1",msg);
  	});

  	//handle push from room2 player
  	socket.on('updateRoom2', function(msg){
	    console.log('messageRoom2: ' + msg);
	    io.emit("notifyRoom2",msg);
  	});

  	//handle disconnect
	socket.on('disconnect',function () {
		console.log("user disconnect");
	})
})

http.listen(3001, function(){
  console.log('listening on *:3001');
});