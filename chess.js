/*
出事变量定义
 */
var img_w = new Image();
var img_b = new Image();
img_w.src = "a.png";//白棋
img_b.src = "b.png";//黑棋
var canvas = null, // 绘制棋盘的画布
    context = null,
    context_chess = null,//绘制棋子的画布
    canvas_chess = null,
    isWhite = true, //是否白棋开始
    isWin = false,//是否赢了
    isBack = true,//是否可以后退
    hasChessArr = [], //存放已经下过棋子的坐标
    chessArr = new Array(15); //存放每个棋子的坐标, 初始值微0， 白棋走的记作1， 黑棋记作2
    for (var i = 0; i < chessArr.length; i++) {
    	chessArr[i] = new Array(15);
    	for (var j = 0; j < chessArr[i].length; j++) {
    		chessArr[i][j] = 0;
    	}
    }

//初始化棋盘
function initChess () {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
    canvas_chess = document.getElementById("canvaschess");
    context_chess = canvas_chess.getContext("2d");
	for (var i = 0; i <= 640; i += 40) {
		context.beginPath();
		context.moveTo(0, i);
		context.lineTo(640, i);
		context.closePath();
		context.stroke();
		context.beginPath();
		context.moveTo(i, 0);
		context.lineTo(i, 640);
		context.closePath();
		context.stroke();
	}
}
// 检测是否获胜
function checkWin (x, y, chess) {
    //一i共四个方向需要判断
    var lrCount = 0,  //左右
        tbCount = 0,  //上下
        ltrbCount = 0,  //左上右下
        lbrtCount = 0;  //左下右上
    //左右
    for (var i = x; i >= 0; i--) {
    	if (chessArr[i][y] != chess) {
    		break;
    	}
    	lrCount++;
    	if (i === 0) break;
    }
    for (var i = x + 1; i < 15; i++) {
    	if (chessArr[i][y] != chess) {
    		break;
    	}
    	lrCount++;
    }
    //上下
    for (var i = y; i >= 0; i--) {
    	if (chessArr[x][i] != chess) {
    		break;
    	}
    	tbCount++;
    	if (i === 0) break;
    }
    for (var i = y + 1; i < 15; i++) {
    	if (chessArr[x][i] != chess) {
    		break;
    	}
    	tbCount++;
    }
    //左上右下
    for (var i = x, j = y; i >= 0, j >= 0; i--, j--) {
    	if (chessArr[i][j] != chess) {
    		break;
    	}
    	ltrbCount++;
    	if (i === 0) break;
    }
    for (var i = x + 1, j = y + 1; i < 15, j < 15; i++, j++) {
    	if (chessArr[i][j] != chess) {
    		break;
    	}
    	ltrbCount++;
    }
    //左下右上
    for (var i = x, j = y; i >= 0, j < 15; i--, j++) {
    	if (chessArr[i][j] != chess) {
    		break;
    	}
    	lbrtCount++;
    	if (i === 0) break;
    }
    for (var i = x + 1, j = y - 1; i < 15, j >= 0; i++, j--) {
    	if (chessArr[i][j] != chess) {
    		break;
    	}
    	lbrtCount++;
    	if (j === 0) break;
    }
    

    // 每个方向上的数量大于等于5的时候获胜
    if (lrCount >= 5 || tbCount >= 5 || ltrbCount >= 5 || lbrtCount >= 5) {
    	isWin = true;
    	if (chess == 1) {
    		alert("白棋获胜");
    	} else {
    		alert("黑棋获胜");
    	}
    }

}
// 绘制棋子
function drawChess (x, y, chess) {
	if (x >= 0 && x < 15 && y >= 0 && y < 15) {
		if (chess == 1){
			context_chess.drawImage(img_w, x * 40 + 30, y * 40 + 30, 20, 20);
			chessArr[x][y] = 1;
		} else {
			context_chess.drawImage(img_b, x * 40 + 30, y * 40 + 30, 20, 20);
			chessArr[x][y] = 2;
		}
        isBack = true;
		hasChessArr.push({x: x, y: y, chess: chess});
		// console.log(x, y)
		//验证是否赢
		checkWin(x, y, chess);
	} else {
		alert("此处不能下棋！");
	}
    console.log(hasChessArr)
}

// 绘制棋子的位置
function playChess (e) {
    if (isWin) {
    	alert("该盘棋局已分胜负！");
    	return;
    }
    //点击下棋的坐标
    var x = parseInt((e.clientX - 16) / 40);
    var y = parseInt((e.clientY - 16) / 40);
    if (chessArr[x][y] != 0) {
		alert("此处不能下棋！");
		return;
	}
    if (isWhite) {
    	isWhite = false;
        drawChess(x, y, 1);
    } else {
    	isWhite = true;
    	drawChess(x, y, 2);
    }
}



window.onload = function () {
	initChess();
	document.getElementById("back").onclick = function () {
		if (hasChessArr.length == 0) {
			alert("暂未下棋！");
			return;
		}
	    var last = hasChessArr[hasChessArr.length - 1];
        var current = !isWhite? 1:2;
        if (isBack) {
           if (last.chess == current) {
                isWhite = last.chess == 1? true:false;
                chessArr[last.x][last.y] = 0;
                context_chess.clearRect(last.x * 40 + 30, last.y * 40 + 30, 20, 20);
                hasChessArr.pop();
                isBack = false;
            } else {
                alert("您不能后退");
            }
        } else {
            alert("不能后退!");
        }
	}
	document.getElementById("replay").onclick = function () {
	   window.location.reload(true);
	}
}