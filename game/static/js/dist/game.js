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
            console.log("Clicked singlemode");
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
class AcGamePlayground{
    constructor(root){
        this.root=root;
        this.$playground = $(`
<div>游戏界面</div>
        `)
    this.root.$ac_game.append(this.$playground);
    this.hide();
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
class AcGame{
    constructor(id){
        this.id = id;
        this.$ac_game = $('#'+id);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
    }

    start()
    {

    }
}
