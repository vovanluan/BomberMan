var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

app.use(express.static('client'));

app.get('/', function(req, res){

  res.sendFile(__dirname + '/client/index.html');
});

// <<<<<<< HEAD
// app.get('/test', function(req, res){
//   res.sendFile(__dirname + '/index.html');
//   //res.sendFile(__dirname + '/client/index.html');
// });
// =======
countPlayer = 0;
data1 = {id: 1, pos:{x:1,y: 1}};
data2 = {id: 2, pos:{x:3,y: 1}};


io.on('connection',function(socket){
	console.log('a user connected');
	socket.on('requestjoinRoom1', function(msg){
		countPlayer++;
		if (countPlayer == 2) {
			socket.emit("pendingGame", data2);
			io.emit("startGame", {data1:data1, data2:data2});
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
		countPlayer--;
	});

	socket.on('player_move', function(data) {
		io.emit('server_player_move', data);
	});

	socket.on('bomb', function(data) {
		io.emit('server_bomb', data);
	});

	socket.on('request_random_number', function(rand_number) {
		io.emit('response_random_number', rand_number);
	});
	
})

http.listen(3001, function(){
  console.log('listening on *:3001');
});




//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
