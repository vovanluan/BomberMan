var chooseRoomState = {
	create: function () {
		var sprite = game.add.sprite(0 , -50, 'chooseRoomBackground');
		sprite.scale.setTo(0.59, 0.59);
		//need change button 
		game.add.button(400, 200, 'room1', this.room1, this);
		game.add.button(400, 300, 'room2', this.room2, this);
		
	},
	room1:function () {
		room = "room1";
		socket.emit("start game on server");
		socket.on("start game on client", this.startGame);
	},
	room2: function(){
		room = "room2";
		socket.emit("start game on server");
		socket.on("start game on client", this.startGame);
	}, 
	startGame: function (data) {
		game.state.start('playOnline', true, false,  data.players);
	}
}
