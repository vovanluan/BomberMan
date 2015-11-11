var content = [
    "PRESS UP, DOWN LEFT, WRITE BUTTON TO MOVE",
    "PRESS SPACEBAR TO PLACE BOMB",
    "TRY TO KILL YOUR ENEMIES TO SAVE THE WORLD . . ."
];

var line = [];

var wordIndex = 0;
var lineIndex = 0;

var wordDelay = 200;
var lineDelay = 400;

function nextLine() {

    if (lineIndex === content.length)
    {
        //  We're finished
        return;
    }

    //  Split the current line on spaces, so one word per array element
    line = content[lineIndex].split(' ');

    //  Reset the word index to zero (the first word in the line)
    wordIndex = 0;

    //  Call the 'nextWord' function once for each word in the line (line.length)
    game.time.events.repeat(wordDelay, line.length, nextWord, this);

    //  Advance to the next line
    lineIndex++;

}

function nextWord() {

    //  Add the next word onto the text string, followed by a space
    text.text = text.text.concat(line[wordIndex] + " ");

    //  Advance the word index to the next word in the line
    wordIndex++;

    //  Last word?
    if (wordIndex === line.length)
    {
        //  Add a carriage return
        text.text = text.text.concat("\n");

        //  Get the next line after the lineDelay amount of ms has elapsed
        game.time.events.add(lineDelay, nextLine, this);
    }

}
var howToPlayState = {
	create: function() {
		wordIndex = 0;
		lineIndex = 0;
	    text = game.add.text(32, 100, '', { font: "35px Arial", fill: "#19de65" });
	    nextLine();
		game.add.text(300, game.world.height - 80, 'CLICK ANYWHERE TO GO BACK', {font: '25px Arial', fill: '#ffffff'});

	},
	update: function() {
		if (game.input.activePointer.leftButton.isDown) {
			game.state.start('menu');
		}
	},

};