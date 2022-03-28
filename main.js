// 设置画布

const canvas = document.querySelector('canvas');
const para =document.querySelector('p');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let sprite = 1.5;
let judgment = 0;
let fps=0;
let change = 0;
// 生成随机数的函数

function random(min,max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}


function randomColor() {
  return 'rgb(' +
         random(0, 255) + ', ' +
         random(0, 255) + ', ' +
         random(0, 255) + ')';
}

class shape{
  constructor(x, y, velX, velY, color, size){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
  }
  draw(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, (0+change)*Math.PI, (2-change) * Math.PI);
    ctx.lineTo(this.x, this.y);
    ctx.fill();
  }
 
  
} 

class newball extends shape{
  constructor(x, y, velX, velY, color, size){
    super(x, y, velX, velY, color, size);
    this.exists = true;
  }
  update() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }
  
    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }
  
    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }
  
    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }
  
    this.x += this.velX;
    this.y += this.velY;
  }
  collisionDetect() {
    for (let j = 0; j < balls.length; j++) {
      if (this !== balls[j]) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + balls[j].size&&balls[j].exists===true) {
          balls[j].color = this.color = randomColor();
        }
      }
    }
  }
}

class badball extends shape{
  constructor(x, y, velX, velY, color,size){
    super(x, y, velX, velY,color);
    this.size =size;
  }
  get getsize(){
    return this.size;
  }
  set getsize(newsize){
    this.size=newsize;
  }

  eat() {
    for (let j = 0; j < balls.length; j++) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + balls[j].size) {
          balls[j].exists = false;
          /*if(this.size>balls[j].size){
            this.size+=0.1;
          }*/
          if(this.size<balls[j].size){
            alert("GAME OVER");
           // location.reload(true);
          }
        }
      
    }
  }

  check(){
    if((this.x + this.size) >= width) {
      this.x -= this.size;
    }
  
    if((this.x - this.size) <= 0) {
      this.x += this.size;
    }
  
    if((this.y + this.size) >= height) {
      this.y -= this.size;
    }
  
    if((this.y - this.size) <= 0) {
      this.y += this.size;
    }
  }

  setControls(){
    window.onkeydown = e => {
      switch(e.key) {
        case 'a':
        case 'A':
        case 'ArrowLeft':
          this.x -= this.velX;
          break;
        case 'd':
        case 'D':
        case 'ArrowRight':
          this.x += this.velX;
          break;
        case 'w':
        case 'W':
        case 'ArrowUp':
          this.y -= this.velY;
          break;
        case 's':
        case 'S':
        case 'ArrowDown':
          this.y += this.velY;
          break;
      }
    };
  }
 
}

let balls = [];
//const anthorsize = random(10, 20);
const anthorsize = 20;
let EvilCircle = new badball(
  random(0 + anthorsize, width - anthorsize),
  random(0 + anthorsize, height - anthorsize),
  7,
  7,
  'rgba(255, 255, 255, 0.25)',
  anthorsize
);
EvilCircle.setControls();

while (balls.length < 25) {
    let size = random(10, 20);
    let ball = new newball (
      // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
      random(0 + size, width - size),
      random(0 + size, height - size),
     // random(-7, 7),
     // random(-7, 7),
      random(1, 7),
      random(1, 7),
      randomColor(),
      size
    );
    balls.push(ball);
  }
  
  
  let num=0;
  let numnow=0;
  for (let i = 0; i < balls.length; i++) {
    num+=balls[i].size;
  }
  let shenmodongxi=0;

  function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    EvilCircle.check();
    EvilCircle.draw(); 


    if(fps% 13===0){
      if(sprite<2&&judgment<sprite){
        judgment=sprite;
        sprite+=0.1;
      }
      else if(sprite===1.5&&judgment>sprite){
         judgment=sprite;
         sprite+=0.1;
      }
      else{
        judgment=sprite;
         sprite-=0.1;
      }
  
    }
    fps++;
    change=(2-sprite)/2;
    
  
    
    for (let i = 0; i < balls.length; i++) {
      if(balls[i].exists===true){
        balls[i].draw();
        EvilCircle.eat();
        balls[i].update();
        balls[i].collisionDetect();
      }
      else{
        shenmodongxi+=balls[i].size/5;
        numnow+=1;
        //console.log(`增量为${shenmodongxi}`);
       }
    
    }
    EvilCircle.size=Number(anthorsize)+Number(shenmodongxi);
    para.textContent = '还剩' + (25-numnow)+'个对手';
    numnow=0;
    if(shenmodongxi===num){
      alert("GAME OVER");
    }
    shenmodongxi=0;
    
  
    requestAnimationFrame(loop);
  }

  loop();