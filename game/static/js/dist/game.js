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


requestAnimationFrame(AC_GAME_ANIMATION);
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
        this.ctx.fillStyle = "rgba(0,0,0)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
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
        this.start();
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
