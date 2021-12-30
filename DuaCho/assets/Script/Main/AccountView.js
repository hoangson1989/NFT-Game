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
        lblAccount: cc.Label,
        lblBallance: cc.Label,
        menuItems: cc.Node,

        depositView: cc.Node,
        depositEditBox: cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:


    start() {
        this.menuItems.active = false;
        if (cc.AccountController.getInstance().getMetamaskAddress()) {
            const address = cc.AccountController.getInstance().getMetamaskAddress();
            const prefix = address.substring(0, 7);
            const subfix = address.substring(address.length - 4, address.length);
            this.lblAccount.string = prefix + '...' + subfix;

            this.lblBallance.string = '' + cc.AccountController.getInstance().getBallance();
        }
    },

    onLoad() {

    },

    update(dt) {
        if (this.lblBallance.string !== cc.AccountController.getInstance().getBallance()) {
            this.lblBallance.string = '' + cc.AccountController.getInstance().getBallance();
        }
    },

    // Đóng mở Menu Items
    toggleMenuItems() {
        this.menuItems.active = !this.menuItems.active;
    },

    // Deposit
    toggleDepositTokenView() {
        this.depositView.active = !this.depositView.active;
    },

    depositToken() {
        const amount = this.depositEditBox.string;
        if (amount === '') {
            cc.PopupController.getInstance().showPopup("Please input Token amount");
            cc.PopupController.getInstance().hidePopupAfterDelay(2);
        } else {
            const number = Number(amount)
            if (number != undefined && number != null && number > 0) {
                cc.MetamaskController.getInstance().depositToken(number, this);
            } else {
                cc.PopupController.getInstance().showPopup("Token input is not valid");
                cc.PopupController.getInstance().hidePopupAfterDelay(2);
            }
        }
    },

    onDepositTransactionReceipt(amount, transactionHash) {
        //metamask finish the transaction
        //send it to server
        //
        var params = JSON.stringify({
            amount: amount,
            transaction_id: transactionHash
        });
        cc.APIController.getInstance().deposit(params, this);
    },

    onDepositSuccess(obj) {
        cc.PopupController.getInstance().hidePopup();
        this.toggleDepositTokenView();
        if (obj.user_ballance != undefined) {
            cc.AccountController.getInstance().setBallance(obj.user_ballance);
        }
    },

    onDepositFail(obj) {
        if (obj.message != undefined) {
            cc.PopupController.getInstance().showPopup(obj.message);
        } else {
            cc.PopupController.getInstance().showPopup("Cannot deposit");
        }
        cc.PopupController.getInstance().hidePopupAfterDelay(2);
    },
});