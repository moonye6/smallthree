
var points,
	rows = 4,
	cols = 4,
	KEYUP = 38,
	KEYRIGHT = 39,
	KEYDOWN = 40,
	KEYLEFT = 37,
	IS_OVER = false,
	UP = 0,RIGHT = 1, DOWN = 2, LEFT = 3;

$(function() {
	init();

	bindEvent();
});

function init () {

	updateScore(true);

	if(points) {
		for(var i = 0; i < rows; i ++) {
			for(var j = 0; j < cols; j++) {
				$(points.getDomId(i, j)).empty();
			}
		}
	}
	
	points = new Points(4, 4);

	generateNum([1]);
	generateNum([2]);
}

function bindEvent() {
	$(document).on('keyup',  function(evt) {
		switch(evt.keyCode) {
			case KEYUP:
				moveUp();
				updateScore();
				generateNum([1,2], UP);
				break;
			case KEYRIGHT:
				moveRight();
				updateScore();
				generateNum([1,2], RIGHT);
				break;
			case KEYDOWN:
				moveDown();
				updateScore();
				generateNum([1,2], DOWN);
				break;
			case KEYLEFT:
				moveLeft();
				updateScore();
				generateNum([1,2], LEFT);
				break;
			default:
			break;
		}
	});

	$('.newgame').on('click',  function() {
		init();
	})
}


function generateNum (l, d) {
	var list = l;

	if(!list || list.length===0){
		list=[1];
	}

	var n = getNum(l),
		direct = typeof d === 'undefined' ? getPos(): d,
		pos= points.getRandomPos(direct, n), 
		domId = points.getDomId(pos.row, pos.col);

	$(domId).html(wrapNum(n));

	setTimeout(function () {
		checkOver();
	}, 300);

}

function getNum (l) {
	if(l && l.length === 1) {
		return l[0];
	}
	return Math.random() < 0.5? 1:2;
}
function getPos () {
	return Math.floor(Math.random()*4);
}
function getTopPosPix (tx, ty) {
	return $(points.getDomId(tx, ty)).offset().top;
}
function getLeftPosPix (tx, ty) {
	return $(points.getDomId(tx, ty)).offset().left;
}

function wrapNum (n) {
	return ['<span class="num num-', n<3?  n : 'x' ,'" >', n,'</span>'].join('');
}


function canMerge(fx, fy, tx, ty) {
	if(points.getValue(fx, fy) > 0) {
		if(points.getValue(tx, ty) === 0 
			|| (points.getValue(fx, fy) + points.getValue(tx, ty) === 3) 
			|| (points.getValue(fx, fy) === points.getValue(tx, ty) && points.getValue(tx, ty) >= 3)) {
			return true;
		}
	}
	return false;
}

function merge (fx, fy, tx, ty) {
	var fdom = $(points.getDomId(fx, fy)),
		tdom = $(points.getDomId(tx, ty));

	points.setValue(tx, ty, points.getValue(fx, fy) + points.getValue(tx, ty));

	points.setValue(fx, fy, 0);

	fdom.find('.num').animate({
		top: getTopPosPix (tx, ty),
		left:getLeftPosPix (tx, ty),
		color: "black",
		"background-color": "white"
	},50,function() {
		tdom.html(wrapNum(points.getValue(tx, ty)));
	});
	fdom.empty();

}
function moveUp () {
	if(IS_OVER) {
		return;
	}
	for (var i = 1; i <= 3; i++) {
		for (var j = 0; j <= 3; j++) {
			if(canMerge(i,j, i-1,j)) {
				merge(i, j , i-1, j);
			}
		};
	};
}

function moveRight () {
	if(IS_OVER) {
		return;
	}
	for (var j = 2; j >= 0; j--) {
		for (var i = 0; i <= 3; i++) {
			if(canMerge(i,j, i, j+1)) {
				merge(i, j , i, j+1);
			}
		};
	};
}

function moveDown () {
	if(IS_OVER) {
		return;
	}
	for (var i = 2; i >= 0; i--) {
		for (var j = 0; j <= 3; j++) {
			if(canMerge(i,j, i+1,j)) {
				merge(i, j , i+1, j);
			}
		};
	};
}

function moveLeft () {
	if(IS_OVER) {
		return;
	}
	for (var j = 1; j <= 3; j++) {
		for (var i = 0; i <= 3; i++) {
			if(canMerge(i,j, i, j-1)) {
				merge(i, j , i, j-1);
			}
		};
	};
}


function checkOver () {
	var cur,right, down;
	console.log("--------------------------------");
	points.toString();
	if(IS_OVER) {
		return true;
	}
	for (var i = 0; i <= 3; i++) {
		for (var j = 0; j <= 3; j++) {
			if(this.points.getValue(i, j) === 0) {
				return false;
			}
			//判断右边能否merge
			if(j <=2 && canMerge(i, j, i, j+ 1)) {
				return false;
			}
			//判断下边能否merge
			if(i <=2 && canMerge(i, j, i+ 1, j)) {
				return false;
			}
		};
	};

	//游戏结束
	IS_OVER = true;
	alert('Game Over');
	return true;
}

function updateScore (reset) {
	if(reset) {
		$(".score").text(0);
		return;
	}
	var score = 0, rate=1;
	for (var i = 0; i <= 3; i++) {
		for (var j = 0; j < 3; j++) {
			if(points.getValue(i, j) >= 3) {
				rate = Math.floor(points.getValue(i, j) / 3);
				score += Math.pow(5, rate-1);
			}
		};
	};
	$(".score").text(score)
}


function Points(rs, cs) {
	this.points = [];
	this.maxRows = rs;
	this.maxCols = cs;
	this.init(rs, cs);
}

Points.prototype.init = function(r, c) {
	for(var i = 0; i < r; i ++) {
		this.points[i] = [];
		for(var j = 0; j < c; j++) {
			this.points[i][j] = 0;
		}
	}
}
Points.prototype.getDomId = function(r, c) {
	return ['#pos', r, c].join('_');
}

Points.prototype.getValue = function (r, c) {
	if(r < this.maxRows && c < this.maxCols){
		return this.points[r][c];
	}
	return 0;
}

Points.prototype.setValue = function (r, c, v) {
	if(r < this.maxRows && c < this.maxCols){
	 	this.points[r][c] = v;
	}
}

Points.prototype.isValidPosAndValue = function (r, c) {
	if(r < this.maxRows && c < this.maxCols){
	 	return this.points[r][c] === 0 ;
	}
	return false;
}

Points.prototype.getRandomPos = function (direct, v) {
	var row, col,count = 0;
	do{
		console.log("getRandomPos： "+ (++count));
		if(count >= 100) {
			break;
		}
		switch(direct) {
			case UP:
				row = 3;
				col = getPos();
				break;
			case RIGHT:
				row = getPos();
				col = 0;
				break;
			case DOWN:
				row = 0;
				col = getPos();
				break;
			case LEFT:
				row = getPos();
				col = 3;
				break;
			default:
				break;
		}
	} while(!this.isValidPosAndValue(row, col));

	if(!row && !col) {
		for(var i = 0; i < this.maxRows; i ++) {
			for(var j = 0; j < this.maxCols; j++) {
				if(this.points[i][j] === 0) {
					row = i;
					col = j;
				}
			}
		}
	}
	if(!row && !col) {
		IS_OVER = true;
		console.log("over");
		return;
	}
	this.setValue(row, col, v);
	// this.toString();
	return {row: row, col: col};	
}

Points.prototype.toString = function (r, c) {
	for(var i = 0; i < this.maxRows; i ++) {
		for(var j = 0; j < this.maxCols; j++) {
			console.log('i: '+i+', j: '+j+', value: ' + this.points[i][j]);
		}
	}
}