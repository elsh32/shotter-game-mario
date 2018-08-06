function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}
















var brickUrl = "spirites/caisse_ok.jpg";
var marioUrl = "spirites/mario.gif";
var ballUrl = "spirites/ball.png";
var board = document.getElementById('board');
var scoreboard = document.getElementById('scoreboard');
var bricksSize = 34;
var marioHeight = 34;
var ballSize = 34;
var firstclick = 1;

var ctx = new AudioContext();
var bufferloader = new BufferLoader(ctx, 
		["audio/candy.mp3", "audio/shut2.wav", "audio/hit.wav", "audio/GameOver.wav", "audio/success.wav"]
	,
	endloading);
bufferloader.load();

var someday;
var endFailSound;
var endSuccessSound;
var buff = new Array();
var shutSound = new Array();
var hitSound = new Array();





function endloading(bufferlist){

	buff.push(bufferlist[0]);
	buff.push(bufferlist[1]);
	buff.push(bufferlist[2]);


	someday = ctx.createBufferSource();
	someday.buffer = bufferlist[0];
	someday.connect(ctx.destination);
	someday.loop = true;

	mariogain = ctx.createGain();
	someday.connect(mariogain);
	mariogain.connect(ctx.destination);
	mariogain.gain.value = 0;

	endFailSound = ctx.createBufferSource();
	endFailSound.buffer = bufferlist[3];
	endFailSound.connect(ctx.destination);

	endSuccessSound = ctx.createBufferSource();
	endSuccessSound.buffer = bufferlist[4];
	endSuccessSound.connect(ctx.destination);
	



	
	
}

function shutplay(){

	shutSound.push(ctx.createBufferSource());
	shutSound[(shutSound.length)-1].buffer = buff[1];
	shutSound[(shutSound.length)-1].connect(ctx.destination);
	shutSound[(shutSound.length)-1].start(0);
	
}

function hitplay(){

	hitSound.push(ctx.createBufferSource());
	hitSound[(hitSound.length)-1].buffer = buff[2];
	hitSound[(hitSound.length)-1].connect(ctx.destination);
	hitSound[(hitSound.length)-1].start(0);
	
}



//create ball
function createBall(marioref){

	var ballref = document.createElement("img");

	ballref.src = ballUrl;
	ballref.style.position = 'absolute';
	ballref.style.top = (parseInt(getComputedStyle(board, null).height) - parseInt(marioHeight)-ballSize)+"px";
	ballref.style.left = parseInt(marioref.offsetLeft)+"px";

	board.appendChild(ballref);

	return ballref;
}

//create each set of bricks
function createBrickSet(number) {


	var bricks = new Array();
	for (var i = 0; i < number; i++) {
		
		bricks.push(document.createElement("img"));

		bricks[i].src = brickUrl;
		bricks[i].style.position = 'absolute';
		bricks[i].style.top = "0px";
		bricks[i].style.left = (i*bricksSize)+"px";

		board.appendChild(bricks[i]);  
	}

	return bricks;
}

//initialize mario
function initMario()
{
	mario = document.createElement("img");
	mario.src = marioUrl;
	mario.style.position = 'absolute';
	mario.style.top = (parseInt(getComputedStyle(board, null).height) - marioHeight)+"px";
	mario.style.left = (marioHeight*5)+"px";

	board.appendChild(mario);

	return mario;

}


//handle mario movement
function moveMario(marioref)
{
	document.addEventListener('mousemove',function(e){

		mario.style.left = (parseInt(((e.clientX - board.offsetLeft) / marioHeight)) * marioHeight) +'px';
		//handle colision of paddle
	

		if (mario.offsetLeft >= (board.offsetWidth - marioHeight) )
			mario.style.left = (parseInt(board.offsetWidth) - parseInt(getComputedStyle(board, null).borderWidth) - marioHeight)+"px";
		if (mario.offsetLeft <= 0)
			mario.style.left = '0px';
		
		
			
	},false)
}


//move the given array of brick 
function moveBricks(bricks){

	for (var i = 0; i < bricks.length; i++) {
		for (var j = 0; j < bricks[i].length; j++) {

			if (parseInt(bricks[i][j].offsetTop + bricksSize) >= (parseInt(getComputedStyle(board, null).height) - bricksSize)) 
			{
				gameOver = 1;
				break;
				return gameOver;
			}
			bricks[i][j].style.top = (parseInt(bricks[i][j].offsetTop + bricksSize))+"px";
		}
	}

	return gameOver;
}

//move ball
function moveBall(ballref)
{

	for (var i = 0; i < ballref.length; i++) {



		for (var k = 0; k < bricksArray.length; k++) {
			
			if(bricksArray[k][0]){


				if(parseInt(ballref[i].offsetTop) - 1 <= parseInt(bricksArray[k][0].offsetTop))
				{

					for (var j = 0; j < bricksArray[k].length; j++) {
						if ((ballref[i].offsetLeft == bricksArray[k][j].offsetLeft)) 
						{
							console.log(ballref[i].offsetLeft);
							collisionDetect(i, k, j, "ballbrick");
							collisiondetected = 1
							score += 5;
							
							break;
						}
					}
					
				}else
				{

					break;
				}

				if (collisiondetected) {
					break;
				}
			}
				
			
		}




		if (!collisiondetected) {

			if (parseInt(ballref[i].offsetTop) - 1 <= 0) {

				collisionDetect(i, 0, 0, "ballout");
				continue;
			}else
			{
				ballref[i].style.top = (parseInt(ballref[i].offsetTop) - 10)+"px";	
			}

			
		}

		collisiondetected = 0;
		
	}
}


//collision handler
function collisionDetect(ballref, brickref1, brickref2, type){

	var tmpball = ball[ballref];
	ball[ballref] = ball[ball.length - 1];
	ball.pop();

	if(type == "ballbrick"){

		hitplay();
		var tmpbrick = bricksArray[brickref1][brickref2];
		bricksArray[brickref1][brickref2] = bricksArray[brickref1][(bricksArray[brickref1].length)-1];
		bricksArray[brickref1].pop();


		if(bricksArray[brickref1].length == 0)
		{
			var tmpSuperBrick = bricksArray[brickref1];
			bricksArray[brickref1] = bricksArray[bricksArray.length - 1];
			bricksArray.pop();

			if(bricksArray.length == 0)
			{
				showEndMessage(1);
			}

		}

		tmpbrick.parentNode.removeChild(tmpbrick);


	}

	


	tmpball.parentNode.removeChild(tmpball);


}


//be called periodically be setInterval
function startGame(){

	//move set
	gameEnd = moveBricks(bricksArray);

	if (gameEnd) {

		clearInterval(timer1);
		clearInterval(timer2);
		showEndMessage(0);
	}


	if (numberBrick > 0) 
	{
		//create following set
		bricksArray.push(createBrickSet(11));
		numberBrick--;
	}
	

}

//function  game end
function showEndMessage(mtype)
{
	board.parentNode.removeChild(board);

	var messaj = document.createElement("p");
	var text;

	someday.stop(0);
	if(mtype){

		endSuccessSound.start(0);
		text = document.createTextNode("BIINNNGO, Congrat you Won. Your Score is: "+score);
	}else{
		text = document.createTextNode("OOOOoooops, game Over. Your score is: "+score);
		endFailSound.start(0);
	}
	var h1 = document.createElement("h1");

	 h1.appendChild(text);
	 messaj.appendChild(h1);
	 scoreboard.appendChild(messaj);

	 scoreboard.style.height = "140px";
	 scoreboard.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
	 scoreboard.style.marginTop = "20%"; 
	 scoreboard.style.textAlign = "center";
	 scoreboard.style.border = "8px double white";
	 scoreboard.style.borderRadius = "10px";


	 setInterval(colorloop, 10);

}


var bricksArray = new Array();
bricksArray.push(createBrickSet(11));

var mario = initMario();

var ball = new Array();

var collisiondetected = 0;

var numberBrick = 18;

var gameOver = 0;

var timer1;
var timer2;

var mariogain;

var score = 0;





$("#board").on("click", function(){

	if(firstclick){
		
		moveMario(mario);
		timer1 = setInterval(startGame, 5000);
		timer2 = setInterval(moveBall, 0.0005, ball);
		firstclick = 0;
		someday.start(0);
	}

	if(!firstclick)
	{
		ball.push(createBall(mario));
		shutplay();
		
		
	}
	

})

var n = 0, m = 0, k = 0;
var l = 255, o = 255, p = 255;

function colorloop(){

	scoreboard.style.backgroundColor = "rgba("+n+","+m+","+k+", 0.5)";

	scoreboard.style.borderColor = "rgba("+l+","+o+","+p+", 1)";

	
	if (n < 255) 
	{
		n++;
	}else if(m < 255)
	{
		m++;
	}else
	{
		n = 0;
		m = 0;
		k = 0;
	}

	if (l > 0) 
	{
		l--;
	}else if(o > 0)
	{
		o--;
	}else if (p > 0)
	{
		p--;
	}else
	{
		l = 255;
		o = 255;
		p = 255;
	}

}




