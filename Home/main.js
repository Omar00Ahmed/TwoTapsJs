const canvas = document.getElementById('canvas');
const ctx =canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let spots = [];
let hue = 30;

var chooseenChar;
const loginBtn = document.getElementById('startPlay')
const loginInput = document.getElementById('loginInput')


window.onload = function(){
    if(localStorage.getItem('darkState') == 'True'){
        document.body.classList.add('dark')
    }

}

const mouse ={
    x: undefined,
    y: undefined
}
canvas.addEventListener('mousemove',function (event){
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i =0; i < 2; i++){
        spots.push(new particle());
    }
});
class particle{
    constructor(){
        this.x = mouse.x;
        this.y =mouse.y;
        this.size = Math.random()* 30 +0.1;
        this.speedx = Math.random()* 2 - 1;
        this.speedy = Math.random()* 2 - 1;
        this.color =`#${hue}ffff45`;
    }
   update(){
    this.x += this.speedx;
    this.y += this.speedy;
    if(this.size > 0.2) this.size -=0.2;
   } 
   draw(){
    ctx.beginPath();
    ctx.fillStyle =this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.arc(this.x, this.y ,this.size,0,Math.PI*2);
    ctx.shadow
    ctx.fill();

   }
}
function handleparticle(){
    for (let i =0; i < spots.length; i++){
    spots[i].update();
    // spots[i].draw();
    for (let j =i; j < spots.length; j++){
        const dx =spots[i].x - spots[j].x;
        const dy =spots[i].y - spots[j].y;
        const distance = Math.sqrt(dx *dx + dy * dy);
        if (distance < 60){
            ctx.beginPath();
            
            ctx.strokeStyle = '#70f1fa50';
            ctx.lineWidth = spots[i].size / 5;
            
            ctx.moveTo(spots[i].x, spots[i].y);
            ctx.lineTo(spots[j].x, spots[j].y);
            ctx.stroke();
        }
    }
    if(spots[i].size <= 0.3){
        spots.splice(i, 1); i--;

    }
}
}
function animate(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    handleparticle();
    hue++;
    requestAnimationFrame(animate)
}
window.addEventListener('resize',function(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    // init();

} )
window.addEventListener('mouseout', function(){
    mouse.x = undefined;
    mouse.y = undefined;

})

animate()

let cont = document.getElementById('loginCont')




let avatarsList = document.querySelectorAll('[data-avatar]')

avatarsList.forEach(avatar =>{
    avatar.addEventListener('click',()=>{
        avatarsList.forEach(all=>{
            all.style.border = ''
            all.style.padding = '10px'
            chooseenChar = null
        })
        avatar.style.border = '5px dotted #3586ff'
        avatar.style.padding = '0'
        chooseenChar = avatar.dataset.avatar;
    })
})

loginBtn.addEventListener('click',()=>{
    if(loginInput.value == ''){
        loginInput.placeholder = 'Please Fill the Name Input'
        loginInput.style.borderBottom = 'red solid 2px'
    }
    
    else{
        if(chooseenChar == null){
            chooseenChar = Math.floor(Math.random() *(22-2) + 2)
        }
        localStorage.setItem('Name',loginInput.value)
        localStorage.setItem('Avatar',chooseenChar)
        window.location.href = '../play/index.html'
        console.log('login success')
    }
})

var darkElements = document.querySelectorAll('[data-dark]')
const darkModeButton = document.getElementById('darkBtn')
let darkState = localStorage.getItem('darkState')
function dark(state){
    console.log(darkState)
    
    if(darkState == 'True'){
        document.body.classList.remove('dark')
        localStorage.setItem('darkState','false')
        darkState = 'False'
        
    }
    else{
        document.body.classList.add('dark')
        localStorage.setItem('darkState','True')
        darkState = 'True'
    }
    
    
    // console.log(DrawArea.style.background)


    darkModeButton.textContent = (darkModeButton.textContent === 'dark') ? 'light' : 'dark';

}

darkModeButton.addEventListener('click',()=>{
    dark()
})