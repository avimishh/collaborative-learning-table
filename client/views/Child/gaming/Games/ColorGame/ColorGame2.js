let constColors = [
    {
        'name': 'אדום',             // constColors[0]
        'val': '255, 0, 0',
        'result': 'אדום'
    }, {
        'name': 'ירוק',             // constColors[1]
        'val': '0, 255, 0',
        'result': 'ירוק'
    }, {
        'name': 'כחול',             // constColors[2]
        'val': '0, 0, 255',
        'result': 'כחול'
    }, {
        'name': 'תכלת',             // constColors[3]
        'val': '0, 255, 255',
        'result': 'ירוק + כחול'
    }, {
        'name': 'צהוב',             // constColors[4]
        'val': '255, 255, 0',
        'result': 'אדום + ירוק'
    }, {
        'name': 'אפור',             // constColors[5]
        'val': '128, 128, 128',
        'result': 'שחור + לבן'
    }, {
        'name': 'לבן',              // constColors[6]
        'val': '255, 255, 255',
        'result': 'אדום + ירוק + כחול'
    }, {
        'name': 'סגול',             // constColors[7]
        'val': '139, 0, 139',
        'result': 'אדום + כחול'
    }, {
        'name': 'כתום',             // constColors[8]
        'val': '255, 165, 0',
        'result': 'צהוב + אדום'
    }, {
        'name': 'חום',              // constColors[9]
        'val': '139, 69, 19',
        'result': 'כתום + שחור'
    }, {
        'name': 'ורוד',             // constColors[10]
        'val': '255, 182, 193',
        'result': 'לבן + אדום'
    }, {
        'name': 'ירוק כהה',         // constColors[11]
        'val': '25, 89, 5',
        'result': 'כחול + ירוק'
    }
];

var numSquares = 6;
var colors = generatrRandomColors(numSquares);
var squares = $(".square");
var pickedColor = pickColor();
var colorDisplay = document.getElementById("colorDisplay");
var colorDisplayResult = document.getElementById("colorDisplayResult");
colorDisplay.textContent = colorDisplayText();

var h1 = $("h1");
var messageDisplay = $("#message");
var resetButton = document.getElementById("reset");
var easyBtn = $("#easyBtn");
var hardBtn = $("#hardBtn");
var varRandomColor;


for (var i = 0; i < squares.length; i++) {
    // add initial colors to squares
    squares[i].style.background = colors[i];

    // add click Listeners to squares
    squares[i].addEventListener("click", function () {
        // grab color of clicked square
        var clickedColor = this.style.background;
        // compare color to pickedColor
        if (clickedColor === pickedColor) {
            messageDisplay.text("נכון!");
            changeColors(clickedColor);
            h1.css("background", pickedColor);
            resetButton.textContent = "שחק שוב?";

            if (pickedColor != "rgb(" + constColors[0].val + ")" && pickedColor != "rgb(" + constColors[1].val + ")" && pickedColor != "rgb(" + constColors[2].val + ")") {
                colorDisplayResult.textContent = colorDisplayTextResult();
            }
        }
        else {
            this.style.background = "#232323";
            messageDisplay.text("נסה שוב");
        }
    });
}

easyBtn.on("click", function () {
    hardBtn.removeClass("selected");
    easyBtn.addClass("selected");
    numSquares = 3;
    colors = generatrRandomColors(numSquares);
    pickedColor = pickColor();
    colorDisplay.textContent = colorDisplayText();
    colorDisplayResult.textContent = "";

    for (var i = 0; i < squares.length; i++) {
        if (colors[i]) {
            squares[i].style.background = colors[i];
        }
        else {
            squares[i].style.display = "none";
        }
    }
    resetMessColor();
});

hardBtn.on("click", function () {
    easyBtn.removeClass("selected");
    hardBtn.addClass("selected");
    numSquares = 6;
    colors = generatrRandomColors(numSquares);
    pickedColor = pickColor();
    colorDisplay.textContent = colorDisplayText();
    colorDisplayResult.textContent = "";

    for (var i = 0; i < squares.length; i++) {
            squares[i].style.background = colors[i];
            squares[i].style.display = "block";
    }
    resetMessColor();
});

resetButton.addEventListener("click", function () {
    // generate all new colors
    colors = generatrRandomColors(numSquares);
    // peack a new random color from array
    pickedColor = pickColor();
    // change colorDisplay to match pickedColor
    colorDisplay.textContent = colorDisplayText();
    colorDisplayResult.textContent = "";
    // change colors to squares
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.background = colors[i];
    }
    resetMessColor();
});

function resetMessColor() {
    h1.css("background", "steelblue");
    messageDisplay.text("");
    resetButton.textContent = "צבעים חדשים";
    colorDisplay.style.color = "white";
}

function changeColors(color) {
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.background = color;
    }
    if (colorDisplay.textContent == 'אדום + ירוק + כחול') {
        colorDisplay.style.color = "black";
    }
}

function pickColor() {
    var random = Math.floor(Math.random() * colors.length);
    return colors[random];
}

function generatrRandomColors(num) {
    // make an array
    var arr = [];

    // repeat num times
    for (var i = 0; i < num; i++) {
        // check if exist in arr
        varRandomColor = randomColor();

        while (arr.includes(varRandomColor)) {
            varRandomColor = randomColor();
        }
        // add num random colors to array
        arr.push(varRandomColor);
    }

    // return that array
    return arr;
}

function randomColor() {
    // peack a color from 0 - 11
    var index = Math.floor(Math.random() * 12);

    return "rgb(" + constColors[index].val + ")";
}

function colorDisplayText() {
    var title;
 
    switch (pickedColor) {
        case "rgb(" + constColors[0].val + ")":
            title = constColors[0].result;
            break;
        case "rgb(" + constColors[1].val + ")":
            title = constColors[1].result;
            break;
        case "rgb(" + constColors[2].val + ")":
            title = constColors[2].result;
            break;
        case "rgb(" + constColors[3].val + ")":
            title = constColors[3].result;
            break;
        case "rgb(" + constColors[4].val + ")":
            title = constColors[4].result;
            break;
        case "rgb(" + constColors[5].val + ")":
            title = constColors[5].result;
            break;
        case "rgb(" + constColors[6].val + ")":
            title = constColors[6].result;
            break;
        case "rgb(" + constColors[7].val + ")":
            title = constColors[7].result;
            break;
        case "rgb(" + constColors[8].val + ")":
            title = constColors[8].result;
            break;
        case "rgb(" + constColors[9].val + ")":
            title = constColors[9].result;
            break;
        case "rgb(" + constColors[10].val + ")":
            title = constColors[10].result;
            break;
        case "rgb(" + constColors[11].val + ")":
            title = constColors[11].result;
            break;
    }

    return title;

}

function colorDisplayTextResult() {
    var titleResult;

    switch (pickedColor) {
        case "rgb(" + constColors[0].val + ")":
            titleResult = " = " + constColors[0].name;
            break;
        case "rgb(" + constColors[1].val + ")":
            titleResult = " = " + constColors[1].name;
            break;
        case "rgb(" + constColors[2].val + ")":
            titleResult = " = " + constColors[2].name;
            break;
        case "rgb(" + constColors[3].val + ")":
            titleResult = " = " + constColors[3].name;
            break;
        case "rgb(" + constColors[4].val + ")":
            titleResult = " = " + constColors[4].name;
            break;
        case "rgb(" + constColors[5].val + ")":
            titleResult = " = " + constColors[5].name;
            break;
        case "rgb(" + constColors[6].val + ")":
            titleResult = " = " + constColors[6].name;
            break;
        case "rgb(" + constColors[7].val + ")":
            titleResult = " = " + constColors[7].name;
            break;
        case "rgb(" + constColors[8].val + ")":
            titleResult = " = " + constColors[8].name;
            break;
        case "rgb(" + constColors[9].val + ")":
            titleResult = " = " + constColors[9].name;
            break;
        case "rgb(" + constColors[10].val + ")":
            titleResult = " = " + constColors[10].name;
            break;
        case "rgb(" + constColors[11].val + ")":
            titleResult = " = " + constColors[11].name;
            break;
    }

    return titleResult;

}