var maxContainerWidth = parseFloat($("#container").css("width")) - parseFloat($("#container").css("border")) * 2 - parseFloat($("#player").css("width"));		//maxWidth = container.width - border*2 - player.width
var questFallingTime = 5000;
var lvlNum = parseFloat($("#lvlNum").text());

function levelUp() {
    if (lvlNum >= 10) return;
    questFallingTime -= 450;
    if(lvlNum==3){
        questFallingTime = 5000;
        questDifficult = 2;
    }
    if(lvlNum==8){
        questFallingTime = 5000;
        questDifficult = 3;
    }
    $("#lvlNum").text(++lvlNum);
}
function levelDown() {
    if (lvlNum <= 1) return;
    questFallingTime += 450;
    if(lvlNum<=2){
        questFallingTime = 5000;
        questDifficult = 1;
    }
    if(lvlNum==3){
        questFallingTime = 5000;
        questDifficult = 2;
    }
    if(lvlNum==8){
        questFallingTime = 5000;
        questDifficult = 3;
    }
    $("#lvlNum").text(--lvlNum);
}

var questDifficult = 1;
var questions = [];
var questType = {"plus":"plus", "minus":"minus", "multi":"multi"};
var crnt_quest = [];
// quester();


function randNum(op = "") {
    let num = Math.random();             // 0...1, not include 1
    let x = 1;

    if ( (questDifficult <= 1) || (op === "multi") )
        x = 10
    else if (questDifficult <= 2)
        x = 100
    else if (2 < questDifficult)
        x = 1000
    num *= (x+1);            // num between 0...100
    return Math.floor(num);
}

function randMathOp() {
    let res = Math.random();
    let op;

    if (res <= 0.4)
        op = "plus";
    else if (res <= 0.7)
        op = "minus";
    else if (0.7 < res)
        op = "multi";
    return op;
}

function generateQuest(){
    let questText;
    let ans;
    let op = randMathOp();
    let n1 = randNum();
    let n2 = randNum();

    if (op.toLowerCase() == "plus"){
        ans = n1 + n2;
        questText = n1.toString() + "+" + n2.toString();
    } else if (op.toLowerCase() == "minus"){
        ans = n1 - n2;
        questText = n1.toString() + "-" + n2.toString();
    } else if (op.toLowerCase() == "multi"){
        if(questDifficult >= 2)
            n1 = randNum("multi");
        if(questDifficult == 3)
            n2 = randNum();
        ans = n1 * n2;
        questText = n1.toString() + "*" + n2.toString();
    } else
        console.log("error");
    console.log(questText);
    return [questType[op.toLowerCase()], questText, ans];
}

function displayQuest(quest) {
    $("#questType").text(quest[0]);
    $("#questCounter").text(questions.length+1);
    $("#questText").text(quest[1]);
    $("#questAnswer").empty();
}

function quester(){
    crnt_quest = generateQuest();                   // crnt_quest = [type, questText, ans]
    displayQuest(crnt_quest);
    launchMissile();
    borderFlip($("#questDisplay"), "red");
    // backgroundFlip($("#questDisplay"), "gray", "black");

    // questions.append(crnt_quest.append(user_ans));
}

function borderFlip(elm, clr) {
    elm.css("border", "5px solid " + clr);
    setTimeout(function () {
        elm.css("border", "");
    }, 300);
    // }
}

function generateAnswer() {

    let res = Math.random();
    let imgSrc;
    let n;

    if (res <= 0.3)
        n = crnt_quest[2];                                                    // crnt_quest[2] => ans
    else if (res <= 0.7) n = parseInt(crnt_quest[2]) + Math.floor((Math.random()*5 + 1));
    else if (0.7 < res) n = parseInt(crnt_quest[2]) - Math.floor((Math.random()*5 + 1));
    // imgSrc = "./res/" + n + ".png";
    // return imgSrc;
    // console.log(n);
    return n;
}

function showAnswer(){
    $("#questAnswer").empty().text(crnt_quest[2]);
}

var playerLeftPos;
//player movement functionality
$("body").on("keydown", function (e) {
    playerLeftPos = parseFloat($("#player").css("left"));

    if (e.keyCode === 37 && playerLeftPos > -10)
        playerLeftPos -= 10;
    else if (e.keyCode === 39 && playerLeftPos < maxContainerWidth - 10)
        playerLeftPos += 10;
    $("#player").css("left", playerLeftPos);

    if (e.keyCode === 38)
        playerShoot();
}
)

//player shooting
function playerShoot() {
    let $newShoot = $("<img>").attr("class", "shoot").css("left", (playerLeftPos + 50) + "px").attr("src", "./res/ball.png");
    $("#container").append($newShoot);
    $newShoot.animate({
        top: "20px"
    },
        {
            duration: 3000,
            easing: "linear",
            complete: function () {
                $newShoot.remove();
            },
            progress: function () {
                $(".missile").each(function () {

                    let dx = Math.abs(parseFloat($newShoot.css("left")) - parseFloat($(this).css("left")));
                    if (dx < 40) {
                        let dy = parseFloat($newShoot.css("top")) - parseFloat($(this).css("top"));
                        let isHitted = $(this).attr("data-name");		//מטרת הבדיקה לוודא שטיל שכבר נבחר בפגיעה לא יבחר יריות  נוספות  עד שהוא מתחסל
                        if (dy < 50 && (!(isHitted === "hitted"))) {
                            $(this).attr("data-name", "hitted");
                            let user_ans = $(this).text();
                            let hittedNum = parseInt($(this).text());
                            if(hittedNum === crnt_quest[2])
                                scoreUpdate(crnt_quest[0], "hit");
                            else{
                                scoreUpdate(crnt_quest[0], "miss");
                                backgroundFlip($("#container"), "red");
                            }
                            $(this).css("border","0px").empty().append($("<img>").attr("class", "hit").attr("src", "./res/hit.png"));
                            showAnswer();
                            questions.push(crnt_quest.push(user_ans));
                            for (var i in enemyStopArray)
                                clearTimeout(enemyStopArray[i]);
                            setTimeout(quester, 1000);
                            let $hittedMissile = $(this);
                            setTimeout(function () { $newShoot.remove(); }, 100);
                            setTimeout(function () { $hittedMissile.remove(); $hittedMissile.stop(); }, 200);
                            $newShoot.stop();
                        }
                    }

                })
            }

        })
}

var enemyCounter = 1;

function launchMissile() {
    enemyCounter++;
    if (enemyCounter > 101) {
        for (var i in enemyStopArray)
            clearTimeout(enemyStopArray[i]);
        return;
    }

    let posFromLeft = Math.floor(Math.random() * 2000) % (maxContainerWidth) + 10;
    let newAns = generateAnswer();
    let $newMissile = $("<div>").attr({"class": "missile","dir":"ltr"}).css("left", posFromLeft + "px").text(newAns);
    if ( (newAns >= 100) || (newAns < -9) )
        $newMissile.css("font-size","25px");
    if ( (newAns >= 1000) || (newAns < -99) )
        $newMissile.css("font-size","20px");
    // let $newMissile = $("<img>").attr("class", "missile").css("left", posFromLeft + "px").attr("src", lotEnemy());
    $("#container").append($newMissile);
    $newMissile.animate({
        top: "300px"
    },
        {
            duration: questFallingTime,
            easing: "linear",
            complete: function () {
                // scoreUpdate($(this).attr("src").substr(6, 3), "miss");
                // backgroundFlip($("#container"), "red");
                // $newMissile.attr("class","boom");
                setTimeout(function () {
                    $newMissile.remove();
                }, 50);
            },
            progress: function () {
                if (isNewGame) {
                    $(this).stop();
                    $(this).remove();
                }
            }

        })
    if (enemyCounter < 100) {
        enemyStopArray.push(setTimeout(launchMissile, 2000));
        if (enemyCounter % 10 === 0)
            levelUp();
    }
}
var enemyStopArray = [];
function backgroundFlip(elm, clr, def_clr = "white") {
    // elm.css("background-color","white");
    // let prv = elm.css("background-color");
    // if(!(prv==="red"||prv==="green")){				//check if still iterating a previous flip
    elm.css("background-color", clr);
    setTimeout(function () {
        elm.css("background-color", def_clr);
    }, 100);
    // }
}

function scoreUpdate(str, operation) {
    let $elm = $("#" + str + "_hits");
    $elm.children().eq(0).text(parseFloat($elm.children().eq(0).text()) + 1);
    allHitsUpdate(0);
    if (operation === "hit") {
        $elm.children().eq(1).text(parseFloat($elm.children().eq(1).text()) + 1);
        allHitsUpdate(1);
        ptsUpdate(str);
        backgroundFlip($elm, "green");
    }
    else if (operation === "miss") {
        backgroundFlip($elm, "red");
    }
}

function allHitsUpdate(n) {
    if (n === 0 || n === 1)
        $("#all_hits").children().eq(n).text(parseFloat($("#all_hits").children().eq(n).text()) + 1);

}

function ptsUpdate(who) {
    let n;
    switch (who) {
        case "plus":
            n = 1;
            break;
        case "minus":
            n = 2;
            break;
        case "multi":
            n = 4;
            break;
    }
    $("#" + who + "_pts").text(n * parseFloat($("#" + who + "_hits").children().eq(0).text()));
    $("#all_pts").text(parseFloat($("#all_pts").text()) + n);
    if (parseFloat($("#all_pts").text()) > parseFloat($("#HighScore").text()))
        $("#HighScore").text($("#all_pts").text());
}

var $defaultStat = $("#stat").html();
var $defaultContainer = $("#container").html();
var isNewGame = false;
function newGame() {
    for (var i in enemyStopArray)
        clearTimeout(enemyStopArray[i]);
    enemyStopArray = [];
    isNewGame = true;
    $("#stat").html($defaultStat);
    $("#container").html($defaultContainer);
    setTimeout(function () {
        isNewGame = false;
        enemyCounter = 1;
        questFallingTime = 5000;
        lvlNum = 1;
        var questDifficult = 1;
        var questions = [];
        var crnt_quest = [];
        $("#lvlNum").text(1);
        quester();
        // launchMissile();
    }, 200);
}

$(document).ready(quester);
