// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        view1: cc.Node,
        view2: cc.Node,
        avatar: cc.Sprite,
        lblID: cc.Label,
        lblLevel: cc.Label,
        lblExp: cc.Label,
        stars: [cc.Node],
        lblValidDate: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    onEnable() {
        this.view1.active = true;
        this.view2.active = false;
    },

    // update (dt) {},
    goToBattle() {
        if (this.petData != undefined) {
            cc.GameController.getInstance().setPetToRace(this.petData);
            cc.GameController.getInstance().showBattleView();
        } else {
            console.log('PetNode dont have data');
        }

    },

    goToMarket() {

    },

    renewPet() {

    },

    showMore() {
        this.view1.active = false;
        this.view2.active = true;
    },

    hideMore() {
        this.view1.active = true;
        this.view2.active = false;
    },

});