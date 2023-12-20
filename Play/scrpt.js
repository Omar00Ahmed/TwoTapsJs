// const { json } = require("express")

let pageContainer = document.getElementById('pageContainer')
let DrawArea = document.getElementById('DrawArea')
var playerInfopts;
var playerInfoName;
var playerInfoImage;
var starterTimer;
var infoBoxTimerEnd = 3;
window.onload = ()=>{
    dark('load')
    function getAspectRatio(width, height) {
        var ratio = width / height;
        return ( Math.abs( ratio - 4 / 3 ) < Math.abs( ratio - 16 / 9 ) ) ? '4:3' : '16:9';
    }

    getAspectRatio(screen.width,screen.height)
    if(getAspectRatio(screen.width,screen.height) == '4:3'){
        pageContainer.style.width = `${screen.width * 0.9}px`
        pageContainer.style.height = `${screen.height * 0.8}px`
    }else{
        pageContainer.style.width = `${screen.width * 0.75}px`
        pageContainer.style.height = `${screen.height * 0.95}px`
    }
    c.width = DrawArea.offsetWidth 
    c.height = DrawArea.offsetHeight
    DrawArea.style.background = '#fff'
    if(!localStorage.getItem('Name')){
        pageContainer.style.display = `none`
    }else{
        pageContainer.style.display = `grid`
    }

    playerInfoName = document.getElementById('playerInfoName')
    playerInfopts = document.getElementById('playerInfopts')
    playerInfoImage = document.getElementById('playerInfoImage')

    playerInfoName.innerHTML = `${localStorage.getItem('Name')}`
    playerInfoImage.setAttribute('src',`../images/Avatars/${localStorage.getItem('Avatar')}.png`)
}
/** @type {HTMLCanvasElement} */
var c = document.getElementById('canvs')
/**@type {CanvasRenderingContext2D} */
var ctx = c.getContext('2d',{ willReadFrequently: true })

let ws;

var object;

var userName = localStorage.getItem('Name');

// const sendBtn = document.getElementById('sendBtn')
const loginBtn = document.getElementById('login-btn')
const logoutBtn = document.getElementById('logoutBtn')
const loginInput = document.getElementById('loginInput')
// const drawarea = document.getElementById('drawarea')
const playersContainer = document.getElementById('playerList')
const counter = document.getElementById('timer')

var requestToDrawSound;

init()

function login(){
    
    
    if(localStorage.getItem('Name') == null){
        window.location.href = '../Home'
    }else{
        msgcont = {
            topic:'login',
            name:localStorage.getItem('Name'),
            avatar:localStorage.getItem('Avatar')
        }

        pageContainer.style.display = 'grid'
        setTimeout(() => {
            ws.send(JSON.stringify(msgcont))  
        }, 100);
        userName = localStorage.getItem('Name');
    }
    // loginBtn.addEventListener('click',()=>{
        
        
    //         let nameValue = loginInput.value
    //         // console.log(nameValue)
    //         localStorage.setItem("Name", nameValue);
                        
                
    //             // console.log(localStorage.getItem('Name'))

    //             msgcont = {
    //                 topic:'login',
    //                 sender:nameValue,
    //                 name:localStorage.getItem('Name')
    //             }

    //             authContainer.remove()
    //             pageContainer.style.display = 'grid'
    //             userName = localStorage.getItem('Name');
    //             ws.send(JSON.stringify(msgcont))
            
        
    // })
}



logoutBtn.addEventListener('click',()=>{
    logout('logout')
})
let outState = true

function logout(state){

    
    
    if(state == 'logout'){
        dsgcont = {
            topic:'logout',
            name:localStorage.getItem('Name')
        }
        ws.send(JSON.stringify(dsgcont))
        ws.close();
        // outState = false
        setTimeout(() => {
            window.location.href = '../Home'
        }, 100);
        
    }
    else if(state == 'leave'){
        msgcont = {
            topic:'leave',
            name:localStorage.getItem('Name')
        } 
        ws.send(JSON.stringify(msgcont))
        ws.close();

    }

    
    
    ws = null
}

const pageHideListener = (event) => {
    logout('leave')
};

window.addEventListener("beforeunload", function(){
    if(outState = true){
        pageHideListener()
    }
    else{
        return
    }
});


function init(){
    if(ws){
        ws.onerror = ws.open = ws.onclose = null;
        ws.close();
    }

    ws = new WebSocket('ws://0.tcp.eu.ngrok.io:14489')
    ws.binaryType = 'arraybuffer';
    ws.onopen = () =>{
        
    console.log('connection opened !')
    login()

        
    }
    
    ws.onclose = function(){
        ws = null
    }

}



        var ownState = false
        const chatContainer = document.getElementById('chatMessages')
        const chatInput = document.getElementById('chatInput')
        const buttonInput = document.getElementById('chatButtonInput')

        var requestButton;
        function startTheRound(){
            
                requestButton = document.getElementById('StartTheGame')
            

                requestButton.addEventListener('click',()=>{
                    request()
                    console.log('done')
                })
            

        }

        function request(){
                
                
            msgcont = {
                topic:'roundBeggin',
                sender:userName,
            }
            console.log('ok')
            ws.send(JSON.stringify(msgcont))
        
        }
        
        
        


        
        buttonInput.addEventListener('click',()=>{
            sendMessage()
        })


        chatInput.addEventListener('keydown',function(e){
            if(e.key == 'Enter'){
                sendMessage()
            }
        })

        function sendMessage(){
            if(chatInput.value != ''){
                userName = localStorage.getItem('Name')
            messageToSend = chatInput.value
            msgcont = {
                topic:'chatMessage',
                sender:userName,
                message:messageToSend
            }
            ws.send(JSON.stringify(msgcont))
            // showMessage(msgcont.sender,msgcont.message)
            chatInput.value = ''
            }else return
        }

        function showMessage(sender,messagetorecieve,state){
            let msg = document.createElement('p')
            if(state =='login'){

                msg.innerHTML =`${sender} has joined the room , say hello`
                msg.classList.add('joining')

                chatContainer.appendChild(msg)
                chatContainer.scrollTop = chatContainer.scrollHeight;
                

                
            }
            else if(state == 'hitRight'){
                msg.innerHTML =`${sender} hit The right anwser , congratulations`
                msg.classList.add('hitRight')

                chatContainer.appendChild(msg)
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
            else{
                msg.innerHTML = `${sender} : ${messagetorecieve}`
                msg.classList.add('user')
                chatContainer.appendChild(msg)
                chatContainer.scrollTop = chatContainer.scrollHeight;
                
            }

            
            
        }


let painting = false;
    const clrBtn = document.getElementById('clr')
    const lineColor = document.getElementById('lineColor')
    const lineWidth = 1

    const smallwidth = document.getElementById('smallLine')
    const mediumwidth = document.getElementById('medLine')
    const largewidth = document.getElementById('largeLine')
    const nameOfDrawer =document.getElementById('nameOfDrawer')
    const Word = document.getElementById('Word')

    // let playersArr =[]

    let drawstate = false
    // const spinDrawer = document.getElementById('spinDrawer')

    // spinDrawer.addEventListener('click',()=>{
    //     msgcont = {
    //         topic:'spinDraw',
    //         whoask:userName
    //     }
    //     ws.send(JSON.stringify(msgcont))
    // })

    let inputRange = document.getElementById('lineWidth')
    
    let lines = []; // Array to store drawn lines
    let currentIndex = -1; // Index of the currently drawn line

function startposition(e) {
    if (!drawstate) return;
    lines.push(ctx.getImageData(0, 0, c.width, c.height));
    currentIndex = lines.length  ;
    if (drawstate == true) {
        painting = true;
    }
    let pos = getMousePos(c, e);
    ctx.moveTo(pos.x, pos.y);
    setTimeout(() => {
        draw(e);
    }, 0);
    msgcont = {
        topic:'startPos',
        x:pos.x,
        y:pos.y,
        sender:userName
    }
    ws.send(JSON.stringify(msgcont))
}

function endposition() {
    // if(!drawstate)return
    
    ctx.restore();
    painting = false;
    ctx.beginPath();

    let msgcont = {
        topic: 'stop',
        state: false,
        op: ctx.beginPath(),
        sender:userName
        
    };

    
    ws.send(JSON.stringify(msgcont));

    
}

function undo() {
    if (currentIndex > 0) {
        if(lines.length == 0)return

        currentIndex--;
        ctx.putImageData(lines[currentIndex], 0, 0);

        
        
    }
}

function draw(e) {
    // console.log(lines)
    if (!painting) return;
    
    let pos = getMousePos(c, e);
    ctx.lineWidth = inputRange.value;

    ctx.lineTo(pos.x, pos.y);

    ctx.strokeStyle = lineColor.value;
    ctx.lineCap = 'round';
    ctx.stroke();

    let msgcont = {
        topic: 'drawing',
        sender:userName,
        x: pos.x,
        y: pos.y,
        storkewidth: inputRange.value,
        color: lineColor.value,
    };
    
    ws.send(JSON.stringify(msgcont));
    
}

// Add event listeners
c.addEventListener('mousedown', startposition);
c.addEventListener('mouseup', endposition);
c.addEventListener('mousemove', draw);

// Undo button event listener
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z' && drawstate == true) {
        undo();
        let msgcont = {
            topic: 'undo',
            sender:userName
        };
        ws.send(JSON.stringify(msgcont));
        // lines.splice(0,lines.length);
    }
});

// Clear button event listener
clrBtn.addEventListener('click', () => {
    if (drawstate) {
        ctx.beginPath();
        ctx.clearRect(0, 0, c.width, c.height);
        currentIndex = -1;
        lines = [];

        let msgcont = {
            topic: 'clear',
            sender:userName
        };
        ws.send(JSON.stringify(msgcont));
    }
});


    function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
    }

    ws.onmessage = function (e) {
        object = JSON.parse(e.data);
        // console.log(object)
        if(object.topic =='startPos'){
            lines.push(ctx.getImageData(0, 0, c.width, c.height));
            currentIndex = lines.length  ;
            ctx.moveTo(object.x, object.y);

        }
        else if(object.topic == 'firstPlayer'){
            if(object.cont == 'Owner'){
                infBoxIn(`<img src="../images/Start.png" alt="" id="StartTheGame">`,'not')
                ownState = true
                startTheRound()
            }else{
                console.log('not owner')
                infBoxIn(`waiting for the owner to start the game`,'not')
            }
        }
        else if(object.topic == 'randomOwner'){
            if(object.owner == userName){
                infBoxIn(`<img src="../images/Start.png" alt="" id="StartTheGame">`,'not')
                ownState = true
                startTheRound()
            }
        }
        else if(object.topic == 'drawing'){
            ctx.lineWidth = object.storkewidth
            ctx.lineTo(object.x,object.y)
            ctx.strokeStyle = object.color
            ctx.lineCap = 'round'
            ctx.stroke()
            console.log('work')
        }
        else if(object.topic =='stop'){
            ctx.beginPath()

            
            
        }
        else if(object.topic =='clear'){
            ctx.beginPath();
            ctx.clearRect(0,0,c.width,c.height)
            lines = []
        }
        else if(object.topic =='sendPlayers'){
            // console.log('reached')
            PlayersLoad(object.content)
            // console.log(object)
            if(object.op != 'leave'){
                showMessage(object.sender,'','login')
            }
            if(object.loginState = 'NewLogin'){
                document.getElementById('entering').play()
            }

        }
        else if(object.topic =='logout'){
            let playerOut = object.name
            // console.log(playersContainer.childNodes[0].querySelector('.playerName'))

            for(let i = 0 ; i < playersContainer.childNodes.length;i++){
            if(playersContainer.childNodes[i].querySelector('.playerName').innerHTML == playerOut){
                playersContainer.removeChild(playersContainer.childNodes[i])
                break
            }
            }
            
        }
        else if(object.topic =='renewPoints'){
            let addingpointSound = document.getElementById('addingPointSound')
            addingpointSound.play()
            PlayersLoad(object.content)
            showMessage(object.whoGuess,'','hitRight')
        }

        // else if(object.topic =='loadPlayers'){
        //     console.log(object.randWord)
        // }

        else if(object.topic == 'chatMessage'){
            showMessage(object.sender,object.message,'1')
        }
        else if(object.topic == 'acceptSpin'){
            if(object.Chosen == localStorage.getItem('Name')){
                drawstate = true
            }
            else{
                drawstate = false
            }
        }
        else if(object.topic == 'choosenDrawer'){

            if(object.drawer == userName){
                chooseWord(object.firWord,object.secWord)
            }else return


            
        }
        else if(object.topic == 'wordChoosed'){
            lines.splice(0,lines.length)
            requestToDrawSound = document.getElementById('requestSound')
            requestToDrawSound.play()
            // console.log('wasss')
            if(userName == object.drawer){
                drawstate = true
                console.log(`your word is ${object.word}`)
                let infoBox = document.getElementById('infoBox')
                infoBox.innerHTML= `you requested to draw ${object.word}`
                infoBox.classList.add('move')
                Word.innerHTML = `is drawing ${object.word}`
                setTimeout(() => {
                    infoBox.classList.remove('move')
                }, 2000);
            }
            nameOfDrawer.innerHTML = object.drawer
            clearInfBox()
            // counterFunc()
        }
        else if(object.topic == 'someoneIsDrawing'){
            console.log('please Wait anotherOne is drawing , wait until he finish')
        }
        else if(object.topic == 'timer'){
            counter.innerHTML = object.time
            // console.log(object.time)
            if(object.time < 10){
                let tiksound = document.getElementById('tikAudio')
                tiksound.play()
            }
        }
        else if(object.topic == 'endTime'){
            painting = false
            if(object.nextPlayer == userName){
                // infBoxIn('Round Ended ,next round Starts in 3 seconds','not')

                starterTimer = setInterval(() => {
                    infBoxIn(`Round Ended ,next round Starts in ${infoBoxTimerEnd--} seconds`,'not')
                    if(infoBoxTimerEnd == 0){
                        clearInterval(starterTimer);
                        infoBoxTimerEnd = 3;
                    }
                }, 1000);
            }
            else{
                // infBoxIn('Round Ended ,next round Starts in 3 seconds','timed')
                starterTimer = setInterval(() => {
                    infBoxIn(`Round Ended ,next round Starts in ${infoBoxTimerEnd--} seconds`,'timed')
                    if(infoBoxTimerEnd == 0){
                        clearInterval(starterTimer);
                        infoBoxTimerEnd = 3;
                    }
                }, 1000);
            }

            showMessage('system',`${object.reason}`,'')
            let conft = confetti.create(c)
            conft({
                particleCount: 200,
                startVelocity: 30,
                spread: 360,
                resize: true,
                useWorker: true,
            })
            // console.log('ended')
            counter.innerHTML = '---'
            ctx.beginPath();
            ctx.clearRect(0,0,c.width,c.height)
            nameOfDrawer.innerHTML = 'no one'
            Word.innerHTML =`is drawing ...`
            drawstate = false
            requestToDrawSound.play()
            drawstate = false
            lines.splice(0,lines.length)
        }
        else if(object.topic == 'undo'){
            // console.log('hello')
            undo()
        }
        
    };
    
    function PlayersLoad(players){
        playersContainer.innerHTML = ''
        playersArr = players
        playersArr.sort((a, b) => b.pts - a.pts)
        for(let i = 0 ; i < playersArr.length ;i++){
            let apended =  document.createElement('div')
            apended.innerHTML = playersArr[i]
            apended.classList.add('player')
            apended.innerHTML = `
            <div class="playerImage">
                    <img src="../images/Avatars/${playersArr[i].avatar}.png" alt="">
                </div>
                
                <div class="playerDetails">
                    <p class="playerName"  data-playerName='${playersArr[i].playerName}'>${playersArr[i].playerName}</p>
                    <p class="playerPoints" id="playerPoints">${playersArr[i].pts}</p>
                </div>

                <div class="playerRequest"></div>
            `
            playersContainer.appendChild(apended)

            if(userName == playersArr[i].playerName){
                
                playerInfopts.innerHTML = `#${i+1}`
            }
        }
}


var darkElements = document.querySelectorAll('[data-dark]')
const darkModeButton = document.getElementById('buttonD')
let darkState;
function dark(state){
    
    if(state == 'btn'){
        darkState = localStorage.getItem('darkState')
        if(darkState == 'True'){
            localStorage.setItem('darkState','False')
        }else{
            localStorage.setItem('darkState','True')
        }
        document.body.classList.toggle('dark');
        darkElements.forEach(ele =>{
            ele.classList.toggle('dark')
        })
        // console.log(DrawArea.style.background)
        if(DrawArea.style.background == 'rgb(255, 255, 255)'){
            DrawArea.style.background = '#eee'
        }else{
            DrawArea.style.background = '#fff'
        }

        darkModeButton.textContent = (darkModeButton.textContent === 'Dark') ? 'light' : 'Dark';
        
    }else{
        darkState = localStorage.getItem('darkState')
        if(darkState == 'True'){
            document.body.classList.toggle('dark');
            darkElements.forEach(ele =>{
                ele.classList.add('dark')
                darkModeButton.textContent = 'light'
            })
            DrawArea.style.background = '#eee'
        }
    }
    

}



function chooseWord(firWord,SecWord){
    let inner = `
    <span>Choose a word to draw</span>
    <div class="words">
        <div class="askingWord" id="firstWord">${firWord}</div>
        <div class="askingWord" id="secondWord">${SecWord}</div>
    </div>
    `
    infBoxIn(inner,'not',10000)
    let words = [
        document.querySelector('#firstWord'),
        document.querySelector('#secondWord')
    ]
    words.forEach(word =>{
        word.addEventListener('click',()=>{
            console.log('what?')
            msgcont = {
                topic:'pickWord',
                word:word.innerHTML
            }
            ws.send(JSON.stringify(msgcont))
            clearInfBox()
        })
    })
    
}



function updateColor() {
    var colorPicker = document.getElementById('lineColor');
    var colorDisplay = document.getElementById('colorDisplay');
    colorDisplay.style.backgroundColor = colorPicker.value;
  }

darkModeButton.addEventListener('click',function(){
    dark('btn')
})

function infBoxIn(text,state,time = 3000){
    infoBox.innerHTML =text
    infoBox.classList.add('move')
    if(state == 'timed'){
        setTimeout(() => {
            infoBox.classList.remove('move')
        }, time);
    }
}

function clearInfBox(){
    infoBox.innerHTML = ''
    infoBox.classList.remove('move')
}



// console.log(document.querySelectorAll('[data-dark]'))


