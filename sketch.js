let classifier;
let mobilenet;
let video;
let label= '';
//buttons for navigation
let leftButton;
let topButton;
let rightButton;
let downButton;

let leftImages = 0;
let rightImages = 0;
let topImages = 0;
let downImages = 0;

let train;

//game variables starts
var s;
var scl = 20;
var food;
var foodx, foody;
//game variables ends

//game functions starts
	function pickLocation(){
		var cols = floor(width/scl);
		var rows = floor(height/scl);
		food = createVector(floor(random(cols)),floor(random(rows)));
		foodx = food.x;
		foody = food.y;	
		//food.mult(scl);
}

function modelReady() {
	select('#modelStatus').html('base model ready!');
}

function customModelReady() {
	select('#modelStatus').html('Custom model ready!');
	classifier.classify(gotResults);
}

function videoReady() {
	select('#videoStatus').html('video ready!');
}

function whileTraining(loss) {
	if (loss == null) {
		select('#loss').html('training done! Final loss is : ' + loss);
		classifier.classify(gotResults);
	}else{
		select('#loss').html('loss is : ' + loss);
	}
}

function gotResults(error, results) {
	if (error) {
		console.error(error);
	} else {
    	//console.log(results);
   		label = results[0].label;
    	classifier.classify(gotResults);
	}
}
function setupButton() {
	//left button
  leftButton = select('#leftButton');
  leftButton.mousePressed(function() {
    classifier.addImage('left');
    select('#amountOfLeftImages').html(leftImages++);
  });

	//right button
  rightButton = select('#rightButton');
  rightButton.mousePressed(function() {
    classifier.addImage('right');
    select('#amountOfRightImages').html(rightImages++);
  });

	//top button
  topButton = select('#topButton');
  topButton.mousePressed(function() {
    classifier.addImage('top');
    select('#amountOfTopImages').html(topImages++);
  });

	//down button
  downButton = select('#downButton');
  downButton.mousePressed(function() {
    classifier.addImage('down');
    select('#amountOfDownImages').html(downImages++);
  });

  //train button
  trainButton = select('#trainButton');
  trainButton.mousePressed(function() {
  	classifier.train(whileTraining);
  });   

  // Save model
  saveBtn = select('#save');
  saveBtn.mousePressed(function() {
    classifier.save();
  });

  // Load model
  loadBtn = select('#load');
  loadBtn.changed(function() {
  	classifier.load('savedModel/model.json', customModelReady);
  });
}


function setup() {


  createCanvas(640, 520);
  video = createCapture(VIDEO);
  //video.hide();
  background(0);
  mobilenet = ml5.featureExtractor('MobileNet', modelReady);
  classifier = mobilenet.classification(video,4, videoReady);
  const options = {numLabels: 4};
  classifier = mobilenet.classification(video, options, videoReady);
 

  setupButton();
  

  //game code starts
  createCanvas(640,480);
  s = new Snake();
  frameRate(10);
  pickLocation();
  //game code ends

}

function draw() {
	background(0);
	//image(video, 0,0); // to get video element to the canvas
	fill(255);
	textSize(32);
	text(label, 10, height);

    //game code starts
    s.update();
    s.show();

    if(s.eat(food)){
    	pickLocation();
    }
		//snake
		fill(255,0,100);
		rect(20*foodx, 20*foody, scl, scl);


		if(label == 'top')
			s.dir(0,-1);
		else if(label == 'down')
			s.dir(0,1);
		else if(label == 'left')
			s.dir(-1,0);
		else if(label == 'right')
			s.dir(1,0);



	//game code ends
}

