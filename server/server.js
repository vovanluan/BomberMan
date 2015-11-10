var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

app.use(express.static('client'));

app.get('/', function(req, res){
  //res.sendFile(__dirname + '/index.html');
  res.sendFile(__dirname + '/client/index.html');
});

io.on('connection',function(socket){
	console.log('a user connected');
	socket.on('update', function(msg){
	    console.log('message: ' + msg);
	    io.emit("notify",msg);
  	});
	socket.on('disconnect',function () {
		console.log("user disconnect");
	})
})

http.listen(3001, function(){
  console.log('listening on *:3001');
});