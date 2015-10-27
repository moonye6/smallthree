咳咳，如果你是被标题吸引过来的，只能说明你思想不太纯洁。

其实，这里要讲的，是关于一个游戏的故事，这个游戏的名字叫做小三传奇，曾经在ios平台上面很火的一款游戏。网上2048方面的教程很多，于是动了自己弄一个小三传奇的教程，附上源码，这样大家就可以一起high了。其实写之前会觉得还挺复杂的，但是基本的逻辑想通之后，会发现思路还是比较清晰简单的。


### 介绍
这是一款益智类的小游戏，最开始出现在ios平台上，还是收费的（6元），操作简单，需要动脑经才能得高分。一局快则几分钟，慢则二十分钟甚至更久。在它出来之后的几个月后，android平台上才出了一款类似的益智游戏，2048.虽然类似，但习惯了原来游戏的风格和规则之后，对2048的兴趣不大。
以下介绍一些基本的规则：
1. 游戏初始界面是一个4*4的表格，游戏开始时，在最外层（0行，3行，0列，3列）随机位置生成两个数字，分别是1和2。
2. 用户可以操作的按键是方向键（上下左右），按下方向键一次，则界面上的数字会朝指定方向移动，并且在界面上指定的一行或一列随机生成一个数字。如果指定方向上的数字不能移动，则此时会触发数字的合并。合并的条件是是1和2可以合并，合并结果为3，或者大于或等于3的两个数，如果相等也可以合并，合并的结果为两个数之和。
3. 如果最后界面上填满了数字，且没有数字可以合并了，则游戏结束。可以在界面上看到用户的得分。合并的次数越多，得分越高。


### 效果图
这里是实现的效果图

### 代码
这里代码只取了部分代码，完整的可以看[这里](https://github.com/moonye6/smallthree)

#### html方面
这里准备了一个容器，中间放置16个块，用来放置数字的
```
 	<div class="box-container clear">
 		<div class="cell" id ="pos_0_0"></div>
 		<div class="cell" id ="pos_0_1"></div>
 		<div class="cell" id ="pos_0_2"></div>
 		<div class="cell" id ="pos_0_3"></div>
 		<div class="cell" id ="pos_1_0"></div>
 		<div class="cell" id ="pos_1_1"></div>
 		<div class="cell" id ="pos_1_2"></div>
 		<div class="cell" id ="pos_1_3"></div>
 		<div class="cell" id ="pos_2_0"></div>
 		<div class="cell" id ="pos_2_1"></div>
 		<div class="cell" id ="pos_2_2"></div>
 		<div class="cell" id ="pos_2_3"></div>
 		<div class="cell" id ="pos_3_0"></div>
 		<div class="cell" id ="pos_3_1"></div>
 		<div class="cell" id ="pos_3_2"></div>
 		<div class="cell" id ="pos_3_3"></div>
 	</div>
```

#### css方面
这里直接是在搜索引擎中找了一张游戏截图，基于这张图来配的颜色。
```
.box-container {
	width: 256px;
	margin: 0 auto;
	background-color: #eaeaea;
	position: relative;
}
.cell {
	border-radius: 6px;
	background-color: #dbdbdb;
	width: 60px;
	height: 90px;
	margin: 2px;
	float: left;
	overflow: hidden;
}
.num {
	display: inline-block;
	vertical-align: middle;
	width: 100%;
	line-height: 90px;
	text-align: center;
	font-weight: bold;
	font-size: 38px;

}
.num-2 {
	background-color: #ff6680;
	color: white;
}
.num-1 {
	background-color: #66ccff;
	color: white;
}
.num-x {
	background-color: #fcfcfc;
	color: black;
}
```

#### js逻辑
首先初始化数据点阵
```
for(var i = 0; i < r; i ++) {
		this.points[i] = [];
		for(var j = 0; j < c; j++) {
			this.points[i][j] = 0;
		}
	}
```

生成随机的数字
```
return Math.random() < 0.5? 1:2;
```

生成随机的位置
```
Points.prototype.getRandomPos = function (direct, v) {
	var row, col,count = 0;
	do{
		switch(direct) {
			case UP:
				row = 3;
				col = getPos();
				break;
				...
			default:
				break;
		}
	} while(!this.isValidPosAndValue(row, col));

	...
	this.setValue(row, col, v);
	// this.toString();
	return {row: row, col: col};	
}
```

位置有了，数字有了，将数字显示到指定位置就好
```
domId = points.getDomId(pos.row, pos.col);
$(domId).html(wrapNum(n));
```

然后我们就绑定事件，让它能够移动

```
$(document).on('keyup',  function(evt) {
		switch(evt.keyCode) {
			case KEYUP:
				moveUp();
				updateScore();
				generateNum([1,2], UP);
				break;
			...
			default:
			break;
		}
	});
```

能够移动了，那还要看它能不能合并，能不能够得分，对吧。
```
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
```

最后，看看游戏结束没，算了得了多少分

```
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
```

### 小结
抽空写写小游戏还是挺好的，这里的dom和css比较简单，复杂的地方在逻辑那里。完成一个小游戏，里面可以填充的东西太多了，也可以实现自己的一些想法。
比如上面的游戏，如果在手机端，如何展示，可以考虑接入rem方案。比如合并时的动画，这个代码里面留了位置，还未实现。也还可以多加一点趣味性的东西，比如下个会出现哪个数字，可以给出提示。比如出现数字的算法，其实可以设计得复杂些，这样玩起来会更有意思。
最后一句，写写还是挺有意思的。



