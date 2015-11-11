var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

app.use(express.static('client'));

app.get('/', function(req, res){
  //res.sendFile(__dirname + '/index.html');
  res.sendFile(__dirname + '/client/index.html');
});
countPlayer = 0;
data1 = {id: 1, pos:{x:40,y: 40}};
data2 = {id: 2, pos:{x:120,y: 40}};
io.on('connection',function(socket){
	console.log('a user connected');
	socket.on('requestjoinRoom1', function(msg){
		countPlayer++;
			console.log("Here");
		if (countPlayer == 2) {
			socket.emit("pendingGame", data2);
			io.emit("startGame", {data1:data1, data2:data2});
			socket.emit("startGame", {data1:data1, data2:data2});
		}
		else {

			socket.emit("pendingGame", data1);
		}
  	});
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