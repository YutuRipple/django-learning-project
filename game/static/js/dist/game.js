class AcGameMenu{
    constructor(root){
        this.root=root;
        this.$menu = $(`
<div class="ac_game_menu">
    <div class="ac_game_menu_field">
        <div class="ac_game_menu_field_item ac_game_menu_field_item_single">Singleplayer</div>
        <br/>
        <div class="ac_game_menu_field_item ac_game_menu_field_item_multiply">Multiplayer</div>
        <br/>
        <div class="ac_game_menu_field_item ac_game_menu_field_item_settings">Settings</div>
    </div>
</div>
        `);
    this.root.$ac_game.append(this.$menu);
    this.$single = this.$menu.find('.ac_game_menu_field_item_single')
    this.$multiply = this.$menu.find('.ac_game_menu_field_item_multiply')
    this.$settings = this.$menu.find('.ac_game_menu_field_item_settings')
    this.start();
    }
    
    start()
    {
        this.add_events_listener();
    }

    add_events_listener(){
        let outer = this;
        this.$single.click(function(){
            outer.hide();
            outer.root.playground.show();
        });
        this.$multiply.click(function(){
            console.log("Clicked multimode");
        });
        this.$settings.click(function(){
            console.log("Clicked settings");
        });
    }

    show()  //显示menu界面
    {
        this.$menu.show();
    }
    hide()  //关闭menu界面
    {
        this.$menu.hide();
    }
}
let AC_GAME_OBJECTS = [];

class AcGameObject{
    constructor(){
        AC_GAME_OBJECTS.push(this);
        this.has_called_start = false;   //是否执行过start
        this.timedelta = 0;  //当前帧距离上一帧的时间间隔
    }

    start(){
    }

    update(){
    }

    on_destroy(){

    }

    destroy(){
        this.on_destroy();

        for(let i=0;i<AC_GAME_OBJECTS.length;i++){
            if(AC_GAME_OBJECTS[i]===this){
                AC_GAME_OBJECTS.splice(i,1);
                break;
            }
        }
    }
}
let last_timestamp;
let AC_GAME_ANIMATION = function(timestamp){
    for(let i=0;i<AC_GAME_OBJECTS.length;i++){
        let obj = AC_GAME_OBJECTS[i];
        if(!obj.has_called_start){
            obj.start();
            obj.has_called_start = true;
        }else{
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    
    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_ANIMATION);
}


AC_GAME_ANIMATION();
class GameMap extends AcGameObject{
    constructor(playground){
        super();
        this.playground=playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width=this.playground.width;
        this.ctx.canvas.height=this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start(){

    }

    update(){
        this.render();
    }
    render(){
        this.ctx.fillStyle = "rgba(0,0,0,0.4)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }
}
class Particle extends AcGameObject{
    constructor(playground,x,y,radius,vx,vy,color,speed,move_length){
        super();
        this.playground=playground;
        this.ctx=this.playground.game_map.ctx;
        this.x=x;
        this.y=y;
        this.vx=vx;
        this.vy=vy;
        this.radius=radius;
        this.color=color;
        this.speed=speed;
        this.move_length = move_length;
        this.friction=0.9;
        this.eps=1;
    }
    start(){

    }

    update(){
        if(this.move_length<this.eps||this.speed<this.eps){
            this.destroy();
            return false;
        }
        let moved = Math.min(this.move_length,this.speed*this.timedelta/1000)
        this.x += this.vx*moved;
        this.y += this.vy*moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }

    render(){
        this.ctx.beginPath();
        this.ctx.fillStyle=this.color;
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        this.ctx.fill();
    }
}
class Player extends AcGameObject{
    constructor(playground,x,y,radius,color,speed,is_me){
          super();
          this.playground=playground;
          this.ctx=this.playground.game_map.ctx;
          this.x=x;
          this.y=y;
          this.damage_x=0;
          this.damage_y=0;
          this.damage_speed=0;
          this.vx=0;
          this.vy=0;
          this.move_length=0;
          this.radius=radius;
          this.color=color;
          this.speed = speed;
          this.is_me=is_me;
          this.eps=0.1;
          this.friction=0.85;
          this.cur_skill = null;
          this.spent_time = 0;
    }

    start(){
        if(this.is_me){
            this.add_events_listener();
        }else{
            let tx = Math.random()*this.playground.width;
            let ty = Math.random()*this.playground.height;
            this.move_to(tx,ty);
        }
    }
    
    add_events_listener(){
        let outer=this;
        this.playground.game_map.$canvas.on("contextmenu",function(){
            return false; 
        });
        this.playground.game_map.$canvas.mousedown(function(e){
            if(e.which===3){
                outer.move_to(e.clientX,e.clientY);
            }else if(e.which===1){
                if(outer.cur_skill === "fireball"){
                    outer.shoot_fireball(e.clientX,e.clientY);
                }
                outer.cur_skill = null;
            }
        })
        $(window).keydown(function(e){
            if (e.which===81){
                outer.cur_skill="fireball";
                return false;    
            }
        })
    }
    
    shoot_fireball(tx,ty){
        let x = this.x,y=this.y;
        let radius = this.playground.height*0.01;
        let angle = Math.atan2(ty-this.y,tx-this.x);
        let vx = Math.cos(angle),vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height*0.5;
        let move_length = this.playground.height*1.2;
        new Fireball(this.playground,this,x,y,radius,vx,vy,color,speed,move_length,this.playground.height*0.01);
    }

    get_dist(x1,y1,x2,y2){
        let dx = x1-x2;
        let dy = y1-y2;
        return Math.sqrt(dx*dx+dy*dy);
    }

    move_to(tx,ty){
        this.move_length = this.get_dist(this.x,this.y,tx,ty);
        let angle = Math.atan2(ty-this.y,tx-this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked(angle,damage){
        for(let i=0;i<20+Math.random()*10;i++){
            let x = this.x;
            let y = this.y;
            let radius = this.radius*Math.random()*0.1;
            let angle = Math.PI*2*Math.random();
            let vx = Math.cos(angle),vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 8;
            let move_length = this.radius*Math.random()*10;
            new Particle(this.playground,x,y,radius,vx,vy,color,speed,move_length);
        }

        this.radius -= damage;
        if(this.radius < 10){
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage*100;
        this.speed*=1.5;

    }

    update(){
        this.spent_time += this.timedelta/1000;
        if(!this.is_me &&this.spent_time>4 && Math.random()<1/240.0){
            let player = this.playground.players[Math.floor(Math.random()*this.playground.players.length)];
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000*0.2;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000*0.2;
            this.shoot_fireball(player.x,player.y);
        }
        if(this.damage_speed>10){
            this.vx=this.vy=0;
            this.move_length = 0;
            this.x += this.damage_x*this.damage_speed*this.timedelta/1000;
            this.y += this.damage_y*this.damage_speed*this.timedelta/1000;
            this.damage_speed *= this.friction;
        }else{
            if(this.move_length<this.eps){
                this.move_length=0;
                this.vx = this.vy = 0;
                if(!this.is_me){
                    let tx = Math.random()*this.playground.width;
                    let ty = Math.random()*this.playground.height;
                    this.move_to(tx,ty);
                }
            }else{
                let moved = Math.min(this.move_length,this.speed*this.timedelta/1000);
                this.x+=this.vx*moved;
                this.y+=this.vy*moved;
                this.move_length-=moved;
            }
        }
        this.render();
    }

    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        this.ctx.fillStyle=this.color;
        this.ctx.fill();
    }
}
class Fireball extends AcGameObject{
    constructor(playground,player,x,y,radius,vx,vy,color,speed,move_length,damage){
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage=damage;
        this.eps = 0.1;
    }

    start(){
    }

    update(){
        if(this.move_length<this.eps){
            this.destroy();
            return false;
        }
        let moved = Math.min(this.move_length,this.speed*this.timedelta/1000);
        this.x += this.vx*moved;
        this.y += this.vy*moved;
        this.move_length -= moved;
        for(let i=0;i<this.playground.players.length;i++){
            let player = this.playground.players[i];
            if(this.player !== player && this.in_collision(player)){
                this.attack(player);            
            }
        }
        this.render();
    }
    
    get_dist(x1,y1,x2,y2){
        let dx = x1-x2;
        let dy = y1-y2;
        return Math.sqrt(dx*dx+dy*dy);
    }

    in_collision(player){
        let distance = this.get_dist(this.x,this.y,player.x,player.y);
        if(distance<this.radius+player.radius){
            return true;
        }
        return false;
    }

    attack(player){
        let angle = Math.atan2(player.y-this.y,player.x-this.x);
        player.is_attacked(angle,this.damage);
        this.destroy();
    }

    render(){
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        this.ctx.fill();
    }
}
class AcGamePlayground{
    constructor(root){
        this.root=root;
        this.$playground = $(`
<div class="ac_game_playground" ></div>
        `)
       // this.hide();
        this.root.$ac_game.append(this.$playground);
        this.width=this.$playground.width();
        this.height=this.$playground.height();
        this.game_map=new GameMap(this);
        this.players = [];
        this.players.push(new Player(this,this.width/2,this.height/2,this.height*0.05,"white",this.height*0.15,true))
        for(let i=0;i<5;i++){
            this.players.push(new Player(this,this.width/2,this.height/2,this.height*0.05,this.get_random_color(),this.height*0.15,false));
        }
        this.start();
    }
    
    get_random_color()
    {
        let colors = ["red","blue","pink","green","purple","grey"];
        return colors[Math.floor(Math.random()*6)];
    }

    start()
    {

    }

    show()  //打开playground
    {
        this.$playground.show();
    }

    hide()  //关闭playground
    {
        this.$playground.hide();
    }
}
export class AcGame{
    constructor(id){
        this.id = id;
        this.$ac_game = $('#'+id);
     //   this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }

    start()
    {

    }
}
