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
        animationNode: cc.Animation,
        clipName: "dog_run",
        rankLabel: cc.Label,
        ranking: '',
        deltaDistance: 0, // bu tru khoang cach vi goc nhin 3D
    },

    // LIFE-CYCLE CALLBACKS:

    start() {
        this.rankLabel.string = '';
    },

    // update (dt) {},

    init: function(data) {
        this.animationNode = data.animationNode;
        this.clipName = data.clipName;
        this.ranking = data.ranking;
    },

    updateRank(value) {
        this.ranking = value;
        this.rankLabel.string = "Rank " + this.ranking;
    },

    play() {
        this.scheduleOnce(function() {
            this.animationNode.play(this.clipName);
        }, 0.08 * Number(this.ranking));
        this.animationNode.play(this.clipName);
        this.rankLabel.string = "Rank " + this.ranking;
    },

    stop() {
        this.animationNode.stop();
    },
});