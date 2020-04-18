let drawDis = 500
let yar = 0
let speed = 0.09
let jumpV=0
let old
let chunks = []
let me
let pitch = 0
let ahh = true
function setup(){
    me = new createVector(0,0,0)
    chunks.push(new chunk(new createVector(0,0,0)))
    main = chunks[0]
    main.dis = 0
    chunks.push(new chunk(new createVector(32,0,0)))
    chunks.push(new chunk(new createVector(-32,0,0)))
    chunks.push(new chunk(new createVector(0,0,32)))
    chunks.push(new chunk(new createVector(0,0,-32)))
    createCanvas(screen.width,screen.height-150)
}
function sorter(list){
    let sorted = true
    while(sorted){
        sorted = false
        for(let i=0;i<list.length-1;i++){
            if(list[i].dis<list[i+1].dis){
                let temp = list[i]
                list[i] = list[i+1]
                list[i+1] = temp
                sorted = true
            }
        }
    }
    if(main != list[list.length-1]){
        main = list[list.length-1]
        let xL = [0,32,0,-32]
        let zL = [32,0,-32,0]
        let newList = []
        for(let i = 0;i<4;i++){
            if(!((list[list.length-2].cent.x == list[list.length-1].cent.x+xL[i]) && (list[list.length-2].cent.z ==list[list.length-1].cent.z+zL[i]))){
                newList.push(new chunk(new createVector(list[list.length-1].cent.x+xL[i],list[list.length-1].cent.y,list[list.length-1].cent.z+zL[i])))
            }
        }
        list = (newList.concat(list[list.length-2])).concat(list[list.length-1])
    }
    return(list)
}
function draw(){
    chunks = sorter(chunks)
    background(0)
    for(let i = 0; i<chunks.length;i++){
        chunks[i].draw(drawDis,yar,pitch,me)
    }
    me.y -=jumpV - 0.0078125
    jumpV -=0.015625
    if(me.y>=0){
        me.y =0
        jumpV =0
    }
    if(keyIsDown(87)){
        moveL(speed,speed)
    }
    if(keyIsDown(83)){
        moveL(-speed,-speed)
    }
    if(keyIsDown(32)&& me.y==0){
        jumpV = 0.15
    }
    if(keyIsDown(65)){
        moveS(-speed,speed)
    }
    if(keyIsDown(68)){
        moveS(speed,-speed)
    }
    if(keyIsDown(LEFT_ARROW)){
        yar-=0.05
    }
    if(keyIsDown(RIGHT_ARROW)){
        yar+=0.05
    }
    if(ahh){
        let mx = mouseX -width
        if(mx!=0){
            mx = mx*Math.PI/100
            
        }
    }
}
function moveL(x,y){
    me.x+=x*Math.sin(yar)
        me.z+=y*Math.cos(yar)
        if(chunks[chunks.length-1].walls[chunks[chunks.length-1].walls.length-1].dis<1 || chunks[chunks.length-2].walls[chunks[chunks.length-2].walls.length-1].dis<1){
            me.x-=2.5*x*Math.sin(yar)
            me.z-=2.5*y*Math.cos(yar)
        }
}
function moveS(x,y){
    me.x+=x*Math.cos(yar)
        me.z+=y*Math.sin(yar)
        if(chunks[chunks.length-1].walls[chunks[chunks.length-1].walls.length-1].dis<1 || chunks[chunks.length-2].walls[chunks[chunks.length-2].walls.length-1].dis<1){
            me.x-=2.5*x*Math.cos(yar)
            me.z-=2.5*y*Math.sin(yar)
        }
}
function keyPressed() {
    switch (key){
      case "k":
        ahh = !ahh
      break;
    }
  }
class tri{
    constructor(p1,p2,p3){
        this.cent = new createVector((p1.x+p2.x+p3.x)/3,(p1.y+p2.y+p3.y)/3,(p1.z+p2.z+p3.z)/3)
        this.dis
        this.points = [p1,p2,p3]
    }
    draw(d,yar,pitch,me){
        beginShape()
        this.dis = Math.sqrt(Math.pow(this.cent.x-me.x,2)+Math.pow(this.cent.y-me.y,2)+Math.pow(this.cent.z-me.z,2))
        fill(color(255*(0.125-(this.dis/400)),255*(0.125-(this.dis/400)),255*(0.125-(this.dis/400))))
        stroke(255*(0.125-(this.dis/400)),255*(0.125-(this.dis/400)),255*(0.125-(this.dis/400)))
        for(let i =0;i<3;i++){
            let lamb = d/(((this.points[i].x-me.x)*Math.sin(yar))+((this.points[i].z-me.z)*Math.cos(yar)))
            let x1 =(this.points[i].x-me.x)*lamb
            let z1 = (this.points[i].z-me.z)*lamb
            let x = (x1*Math.cos(yar))-(Math.sin(yar)*z1)
            let z = (x1*Math.sin(yar))+(Math.cos(yar)*z1)
            let lam = d / z
            x = x * lam
            let y = (this.points[i].y-me.y)*lamb
            if(lamb>0){vertex((width/2)+x,(height/2)+y)}
        }
        endShape(CLOSE)
    }
}
class chunk{
    constructor(mid){
        this.cent = mid
        this.dis = 1
        this.walls = []
        this.walls.push(new tri(new createVector(mid.x,mid.y-2,mid.z),new createVector(mid.x,mid.y-2,mid.z +2),new createVector(mid.x+2.5,mid.y-1,mid.z +2)))
        this.walls.push(new tri(new createVector(mid.x,mid.y-2,mid.z),new createVector(mid.x,mid.y-2,mid.z +2),new createVector(mid.x-2.5,mid.y-1,mid.z +2)))
        this.walls.push(new tri(new createVector(mid.x,mid.y-2,mid.z),new createVector(mid.x,mid.y-2,mid.z -2),new createVector(mid.x+2.5,mid.y-1,mid.z -2)))
        this.walls.push(new tri(new createVector(mid.x,mid.y-2,mid.z),new createVector(mid.x,mid.y-2,mid.z -2),new createVector(mid.x-2.5,mid.y-1,mid.z -2)))
        this.walls.push(new tri(new createVector(mid.x,mid.y-2,mid.z),new createVector(mid.x+2,mid.y-2,mid.z),new createVector(mid.x+2,mid.y-1,mid.z +2.5)))
        this.walls.push(new tri(new createVector(mid.x,mid.y-2,mid.z),new createVector(mid.x+2,mid.y-2,mid.z),new createVector(mid.x+2,mid.y-1,mid.z -2.5)))
        this.walls.push(new tri(new createVector(mid.x,mid.y-2,mid.z),new createVector(mid.x-2,mid.y-2,mid.z),new createVector(mid.x-2,mid.y-1,mid.z +2.5)))
        this.walls.push(new tri(new createVector(mid.x,mid.y-2,mid.z),new createVector(mid.x-2,mid.y-2,mid.z),new createVector(mid.x-2,mid.y-1,mid.z -2.5)))
        for(let i =1;i<15;i++){
            this.walls.push(new tri(new createVector(mid.x-2,mid.y+1,mid.z +(i*2)),new createVector(mid.x-2.5,mid.y-1,mid.z +(i*2)),new createVector(mid.x-2.5,mid.y-1,mid.z +((i+1)*2))))
            this.walls.push(new tri(new createVector(mid.x-2,mid.y+1,mid.z +((i+1)*2)),new createVector(mid.x-2,mid.y+1,mid.z +((i)*2)),new createVector(mid.x-2.5,mid.y-1,mid.z +((i+1)*2))))
            this.walls.push(new tri(new createVector(mid.x+2,mid.y+1,mid.z +(i*2)),new createVector(mid.x+2.5,mid.y-1,mid.z +(i*2)),new createVector(mid.x+2.5,mid.y-1,mid.z +((i+1)*2))))
            this.walls.push(new tri(new createVector(mid.x+2,mid.y+1,mid.z +((i+1)*2)),new createVector(mid.x+2,mid.y+1,mid.z +((i)*2)),new createVector(mid.x+2.5,mid.y-1,mid.z +((i+1)*2))))
            this.walls.push(new tri(new createVector(mid.x,mid.y-2,mid.z +(i*2)),new createVector(mid.x+2.5,mid.y-1,mid.z +(i*2)),new createVector(mid.x+2.5,mid.y-1,mid.z +((i+1)*2))))
            this.walls.push(new tri(new createVector(mid.x,mid.y-2,mid.z +((i+1)*2)),new createVector(mid.x,mid.y-2,mid.z +((i)*2)),new createVector(mid.x+2.5,mid.y-1,mid.z +((i+1)*2))))
            this.walls.push(new tri(new createVector(mid.x,mid.y-2,mid.z +(i*2)),new createVector(mid.x-2.5,mid.y-1,mid.z +(i*2)),new createVector(mid.x-2.5,mid.y-1,mid.z +((i+1)*2))))
            this.walls.push(new tri(new createVector(mid.x,mid.y-2,mid.z +((i+1)*2)),new createVector(mid.x,mid.y-2,mid.z +((i)*2)),new createVector(mid.x-2.5,mid.y-1,mid.z +((i+1)*2))))
            //
            this.walls.push(new tri(new createVector(mid.x-2,mid.y+1,mid.z -(i*2)),new createVector(mid.x-2.5,mid.y-1,mid.z -(i*2)),new createVector(mid.x-2.5,mid.y-1,mid.z -((i+1)*2))))
            this.walls.push(new tri(new createVector(mid.x-2,mid.y+1,mid.z -((i+1)*2)),new createVector(mid.x-2,mid.y+1,mid.z -((i)*2)),new createVector(mid.x-2.5,mid.y-1,mid.z -((i+1)*2))))
            this.walls.push(new tri(new createVector(mid.x+2,mid.y+1,mid.z -(i*2)),new createVector(mid.x+2.5,mid.y-1,mid.z -(i*2)),new createVector(mid.x+2.5,mid.y-1,mid.z -((i+1)*2))))
            this.walls.push(new tri(new createVector(mid.x+2,mid.y+1,mid.z -((i+1)*2)),new createVector(mid.x+2,mid.y+1,mid.z -((i)*2)),new createVector(mid.x+2.5,mid.y-1,mid.z -((i+1)*2))))
            this.walls.push(new tri(new createVector(mid.x,mid.y-2,mid.z -(i*2)),new createVector(mid.x+2.5,mid.y-1,mid.z -(i*2)),new createVector(mid.x+2.5,mid.y-1,mid.z -((i+1)*2))))
            this.walls.push(new tri(new createVector(mid.x,mid.y-2,mid.z -((i+1)*2)),new createVector(mid.x,mid.y-2,mid.z -((i)*2)),new createVector(mid.x+2.5,mid.y-1,mid.z -((i+1)*2))))
            this.walls.push(new tri(new createVector(mid.x,mid.y-2,mid.z -(i*2)),new createVector(mid.x-2.5,mid.y-1,mid.z -(i*2)),new createVector(mid.x-2.5,mid.y-1,mid.z -((i+1)*2))))
            this.walls.push(new tri(new createVector(mid.x,mid.y-2,mid.z -((i+1)*2)),new createVector(mid.x,mid.y-2,mid.z -((i)*2)),new createVector(mid.x-2.5,mid.y-1,mid.z -((i+1)*2))))
            //
            this.walls.push(new tri(new createVector(mid.x -(i*2),mid.y+1,mid.z -2),new createVector(mid.x -(i*2),mid.y-1,mid.z -2.5),new createVector(mid.x -((i+1)*2),mid.y-1,mid.z -2.5)))
            this.walls.push(new tri(new createVector(mid.x -((i+1)*2),mid.y+1,mid.z -2),new createVector(mid.x-((i)*2),mid.y+1,mid.z -2),new createVector(mid.x-((i+1)*2),mid.y-1,mid.z -2.5)))
            this.walls.push(new tri(new createVector(mid.x-(i*2),mid.y+1,mid.z +2),new createVector(mid.x-(i*2),mid.y-1,mid.z +2.5),new createVector(mid.x-((i+1)*2),mid.y-1,mid.z +2.5)))
            this.walls.push(new tri(new createVector(mid.x-((i+1)*2),mid.y+1,mid.z +2),new createVector(mid.x-((i)*2),mid.y+1,mid.z +2),new createVector(mid.x-((i+1)*2),mid.y-1,mid.z +2.5)))
            this.walls.push(new tri(new createVector(mid.x-(i*2),mid.y-2,mid.z) ,new createVector(mid.x-(i*2),mid.y-1,mid.z +2.5),new createVector(mid.x-((i+1)*2),mid.y-1,mid.z +2.5)))
            this.walls.push(new tri(new createVector(mid.x-((i+1)*2),mid.y-2,mid.z ),new createVector(mid.x-((i)*2),mid.y-2,mid.z ),new createVector(mid.x-((i+1)*2),mid.y-1,mid.z +2.5)))
            this.walls.push(new tri(new createVector(mid.x -(i*2),mid.y-2,mid.z),new createVector(mid.x-(i*2),mid.y-1,mid.z-2.5),new createVector(mid.x-((i+1)*2),mid.y-1,mid.z -2.5)))
            this.walls.push(new tri(new createVector(mid.x-((i+1)*2),mid.y-2,mid.z),new createVector(mid.x-((i)*2),mid.y-2,mid.z),new createVector(mid.x-((i+1)*2),mid.y-1,mid.z -2.5)))
            //
            this.walls.push(new tri(new createVector(mid.x +(i*2),mid.y+1,mid.z -2),new createVector(mid.x +(i*2),mid.y-1,mid.z -2.5),new createVector(mid.x +((i+1)*2),mid.y-1,mid.z -2.5)))
            this.walls.push(new tri(new createVector(mid.x +((i+1)*2),mid.y+1,mid.z -2),new createVector(mid.x+((i)*2),mid.y+1,mid.z -2),new createVector(mid.x+((i+1)*2),mid.y-1,mid.z -2.5)))
            this.walls.push(new tri(new createVector(mid.x+(i*2),mid.y+1,mid.z +2),new createVector(mid.x+(i*2),mid.y-1,mid.z +2.5),new createVector(mid.x+((i+1)*2),mid.y-1,mid.z +2.5)))
            this.walls.push(new tri(new createVector(mid.x+((i+1)*2),mid.y+1,mid.z +2),new createVector(mid.x+((i)*2),mid.y+1,mid.z +2),new createVector(mid.x+((i+1)*2),mid.y-1,mid.z +2.5)))
            this.walls.push(new tri(new createVector(mid.x+(i*2),mid.y-2,mid.z) ,new createVector(mid.x+(i*2),mid.y-1,mid.z +2.5),new createVector(mid.x+((i+1)*2),mid.y-1,mid.z +2.5)))
            this.walls.push(new tri(new createVector(mid.x+((i+1)*2),mid.y-2,mid.z ),new createVector(mid.x+((i)*2),mid.y-2,mid.z ),new createVector(mid.x+((i+1)*2),mid.y-1,mid.z +2.5)))
            this.walls.push(new tri(new createVector(mid.x +(i*2),mid.y-2,mid.z),new createVector(mid.x+(i*2),mid.y-1,mid.z-2.5),new createVector(mid.x+((i+1)*2),mid.y-1,mid.z -2.5)))
            this.walls.push(new tri(new createVector(mid.x+((i+1)*2),mid.y-2,mid.z),new createVector(mid.x+((i)*2),mid.y-2,mid.z),new createVector(mid.x+((i+1)*2),mid.y-1,mid.z -2.5)))
        }
    }
    sorter(list){
        let bigger =[]
        let smaller = []
        if(list.length<2){
            return(list)
        }
        for(let i =1;i<list.length;i++){
            if(list[0].dis<list[i].dis){
                bigger.push(list[i])
            }else{
                smaller.push(list[i])
            }
        }
        return((this.sorter(bigger).concat(list[0])).concat(this.sorter(smaller)))
    }
    draw(d,yar,pitch,me){
        this.dis = Math.sqrt(Math.pow(this.cent.x-me.x,2)+Math.pow(this.cent.y-me.y,2)+Math.pow(this.cent.z-me.z,2))
        this.walls = this.sorter(this.walls)
        for(let i =0;i<this.walls.length;i++){
            this.walls[i].draw(d,yar,pitch,me)
        }
    }
}