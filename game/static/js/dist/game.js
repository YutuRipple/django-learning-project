class AcGameMenu{
    constructor(root){
        this.root=root;
        this.$menu = $(`
<div class="ac_game_menu">
</div>
        `);

    this.root.$ac_game.append(this.$menu);
    }
}
class AcGame{
    constructor(id){
        this.id = id;
        this.$ac_game = $('#'+id);
        this.menu = new AcGameMenu(this);
    }
}
