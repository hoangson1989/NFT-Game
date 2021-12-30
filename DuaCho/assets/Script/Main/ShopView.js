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
        lblSilverFee: cc.Label,
        lblGoldenFee: cc.Label,
        lblDiamondFee: cc.Label,

        lblBuyBoxMsg: cc.Label,
        buyBoxConfirmAlert: cc.Node,

        resultNode: cc.Node,
        resultItemStars: [cc.Node],
        resultItemName: cc.Label,
        resultItemID: cc.Label,
        resultItemLevel: cc.Label,
        resultItemImage: cc.Sprite,
        resultItemImageAnimation: cc.Animation,
    },

    // LIFE-CYCLE CALLBACKS:

    start() {
        if (cc.GameController.getInstance().getSilverBoxFee()) {
            this.lblSilverFee.string = cc.GameController.getInstance().getSilverBoxFee() + ' LMP';
        } else {
            this.lblSilverFee.string = 'unvailable';
        }

        this.isOpenBox = false;
        this.boxType = null;
    },

    onLoad() {

    },

    update(dt) {},

    onDisable() {
        this.resultItemImageAnimation.stop();
    },

    openBuyBox() {
        this.closeBuyBoxAlert();
        if (this.boxType == "silver") {
            //check ballance
            const ballance = cc.AccountController.getInstance().getBallance();
            const cost = cc.GameController.getInstance().getSilverBoxFee();
            if (ballance < cost) {
                cc.PopupController.getInstance().showPopup('Please deposit more Token');
                cc.PopupController.getInstance().hidePopupAfterDelay(2);
            } else {
                if (this.isOpenBox == false) {
                    this.isOpenBox = true;
                    //
                    var params = JSON.stringify({
                        address: cc.AccountController.getInstance().getMetamaskAddress(),
                    });
                    cc.APIController.getInstance().openSilverBox(params, this)
                }
            }
        }
    },

    closeBuyBoxAlert() {
        this.buyBoxConfirmAlert.active = false;
    },

    //Open Silver Box
    openSilverBox() {
        const cost = cc.GameController.getInstance().getSilverBoxFee();

        this.lblBuyBoxMsg.string = "BUY SILVER BOX WITH " + cost + " LMP"
        this.buyBoxConfirmAlert.active = true;
        this.boxType = "silver";
    },

    onOpenSilverBoxSuccess(obj) {
        this.resultNode.active = true;
        this.resultItemImageAnimation.play("dog1_run");
        if (obj.result.name != undefined) {
            this.resultItemName.string = obj.result.name;
        }
        if (obj.result.id != undefined) {
            const petID = obj.result.id;
            const prefix = petID.substring(0, 6);
            const subfix = petID.substring(petID.length - 4, petID.length);
            this.resultItemID.string = prefix + "..." + subfix;
        }

        if (obj.result.star != undefined) {
            for (var i = 0; i < this.resultItemStars.length; ++i) {
                let starItem = this.resultItemStars[i];
                if (i < obj.result.star) {
                    starItem.active = true;
                } else {
                    starItem.active = false;
                }
            }
        }

        if (obj.user_ballance != undefined) {
            cc.AccountController.getInstance().setBallance(obj.user_ballance);
        }
    },

    onOpenSilverBoxFail(obj) {
        if (obj.message != undefined) {
            cc.PopupController.getInstance().showPopup(obj.message);
        } else {
            cc.PopupController.getInstance().showPopup('Can not open Box');
        }
        cc.PopupController.getInstance().hidePopupAfterDelay(2);
    },

    // Open Box Result
    closeOpenBoxResult() {
        this.resultNode.active = false;
    },
});