var chooseRoomState = {
	create: function () {
		//need change button 
		game.add.button(400, 200, 'startGame', this.room1, this);
		game.add.button(390, 300, 'howToPlay', this.room2, this);
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
