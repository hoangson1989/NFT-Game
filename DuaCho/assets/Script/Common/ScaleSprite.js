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
        baseWidth: 148.0,
        baseHeight: 148.0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        let width = this.node.width;
        let height = this.node.height;
        let wRatio = this.baseWidth / width;
        let hRatio = this.baseHeight / height;
        let ratio = Math.min(wRatio, hRatio);
        this.node.width = width * ratio;
        this.node.height = height * ratio;
    },

    // update (dt) {},
});