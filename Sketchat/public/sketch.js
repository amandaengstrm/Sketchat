const socket = io();

function setup() {
	var canvas = createCanvas(900, 600);
	canvas.parent('sketch-holder');
	background(51);

	socket.on('brush', newDrawing);
		
	socket.on('clearCanvas' , function() {
		clearCanvas();
		background(51);
	})
}

function newDrawing(data){
	noStroke();
	fill(255);
	strokeWeight(4);
	ellipse(data.x, data.y, 10,10);
}

function mouseDragged(){
	console.log('Sending: ' + mouseX + ',' + mouseY);

	var data = {
		x: mouseX,
		y: mouseY
	}
	//sending message
	socket.emit('brush', data);

	noStroke();
	strokeWeight(4);
	fill(255);
	ellipse(mouseX, mouseY, 10,10);
}

function clearCanvas (){
	clear();
}
