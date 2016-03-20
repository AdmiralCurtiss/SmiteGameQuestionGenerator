// sound pool names
var goodSoundPool = "Good";
var bigGoodSoundPool = "BigGood";
var finishSoundPool = "Finish";
var emptySoundPool = "Empty";

/* Square definitions */
/* Supported properties:
 * - text: text to display in the square when revealed
 * - sound: sound file to play when square revealed
 * - soundPool: sound pool name to play a random entry from when square revealed
 * - cssClass: CSS class name to set on the square
 */
var startSquare = { text: "" };
var goalSquare = { text: "%", soundPool: finishSoundPool, cssClass: "goal", isGoal: true };
var otherSquares = [
	newEmptySquare(),
	newEmptySquare(),
	newEmptySquare(),
	newEmptySquare(),
	newEmptySquare(),
	newEmptySquare(),
	newDummyPrizeSquare(),
	newDummyPrizeSquare(),
	newDummyPrizeSquare(),
	newSpecialPrizeSquare(),
	newBigPointsSquare(),
	newBigPointsSquare(),
	newSmallPointsSquare(),
	newSmallPointsSquare(),
	newSmallPointsSquare(),
	newSmallPointsSquare(),
	newMultipliedPointsSquare(),
	newMultipliedPointsSquare()
];

/* sound pools */
var soundPools = {};
soundPools[goodSoundPool] = [
	"sounds/Good1.ogg",
	"sounds/Good2.ogg",
	"sounds/Good3.ogg",
	"sounds/Good4.ogg",
	"sounds/Good5.ogg",
	"sounds/Good6.ogg",
	"sounds/Good7.ogg",
	"sounds/Good8.ogg",
	"sounds/Good9.ogg",
	"sounds/Good10.ogg",
	"sounds/Good11.ogg",
	"sounds/Good12.ogg",
	"sounds/Good13.ogg",
	"sounds/Good14.ogg",
	"sounds/Good15.ogg",
	"sounds/Good16.ogg",
	"sounds/Good17.ogg",
	"sounds/Good18.ogg",
	"sounds/Good19.ogg",
	"sounds/Good20.ogg"
];
soundPools[bigGoodSoundPool] = [
	"sounds/BigGood1.ogg",
	"sounds/BigGood2.ogg",
	"sounds/BigGood3.ogg",
	"sounds/BigGood4.ogg",
	"sounds/BigGood5.ogg",
	"sounds/BigGood6.ogg",
	"sounds/BigGood7.ogg",
	"sounds/BigGood8.ogg",
	"sounds/BigGood9.ogg",
	"sounds/BigGood10.ogg",
	"sounds/BigGood11.ogg",
	"sounds/BigGood12.ogg",
	"sounds/BigGood13.ogg",
	"sounds/BigGood14.ogg",
	"sounds/BigGood15.ogg",
	"sounds/BigGood16.ogg",
	"sounds/BigGood17.ogg",
	"sounds/BigGood18.ogg",
	"sounds/BigGood19.ogg",
	"sounds/BigGood20.ogg"
];
soundPools[finishSoundPool] = [
	"sounds/Finish1.ogg",
	"sounds/Finish2.ogg",
	"sounds/Finish3.ogg",
	"sounds/Finish4.ogg",
	"sounds/Finish5.ogg",
	"sounds/Finish6.ogg",
	"sounds/Finish7.ogg",
	"sounds/Finish8.ogg",
	"sounds/Finish9.ogg",
	"sounds/Finish10.ogg",
	"sounds/Finish11.ogg",
	"sounds/Finish12.ogg",
	"sounds/Finish13.ogg",
	"sounds/Finish14.ogg",
	"sounds/Finish15.ogg",
	"sounds/Finish16.ogg",
	"sounds/Finish17.ogg",
	"sounds/Finish18.ogg",
	"sounds/Finish19.ogg",
	"sounds/Finish20.ogg"
];
soundPools[emptySoundPool] = [
	"sounds/Horn.ogg",
	"sounds/smb2 nothing happened.ogg",
	"sounds/StoogesScream.ogg"
];

/* dummy "prize" text (Webdings characters) */
var dummyPrizes = ["!","@","&","w","e","t","o","j","k","b",",","Q","E","T","Y","I","P","S","H","J","L","Z","C","M","²","µ","Ä","ä","å","ç"];

/* dummy "prize" images */
var dummyPrizeImages = [
	"images/alcoholism.png",
	"images/bee.png",
	"images/magic_book.png",
	"images/bread.png",
	"images/cat.png",
	"images/chicken_leg.png",
	"images/crow.png",
	"images/dolphin.png",
	"images/garbage.png",
	"images/grave.png",
	"images/gun.png",
	"images/lost.png",
	"images/poison.png",
	"images/skull.png",
	"images/toilet.png",
	"images/whale.png",
	"images/ant.png",
	"images/cake.png",
	"images/magic_wand.png",
	"images/navi_the_fairy.png",
	"images/potted_plant.png",
	"images/rainbow.png",
	"images/rubber_duck.png",
	"images/sexy_cupcake.png",
	"images/spider.png",
	"images/toilet_paper_roll2.png",
	"images/treasure_chest.png",
	"images/a_wolfshirt.png",
	"images/broken_trophy.png",
	"images/plunger.png",
	"images/tamagotchi.png",
	"images/vcr_tape.png",
	"images/wily_ship.png"
];

/* % chance for each dummy prize square to be text vs. an image */
var dummyPrizeTextPct = 50;


/* Indices the goal square is allowed to be at (if placing immediately), with 0 in the upper left and moving right, then down. */
/* Current setting: squares 6+ moves from start */
var allowedGoalIndices = [9,13,14,17,18,19];

/* move # after which to place a goal square in any allowed space (moving to start counts as 1) */
/* 0 = set on init, use allowedGoalIndices for placement */
/* 1+ = set on given move (moving to the start space counts as a move) */
var placeGoalAfterNumMoves = 11;

/* automatically show the goal square when it's placed */
var showGoalWhenPlaced = false;

/* milliseconds to delay before showing square */
var msDelayToRevealSquare = 3000;
/* milliseconds to delay before unzooming square */
var msDelayToUnzoomSquare = 5500;

/* sound to play when marker moves on map */
var markerMoveSoundPath = "sounds/walking.mp3";


/* potential map/marker sets */
var mapSets = [
	{ map: "images/madithen map.gif", marker: "images/Bomberman_Snail.gif" },
	{ map: "images/madithen map 2.gif", marker: "images/Bomberman_Snail.gif" },
	{ map: "images/madithen map 3.gif", marker: "images/snail-turtle.gif" }
];


/***** Square creation ******/

/* Supported properties:
 * - text: text to display in the square when revealed
 * - sound: sound file to play when square revealed
 * - soundPool: sound pool name to play a random entry from when square revealed
 * - cssClass: CSS class name to set on the square
 */
function newEmptySquare()
{
	return { text: "a", soundPool: emptySoundPool, cssClass: "empty"};
}
function newDummyPrizeSquare()
{
	return { soundPool: goodSoundPool, cssClass: "dummyPrize"};
}
function newSpecialPrizeSquare()
{
	return { text: "+", soundPool: bigGoodSoundPool, cssClass: "prize"};
}
function newSmallPointsSquare()
{
	return { text: "+5", soundPool: goodSoundPool, cssClass: "smallPoints"};
}
function newBigPointsSquare()
{
	return { text: "+10", soundPool: bigGoodSoundPool, cssClass: "bigPoints"};
}
function newMultipliedPointsSquare()
{
	return { text: "x2", soundPool: bigGoodSoundPool, cssClass: "multiplier"};
}


/***** Functions ******/

var numMoves = 0;
var markerMoveSound = null;
function clickMapSquare(obj)
{
	/* increment moves */
	if (!obj.isShown)
	{
		++numMoves;
	}
	
	/* play marker move sound */
	if (markerMoveSoundPath && obj.dataContext !== startSquare)
	{
		if (!markerMoveSound)
		{
			markerMoveSound = new Audio(markerMoveSoundPath);
		}
		markerMoveSound.play();
	}
	
	/* move marker */
	var marker = document.getElementsByTagName("marker")[0];
	marker.style.top = obj.offsetTop+(obj.offsetHeight-marker.offsetHeight)/2;
	var newLeft = obj.offsetLeft+(obj.offsetWidth-marker.offsetWidth)/2;
	if (newLeft > marker.offsetLeft+1)
	{
		/* face marker right */
		marker.className = "faceRight";
	}
	else if (newLeft < marker.offsetLeft-1)
	{
		/* face marker left */
		marker.className = "faceLeft";
	}
	marker.style.left = newLeft;

	/* wait, then uncover square */
	window.setTimeout(showMapSquare, msDelayToRevealSquare, obj);
	
	if (numMoves === placeGoalAfterNumMoves)
	{
		/* place goal */
		var hiddenSquares = [];
		var elements = document.getElementsByTagName("ms");
		for (var i=0; i<elements.length; ++i)
		{
			var node = elements[i];
			if (node !== obj && !node.isShown && node.className !== "prize" && node.className !== "multiplier")
			{
				hiddenSquares.push(elements[i]);
			}
		}
		shuffle(hiddenSquares);
		placeGoal(hiddenSquares[0]);
	}
}

function zoomSquare(obj)
{
	/* add zoomed class */
	obj.className += " zoomed";
	
	/* wait then unzoom */
	window.setTimeout(unzoomSquare, msDelayToUnzoomSquare, obj);
}

function unzoomSquare(obj)
{
	/* remove zoomed class */
	obj.className = obj.className.replace(" zoomed", "");
}

function hideMapSquare(obj)
{
	/* cover square */
	obj.className = obj.className.replace(" shown", "");
	obj.isShown = false;
}

function getRandomSoundFromPoolName(poolName)
{
	var pool = audioPools[poolName];
	if (!pool)
	{
		return null;
	}
	
	var randomIndex = Math.floor(Math.random() * pool.length);
	var path = pool[randomIndex];
	return path;
}

function showMapSquare(obj)
{
	/* reveal square */
	obj.className += " shown";
	obj.isShown = true;

	/* show in 'current square' location */
	setCurrentSquare(obj);

	/* play sound */
	if (obj.dataContext.sound)
	{
		var sound = new Audio(obj.dataContext.sound);
		sound.play();
	}
	else if (obj.dataContext.soundPool)
	{
		var sound = getRandomSoundFromPoolName(obj.dataContext.soundPool);
		if (sound) sound.play();
	}
	
	if (obj.dataContext !== startSquare && obj.dataContext.cssClass !== "empty")
	{
		zoomSquare(obj);
	}
}

function setCurrentSquare(obj)
{
	/* update current square display */
	setSquareContext(document.getElementsByTagName("currentSquare")[0], obj.dataContext);
}

function setSquareContext(node, context)
{
	node.dataContext = context;
	node.textContent = context.text;
	node.className = context.cssClass;
	if (context.image)
	{
		node.style.backgroundImage = "url("+context.image+")";
	}
	else
	{
		node.style.backgroundImage = null;
	}
}

function hideAllSquares()
{
	var elements = document.getElementsByTagName("ms");
	for (var i=0; i<elements.length; ++i)
	{
		hideMapSquare(elements[i]);
	}
}

function placeGoal(node)
{
	setSquareContext(node, goalSquare);
	if (showGoalWhenPlaced)
	{
		showMapSquare(node);
	}
}

var audioPools = {};
var numAudioToPreload = 0;
var numAudioPreloaded = 0;
function initAudio()
{
	if (Object.keys(audioPools).length > 0)
	{
		return;
	}
	
	// count audio to preload
	for (var key in soundPools)
	{
		numAudioToPreload += soundPools[key].length;
	}
	document.getElementsByTagName("loadIndicator")[0].innerText = "0";
	// create audio objects
	for (var key in soundPools)
	{
		var soundPaths = soundPools[key];
		var audios = [];
		for (var i=0; i<soundPaths.length; ++i)
		{
			var audio = new Audio();
			audio.addEventListener('canplaythrough', audioPreloaded, false);
			audio.src = soundPaths[i];
			audios.push(audio);
		}
		audioPools[key] = audios;
	}
}
function audioPreloaded()
{
	++numAudioPreloaded;
	document.getElementsByTagName("loadIndicator")[0].innerText = 
			numAudioPreloaded < numAudioToPreload ? 
				"Audio: "+Math.round(100*numAudioPreloaded/numAudioToPreload)+"%" :
				"Audio: Ready";
}

function initMap()
{
	/* set up map image */
	var set = mapSets[Math.floor(mapSets.length*Math.random())];
	document.getElementById("mapImage").src = set.map;
	document.getElementById("markerImage").src = set.marker;
	
	/* set up audio */
	initAudio();
	
	/* reset counters */
	numMoves = 0;
	
	/* shuffle squares */
	shuffle(otherSquares);

	/* set up dummy prize text */
	shuffle(dummyPrizes);
	shuffle(dummyPrizeImages);
	var dummyPrizesUsed = 0;
	var dummyPrizeImagesUsed = 0;
	for (var i=0; i<otherSquares.length; ++i)
	{
		if (otherSquares[i].cssClass.startsWith("dummyPrize"))
		{
			if (Math.floor(Math.random() * 100) < dummyPrizeTextPct)
			{
				otherSquares[i].cssClass = "dummyPrize";
				otherSquares[i].text = dummyPrizes[dummyPrizesUsed++];
				otherSquares[i].image = null;
			}
			else
			{
				otherSquares[i].cssClass = "dummyPrizeImage";
				otherSquares[i].text = null;
				otherSquares[i].image = dummyPrizeImages[dummyPrizeImagesUsed++];
			}
		}
	}

	/* set up squares */
	var elements = document.getElementsByTagName("ms");
	for (var i=0; i<elements.length; ++i)
	{
		var node = elements[i];
		hideMapSquare(node);
		node.onclick = function () { clickMapSquare(this); };
		if (i === 0)
		{
			/* first square always start square */
			setSquareContext(node, startSquare);
		}
		else if (i < elements.length-1)
		{
			/* pick the next square from the deck */
			setSquareContext(node, otherSquares[i-1]);
		}
		else
		{
			/* last square, swap the goal in somewhere legal */
			var selectedIndex = allowedGoalIndices[Math.floor(Math.random() * allowedGoalIndices.length)];
			var goalNode = elements[selectedIndex];
			if (selectedIndex !== i)
			{
				/* move selected goal square's context to this final square */
				setSquareContext(node, goalNode.dataContext);
			}
			if (placeGoalAfterNumMoves === 0)
			{
				placeGoal(goalNode);
			}
			else
			{
				/* last square, use new blank square */
				setSquareContext(goalNode, newEmptySquare());
			}
		}
	}
	

	/* move marker */
	var marker = document.getElementsByTagName("marker")[0];
	marker.style.top = 230;
	marker.style.left = 270;
}

function resetMap()
{
	hideAllSquares();
	window.setTimeout(initMap, 1000);
}

/* http://stackoverflow.com/a/2450976 */
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}
