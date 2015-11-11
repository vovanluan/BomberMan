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
		game.state.start('playOnline');
	},
	room2: function(){
		room = "room2";
		game.state.start('playOnline');
	}
}
