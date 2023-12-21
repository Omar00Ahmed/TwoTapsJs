const express = require('express');
const WebSocket = require('ws');
const http = require('http')
const {error} = require('console')
const wordsFile = require('./data/data.json')


const PORT = 3000;
const server = http.createServer(express)
let playersArr = []
let templeave =[]
const wss = new WebSocket.Server({ server })
var ws;
let someoneDrawing = false
var choosenword = 'BakBak';
let WhoDraw;
var pointsToAdd = 10;
let playersAnswered = 0
var answerList = []

var timerInterval;


var waitingToDraw = true

words = wordsFile.words
var drawIndex = 0;
var gameState = false

function randomWord(){
return  words[Math.floor(Math.random()*wordsFile.words.length)]
}



var owner = null;

wss.on('connection',function(ws,req){
    
    const senderClient = ws;
    msgcont = {
        topic:'loadPlayers',
        players:playersArr,
        
    }

    ws.send(JSON.stringify(msgcont))
    // console.log('connection succeded')
    ws.onmessage = function (e) {
        var object = JSON.parse(e.data);

        if(object.topic == 'login'){
            if(playersArr.length == 0  && owner == null && gameState != true){
                ws.send(JSON.stringify({topic:'firstPlayer', cont:'Owner'}))
                owner = object.name
            }else if((playersArr.length > 0 || playersArr.length == 0)  && owner != null && gameState != true){
                ws.send(JSON.stringify({topic:'firstPlayer', cont:'NotOwner'}))
            }
            
            console.log(templeave)
            if(templeave != 0 ){
                for(let i = 0 ; i < templeave.length ; i++){
                    if(templeave[i].playerName == object.name){
                        playersArr.push(templeave[i])
                        templeave.splice(i,1)
                        
                        break
                    }
                    
                }
            }
            else{
                playersArr.push({playerName:object.name,pts:0,avatar:object.avatar})
                console.log(playersArr)
            }
            // console.log(playersArr)
            if(playersArr.includes(object.name))return

            // playersArr.push({playerName:object.name,pts:0})

            let showplayers = {
                topic:'sendPlayers',
                sender:object.name,
                content:playersArr
            }
            console.log(showplayers.content)
            ws.send(JSON.stringify(showplayers))
            // console.log(playersArr)
            
            emit(showplayers)
        }


        else if(object.topic == 'logout' ){
            // console.log('leavedTheRoom')
            for(let i = 0 ; i < playersArr.length ;i++){
                if(object.name == playersArr[i].playerName){
                    // templeave.push(playersArr[i])
                    
                    console.log('someonelogouted')
                    playersArr.splice(i,1)
                    // console.log(playersArr)
                    emit(object,'All')
                    break

                }

            }
            if(playersArr.length == 0){
                gameState = false
                owner = null
                clearInterval(timerInterval)


                msgcont = {
                    topic:'endTime',
                }
                choosenword = Math.random()*156410
                emit(msgcont,'All')
                someoneDrawing = false
                
            }
            if(object.name == owner && gameState != true && playersArr.length == 0){
                if(playersArr.length > 0){
                    let randPlayer = playersArr[Math.floor(Math.random()*playersArr.length)].playerName
                    console.log(randPlayer)
                    msgcont ={
                        topic:"randomOwner",
                        owner:randPlayer
                    }
                    owner = randPlayer
                    emit(msgcont)
                }
                else{
                    owner = null
                }
            }
        }
        else if(object.topic == 'leave'){
            
            for(let i = 0 ; i < playersArr.length ;i++){
                console.log('someone Leaved')
                if(object.name == playersArr[i].playerName){
                    templeave.push(playersArr[i])
                    
                    let showplayers = {
                        topic:'sendPlayers',
                        op:'leave',
                        sender:object.name,
                        content:playersArr
                    }

                    playersArr.splice(i,1)
                    // console.log(playersArr)
                    emit(showplayers)
                    break

                }

                if(playersArr.length == 0){
                    gameState = false
                    owner = null
                    clearInterval(timerInterval)

                    msgcont = {
                        topic:'endTime',
                    }
                    choosenword = Math.random()*156410
                    emit(msgcont,'All')
                    someoneDrawing = false
                    
                }
            }
            if(object.name == owner && gameState != true && (playersArr.length == 0 || playersArr.length > 0)){
                if(playersArr.length > 0){
                    let randPlayer = playersArr[Math.floor(Math.random()*playersArr.length)].playerName
                    console.log(randPlayer)
                    msgcont ={
                        topic:"randomOwner",
                        owner:randPlayer
                    }
                    owner = randPlayer
                    emit(msgcont)
                }
                else{
                    owner = null
                }
            }
        }
        
        else if(object.topic == 'chatMessage'){
            console.log(owner)
            if(object.message == choosenword && !answerList.includes(object.sender) && WhoDraw != object.sender){
                for(let i = 0 ; i < playersArr.length;i++){
                    
                    if(playersArr[i].playerName == object.sender){
                        playersArr[i].pts += pointsToAdd
                        if(pointsToAdd != 3 && pointsToAdd > 3){
                            pointsToAdd = pointsToAdd -1
                        }
                        let drawerinlist =playersArr.findIndex((playerDrawer) => playerDrawer.playerName == WhoDraw)
                        playersArr[drawerinlist].pts += 3
                        console.log(playersArr[drawerinlist].playerName,pointsToAdd)
                        // console.log(playersArr)
                        playersAnswered += 1
                        // console.log(answerList.length)
                        
                        let showplayers = {
                            topic:'renewPoints',
                            sender:object.name,
                            content:playersArr,
                            whoGuess:object.sender
                        }
                        
                        emit(showplayers, 'All')
                        answerList.push(object.sender)

                        if(answerList.length == playersArr.length-1){
                            playersAnswered = 0
                            setTimeout(() => {
                                roundEnd()
                            }, 0);
                        }
                    }
                    
                }
            }else{
                if(object.message == choosenword || (object.message).includes(choosenword)) return
                emit(object,'All')
            }
            
        }
        else if(object.topic == 'drawing' || object.topic == 'stop' || object.topic == 'clear'){
            if(object.sender == WhoDraw){
                emit(object)
            }
            else return
        }
        // else if(object.topic == 'stop'){
        //     emit(object)
        // }
        // else if(object.topic =='clear'){
        //     emit(object)
        // }
        
        else if(object.topic =='roundBeggin'){
            
            roundStart(object)
            gameState = true
        }
        else if(object.topic =='pickWord'){
            console.log('startt')
            begginDraw(object)
        }
        else if(object.topic == 'roundFinish'){
            someoneDrawing = false
        }
        else if(object.topic == 'undo' || object.topic == 'startPos'){
            emit(object,'')
        }

        

        function roundStart(object) {
            console.log('ha')
            if (!someoneDrawing) {
                let wordOne = randomWord();
                let wordTwo = randomWord();
                console.log(wordOne, wordTwo);
                console.log(`the cuurent index is : ${drawIndex}`)
                console.log(playersArr[drawIndex].playerName)
                WhoDraw = playersArr[drawIndex++].playerName;
                if (drawIndex == playersArr.length) {
                    drawIndex = 0;
                }
                
                msgcont = {
                    topic: 'choosenDrawer',
                    drawer: WhoDraw,
                    firWord: wordOne,
                    secWord: wordTwo
                };
        
                emit(msgcont, 'All');
                timerFunc(10,'choose')
            } else {
                let waitmsg = {
                    topic: 'someoneIsDrawing'
                };
                ws.send(JSON.stringify(waitmsg));
            }
        }
        
        function begginDraw(object) {
            clearInterval(timerInterval)
            console.log(WhoDraw);
            console.log('starting');
        
            choosenword = object.word;
            msgcont = {
                topic: 'wordChoosed',
                drawer: WhoDraw,
                word: choosenword
            };
        
            emit(msgcont, 'All');
            console.log(choosenword);
        
            someoneDrawing = true;
            timerFunc();
        }


        function emit(objtoSendTo,stt){
            wss.clients.forEach(function each(client){
                if(stt != 'All'){
                    if(client != ws && client.readyState == WebSocket.OPEN){
                    
                        client.send(JSON.stringify(objtoSendTo))
        
        
                }
                }else{
                    if(client.readyState == WebSocket.OPEN){
                    
                        client.send(JSON.stringify(objtoSendTo))
        
        
                }
                }
            })
        }
        

        function timerFunc(time = 60,state){
            
            var timer = time
             timerInterval = setInterval(() => {
                msgcont = {
                    topic:'timer',
                    time:timer
                }
                emit(msgcont,'All')
                --timer
                if(timer % 20 == 0 && pointsToAdd > 3){
                    pointsToAdd = pointsToAdd - 1
                }
                if(timer == 0 && state == 'choose'){
                    roundEnd('noOneChoosed')
                    
                }else if(timer == 0 && state !='choose'){
                    roundEnd('roundEnd')
                }
                console.log(timer)
            }, 1000);
        }

        function roundEnd(reason){
            var res;
            var nxtplr;

            if(playersArr.length > 0){
                nxtplr = playersArr[drawIndex].playerName
            }else{
                nxtplr = null
            }

            
            clearInterval(timerInterval)
            pointsToAdd = 7;
            answerList.splice(0,answerList.length)
            if(reason == 'noOneChoosed'){
                res = `prev Player didn't choose a word`
            }else{
                res = `round ended , the word was ${choosenword}`
            }
            
            someoneDrawing = false
            const playersWithMoreThan20Pts = playersArr.filter(player => player.pts >= 110);
            
            // check for if round ended or not
            if (playersWithMoreThan20Pts.length > 0) {
                const sortedPlayers = playersArr.slice();
                sortedPlayers.sort((a, b) => b.pts - a.pts);
                
                
                // playersArr.sort((a, b) => b.pts - a.pts);
                // console.log(playersArr)
                // console.log(newArr)
                var firstThreePlayers = []
                for (let i = 0; i < Math.min(3, sortedPlayers.length); i++) {
                    const player = sortedPlayers[i];
                    firstThreePlayers.push([player.playerName,player.pts,player.avatar])
                    player.pts = 0;
                    // console.log(`Player Name: ${player.playerName}, Pts: ${player.pts} , avatar : ${player.avatar}`);
                }
                msgcont = {
                    topic:"GAMEEND",
                    content:firstThreePlayers,
                    owner:owner
                }
                emit(msgcont,'All')
                
                gameState = false
                
                let showplayers = {
                    topic:'sendPlayers',
                    sender:object.name,
                    content:playersArr
                }
                emit(showplayers,'All')
                
                console.log(firstThreePlayers)
                drawIndex = 0
                console.log(drawIndex)
                someoneDrawing = false
            } else {
                
                msgcont = {
                    topic:'endTime',
                    word:choosenword,
                    reason:res,
                    nextPlayer:nxtplr
                }
                choosenword = Math.random()*156410
                emit(msgcont,'All')

                setTimeout(() => {
                    timer = 60
                    roundStart()
                }, 4000);
            }

            
        }
        // console.log(`cordinates : (${object.x},${object.y})`)

        // wss.clients.forEach(function each(client){
        //     if(client != ws && client.readyState == WebSocket.OPEN){
                
        //             client.send(JSON.stringify(object))


        //     }
        // })
    };
})





server.listen(process.env.PORT || PORT,()=>{
    console.log('connection started '+'on port :' +PORT)
})
