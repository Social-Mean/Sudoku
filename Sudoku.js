$.get("questionBank.json", function (result) {
  i = Math.floor(Math.random() * 100);
  $("#test").val(result.puzzle_list[i].problem);
});
var puzzle = document.getElementById("test").value.split(",");
for (i = 0; i < 81; i++) {
  puzzle[i] = parseInt(puzzle[i]);
}
console.log(puzzle);
var n;
var oldAnswer = puzzle;
var nowAnswer = new Array();
var inputs = new Array();
var isStart = 0;
var isOver = 0;
var time = 0;
document.body.onload = creatInitState();

function creatInitState() {
  // 获取tbody
  var tbody = document.querySelector("tbody");
  // 创建tr, tr数量取决于puzzle的行数, 因为数独必然是9行, 所以tr的数量为9
  for (let i = 0; i < 9; i++) {
    // 创建tr
    var tr = document.createElement("tr");
    // 将tr插入到tbody中
    tbody.appendChild(tr);
    for (let j = 0; j < 9; j++) {
      // 创建td
      var td = document.createElement("td");
      var input = document.createElement("input");
      // TODO: 如果是手机端打开, 则type="number", 这样手机上点击表单后, 会出现九宫格
      if (!isPC()) {
        // if (1) {
        input.setAttribute("type", "number");
      }
      input.setAttribute("value", puzzle[xy2n(j, i)]);
      // input.setAttribute("class", "eachAnswer");
      input.setAttribute("onchange", "ifChange()");
      input.setAttribute(
        "style",
        "background-color:" + groupColor(xy2n(j, i)) + "; font-weight: bold;"
      );

      if (puzzle[xy2n(j, i)] == 0) {
        input.setAttribute("value", "");
      }
      if (puzzle[xy2n(j, i)] > 0) {
        input.setAttribute("readonly", 1);
      }
      td.appendChild(input);
      //将td插入tr
      tr.appendChild(td);
    }
  }
}
reload();
function reload() {
  inputs = document.getElementsByTagName("input");
  isReload = getAnswer().splice(0, 81);

  console.log(isReload);
  if (isReload[0] != puzzle[0]) {
    location.reload();
  }
}
function n2xy(n) {
  x = n % 9;
  y = parseInt(n / 9);
  return { x: x, y: y };
}
function xy2n(x, y) {
  return 9 * y + x;
}
function n2pq(n) {
  // 获得组坐标(X, Y)
  xy = n2xy(n);
  X = parseInt(xy.x / 3);
  Y = parseInt(xy.y / 3);
  p = Y * 3 + X;
  pX = xy.x % 3;
  pY = xy.y % 3;
  q = pY * 3 + pX;
  return { p: p, q: q };
}
function pq2n(p, q) {
  x = 3 * (p % 3) + (q % 3);
  y = 3 * parseInt(p / 3) + parseInt(q / 3);
  return xy2n(x, y);
}

function groupColor(n) {
  p = n2pq(n).p;
  if (p % 2 == 0) {
    return "white";
  } else {
    return "lightcyan";
  }
}
function getAnswer() {
  inputs = document.getElementsByTagName("input");
  answer = new Array();
  for (i = 0; i < inputs.length; i++) {
    answer[i] = parseInt(inputs[i].value);
  }
  for (i = 0; i < answer.length; i++) {
    if (!(answer[i] < 10 && answer[i] > 0)) {
      answer[i] = 0;
    }
  }
  return answer;
}

function whereChange(nowAnswer, oldAnswer) {
  for (n = 0; n < nowAnswer.length; n++) {
    if (nowAnswer[n] != oldAnswer[n]) {
      return n;
    }
  }
}

function ifChange() {
  if (!isStart) {
    startCount();
    isStart = 1;
  }
  nowAnswer = getAnswer();
  n = whereChange(nowAnswer, oldAnswer);
  if (nowAnswer[n] == 0) {
    inputs[n].setAttribute(
      "style",
      "background-color:" + groupColor(n) + "; font-weight: bold;"
    );
  } else {
    changeBGColor(n, checkAnswer(n));
    if (checkAnswer(n)) {
      checker = 1;
      for (i = 0; i < nowAnswer.length; i++) {
        checker = checker * nowAnswer[i];
      }
      if (checker) {
        gameOver();
      }
    }
  }
  oldAnswer = nowAnswer;
}

function changeBGColor(n, bool) {
  if (bool) {
    inputs[n].setAttribute(
      "style",
      "background-color:aquamarine; font-weight: bold;"
    );
  } else {
    inputs[n].setAttribute(
      "style",
      "background-color:red; font-weight: bold; color:white"
    );
  }
}
function checkAnswer(n) {
  xR = getXRelevant(n);
  yR = getYRelevant(n);
  gR = getGRelevant(n);
  for (i = 0; i < 8; i++) {
    if (nowAnswer[n] == nowAnswer[xR[i]]) {
      return 0;
    }
    if (nowAnswer[n] == nowAnswer[yR[i]]) {
      return 0;
    }
    if (nowAnswer[n] == nowAnswer[gR[i]]) {
      return 0;
    }
  }
  return 1;
}
function getXRelevant(n) {
  bool = 0;
  xR = new Array();
  nsStart = parseInt(n / 9) * 9;
  for (i = 0; i < 9; i++) {
    if (n == nsStart + i) {
      bool = 1;
      continue;
    } else {
      if (bool) {
        xR[i - 1] = nsStart + i;
      } else {
        xR[i] = nsStart + i;
      }
    }
  }
  return xR;
}
function getYRelevant(n) {
  bool = 0;
  yR = new Array();
  nsStart = n % 9;
  for (i = 0; i < 9; i++) {
    if (n == nsStart + i * 9) {
      bool = 1;
      continue;
    } else {
      if (bool) {
        yR[i - 1] = nsStart + i * 9;
      } else {
        yR[i] = nsStart + i * 9;
      }
    }
  }
  return yR;
}
function getGRelevant(n) {
  bool = 0;
  gR = new Array();
  p = n2pq(n).p;
  nsStart = pq2n(p, 0);
  for (i = 0; i < 9; i++) {
    nsNow = nsStart + parseInt(i / 3) * 9 + (i % 3);
    if (n == nsNow) {
      bool = 1;
      continue;
    } else {
      if (bool) {
        gR[i - 1] = nsNow;
      } else {
        gR[i] = nsNow;
      }
    }
  }
  return gR;
}
function gameOver() {
  isOver = 1;
  hour = second2hms(time).h;
  minute = second2hms(time).m;
  second = second2hms(time).s;
  if (hour == 0) {
    if (minute == 0) {
      alert("本次所用时间为: " + second + "秒!");
    } else {
      alert("本次所用时间为: " + minute + "分钟" + second + "秒!");
    }
  } else {
    alert("本次所用时间为:" + hour + "小时" + minute + "分钟" + second + "秒!");
  }
}
function startCount() {
  div = document.getElementById("count");

  H = time2Display(second2hms().h);
  M = time2Display(second2hms().m);
  S = time2Display(second2hms().s);

  div.innerHTML = H + ":" + M + ":" + S;
  time++;
  if (!isOver) {
    setTimeout("startCount()", 1000);
  }
}

function second2hms() {
  hour = parseInt(time / 3600);
  minute = parseInt((time % 3600) / 60);
  second = time % 60;
  return { h: hour, m: minute, s: second };
}

function time2Display(hms) {
  if (hms < 10) {
    hms = "0" + hms;
  }
  return hms;
}
function isPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}
