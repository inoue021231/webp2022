const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const day = today.getDay();
const date = today.getDate();
const startDay = new Date(year,month,1).getDay();

let clearCount = [];
let dateCount;
let weekCount;
let todoCount = [];
let d = 1;
let selectDate = today.getDate();
let dateStartFlag = 0;
let todo = [];
let clearTodo = [];
let todayKey = year;

if(month+1<10) {
    todayKey += "-0"+(month+1);
} else {
    todayKey += "-"+(month+1);
}
if(date<10) {
    todayKey += "-0"+date;
} else {
    todayKey += "-"+date;
}

let header = year+"年"+(month + 1)+"月";
let calendar;
let todolist;
let footer = "Webプログラミング課題";
let catpic = "";

let addBtn = document.getElementById('addBtn');
let prevBtn = document.getElementById('prevBtn');
let nextBtn = document.getElementById('nextBtn');
let holidaylist;
let catobject;
let labels = [];

getJSON();

catpic += '<img src="'+catobject[0]["url"]+'" alt="cat">';

if(month == 1) {
    dateCount = 28;
} else if(month == 3 && month == 5 && month == 8 && month == 11) {
    dateCount = 30;
} else {
    dateCount = 31;
}

weekCount = Math.ceil((startDay+dateCount)/7);

for(let i = 0; i < dateCount; i++) {
    labels.push(i+1);
    todoCount.push(0);
    clearCount.push(0);
    todo.push([]);
    clearTodo.push([]);
}

display();

function display() {
    calendar = "<table><tr><th>日</th><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th>土</th></tr>";
    todolist = "<table><tr><th><button onclick='prev()'><</button>"+(month+1)+"月"+selectDate+"日"+"<button onclick='next()'>></button></th></tr>";
    d = 1;
    dateStartFlag = 0;
    createCalendar();
    createTodo();
    makeChart();
    document.querySelector('#header').innerHTML = header;
    document.querySelector('#calendar').innerHTML = calendar;
    document.querySelector('#todolist').innerHTML = todolist;
    document.querySelector('#catpic').innerHTML=catpic;
    document.querySelector('#footer').innerHTML=footer;
}

function createCalendar() {

    for(let i = 0; i < weekCount; i++) {
        calendar += "<tr>";
        for(let j = 0; j < 7; j++) {
            if(dateStartFlag == 0 && startDay == j) {
                dateStartFlag = 1;
            }
            if(d <= dateCount && dateStartFlag == 1) {
                if(d == selectDate) {
                    calendar += "<td class='selectday'>"+d+"</td>";
                } else if(d == date) {
                    calendar += "<td class='today' onclick='select("+d+")'>"+d+"</td>";
                } else if(j == 0) {
                    calendar += "<td class='sunday' onclick='select("+d+")'>"+d+"</td>";
                } else if(j == 6) {
                    calendar += "<td class='saturday' onclick='select("+d+")'>"+d+"</td>";
                } else {
                    calendar += "<td onclick='select("+d+")'>"+d+"</td>";
                }
                d++;
            } else {
                calendar += "<td></td>";
            }
        }
        calendar += "</tr>";
    }
}

function createTodo() {
    let i = 0;

    while(clearCount[selectDate-1] > i) {
        todolist += "<tr><td class='clear'>・"+clearTodo[selectDate-1][i]+"</td></tr>";
        i += 1;
    }
    i = 0;
    while(todoCount[selectDate-1] > i) {
        todolist += "<tr><td class='list'>・";
        todolist += todo[selectDate-1][i] + "<button onclick='moveClear("+i+")'>●</button><button onclick='deleteTodo("+i+")'>-</button>";
        
        todolist += "</td></tr>";
        i += 1;
    }
}

function select(n) {
    selectDate = n;
    display();
}

function moveClear(n) {
    clearTodo[selectDate-1].push(todo[selectDate-1][n]);
    clearCount[selectDate-1] += 1;
    deleteTodo(n);
}

function deleteTodo(n) {
    todo[selectDate-1].splice(n,1);
    todoCount[selectDate-1] -= 1;
    display();
}

function prev() {
    if(selectDate > 1) {
        selectDate -= 1;
    }
    display();
}
function next() {
    if(selectDate < dateCount) {
        selectDate += 1;
    }
    display();
}

function getJSON() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(req.readyState == 4 && req.status == 200) {
            let catdata = req.responseText;

            catobject = JSON.parse(catdata);
            console.log(catobject[0]["url"]);
        }
    };
    req.open("GET","https://api.thecatapi.com/v1/images/search",false);
    req.send(null);
}

function makeChart() {
    let ctx = document.getElementById('chart');
    new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: '達成',
              data: clearCount,
              borderColor: "red",
              backgroundColor: "#00000000"
            },
            {
              label: '実行中',
              data: todoCount,
              borderColor: "blue",
              backgroundColor: "#00000000"
            }
          ],
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                suggestedMax: 5,
                suggestedMin: 0,
                stepSize: 1,  // 縦メモリのステップ数
                callback: function(value){
                  return value;
                }
              }
            }]
          },
        }
      });
}

addBtn.addEventListener('click', function() {
    addtodo = document.getElementById('addTodo');
    if(todoCount[selectDate-1]+clearCount[selectDate-1] < 5) {
        todo[selectDate-1].push(addtodo.value);
        todoCount[selectDate-1] += 1;
    }

    display();
}, false);