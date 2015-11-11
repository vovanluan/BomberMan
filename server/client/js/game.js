// Create Phaser.Game object
var game = new Phaser.Game(1000, 600, Phaser.CANVAS, 'BomberMan');

var room = "room1";
socket = io("localhost:3001");
// Add states
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('howToPlay', howToPlayState);
game.state.add('chooseMode', chooseModeState);
game.state.add('chooseRoom',chooseRoomState);
game.state.add('playOnline', playOnlineState);
game.state.add('playAgainstBot', playAgainstBotState);
game.state.add('finish', finishState);

// Start the load state
game.state.start('load');