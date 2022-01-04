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
        btnTabPet: cc.Button,
        btnTabFragment: cc.Button,
        btnTabRandom: cc.Button,

        titleCombine: cc.Label,
        btnCancel: cc.Button,
        btnCombine: cc.Button,

        parts: [cc.Node],

        pickerView: cc.Node,
        pickerTitle: cc.Sprite,
        pickerTitles: [cc.SpriteFrame],
        pickerScrollView: cc.ScrollView,
        pickerContent: cc.Node,

        petsTemplate: cc.Node,
        itemsTemplate: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.petData = [0, 1, 2, 3, 4, 5, 6];
        this.itemData = [0, 1, 2, 3, 4, 5, 6];

        this.selectedTab = null;
        this.selectTabPet();
    },

    // update (dt) {},

    // ---- 
    cancelCombine() {
        for (var i = 0; i < this.parts.length; i++) {
            let part = this.parts[i];
            let avatarNode = part.children[1];
            avatarNode.getComponent(cc.Sprite).spriteFrame = null;
            let btnImg = part.children[0].children[0];
            btnImg.active = true;
        }
    },

    processCombine() {

    },

    selectItemForPart: function(event, data) {
        //
        let number = Number(data);
        this.selectedPart = number;
        var type = 0;
        if (number <= 1) {
            this.pickerTitle.spriteFrame = this.pickerTitles[0];
            this.listData = this.petData;
        } else {
            this.pickerTitle.spriteFrame = this.pickerTitles[1];
            this.listData = this.itemData;
            type = 1;
        }

        // clear data
        this.pickerScrollView.scrollToTop(0.1);
        this.pickerContent.removeAllChildren();

        // set data moi
        var row = Math.floor(this.listData.length / 4);
        if (this.listData.length % 4 > 0) {
            row += 1;
        }
        let space = 20;
        for (var i = 0; i < row; ++i) {
            var listRow = null;
            if (type == 0) {
                listRow = cc.instantiate(this.petsTemplate);
            } else {
                listRow = cc.instantiate(this.itemsTemplate);
            }

            for (var j = 0; j < 4; j++) {
                let index = i * 4 + j;
                if (index < this.listData.length) {
                    listRow.children[j].active = true;
                } else {
                    listRow.children[j].active = false;
                }
                listRow.children[j].getComponent("CombineItem").mIndex = index;
                listRow.children[j].getComponent("CombineItem").mListener = this;
            }

            listRow.setPosition(0, -(listRow.height + space) * i);
            listRow.active = true;
            this.pickerContent.addChild(listRow)
        }
        this.pickerContent.height = ((listRow.height + space) * row) - space;
        // show ra
        this.pickerView.active = true;
    },

    onPickerSelectItem(index) {
        let partNode = this.parts[this.selectedPart];
        let btnImg = partNode.children[0].children[0];
        let avatar = partNode.children[1];
        var self = this;
        cc.loader.loadRes("pngwing 2", function(err, tex) {
            if (tex != null) {
                btnImg.active = false;
                avatar.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                // resize avatar
                let width = avatar.width;
                let height = avatar.height;
                let wRatio = 140.0 / width;
                let hRatio = 140.0 / height;
                let ratio = Math.min(wRatio, hRatio);
                avatar.width = width * ratio;
                avatar.height = height * ratio;
            }

            self.checkToActiveCombine();
        });
        this.closePicker();
    },

    checkToActiveCombine() {
        var isFull = true;
        for (var i = 0; i < this.parts.length; i++) {
            let part = this.parts[i];
            let avatarNode = part.children[1];
            if (avatarNode.getComponent(cc.Sprite).spriteFrame == null) {
                isFull = false;
                break;
            }
        }
        if (isFull) {
            this.btnCombine.interactable = true;
        }
    },

    closePicker() {
        this.pickerView.active = false;
    },

    // ----- Tab Filter
    selectTabPet() {
        this.titleCombine.string = 'Select 2 pets + 4 fragments to combine';
        if (this.selectedTab != null) {
            this.selectedTab.interactable = true;
        }
        this.btnTabPet.interactable = false;
        this.selectedTab = this.btnTabPet;
    },
    selectTabFragment() {
        this.titleCombine.string = 'Select fragments to combine';
        if (this.selectedTab != null) {
            this.selectedTab.interactable = true;
        }
        this.btnTabFragment.interactable = false;
        this.selectedTab = this.btnTabFragment;
    },
    selectTabRandom() {
        this.titleCombine.string = 'Select 6 different fragments to combine';
        if (this.selectedTab != null) {
            this.selectedTab.interactable = true;
        }
        this.btnTabRandom.interactable = false;
        this.selectedTab = this.btnTabRandom;
    },
});