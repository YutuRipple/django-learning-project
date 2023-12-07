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
