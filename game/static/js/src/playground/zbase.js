class AcGamePlayground{
    constructor(root){
        this.root=root;
        this.$playground = $(`
<div class="ac_game_playground" ></div>
        `)
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
