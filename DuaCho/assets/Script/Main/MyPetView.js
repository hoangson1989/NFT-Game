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
        filterTabView: cc.Node,
        btnTabPet: cc.Button,
        btnTabItems: cc.Button,
        btnTabOther: cc.Button,

        indicatorLess: cc.Node,
        indicatorMore: cc.Node,

        petTabScrollView: cc.ScrollView,
        petTabContentView: cc.Node,
        itemsTabScrollView: cc.ScrollView,
        itemsTabContentView: cc.Node,
        othersTabScrollView: cc.ScrollView,
        othersTabContentView: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.btnTabSelected = null;
        this.selectedScrollView = null;
        this.selectedContentView = null;

        this.petTabScrollView.mOriginHeight = this.petTabScrollView.node.getContentSize().height;
        this.itemsTabScrollView.mOriginHeight = this.itemsTabScrollView.node.getContentSize().height;
        this.othersTabScrollView.mOriginHeight = this.othersTabScrollView.node.getContentSize().height;

        this.petTabContentView.mOriginHeight = this.petTabContentView.getContentSize().height;
        this.itemsTabContentView.mOriginHeight = this.itemsTabContentView.getContentSize().height;
        this.othersTabContentView.mOriginHeight = this.othersTabContentView.getContentSize().height;

        this.petsData = null;
        this.itemsData = null;
        this.otherData = null;
    },

    onEnable() {
        // get Items của Box Items
        var params = JSON.stringify({
            address: cc.AccountController.getInstance().getMetamaskAddress(),
        });
        cc.APIController.getInstance().getItems(params, this);
        cc.PopupController.getInstance().showPopup("Getting data...");
    },

    // update (dt) {},

    // GetItems Response
    onGetItemsSuccess(obj) {
        cc.PopupController.getInstance().hidePopup();
        console.log('get Items thanh cong');
        if (obj.cars != undefined) {
            this.petsData = obj.cars;
            this.itemsData = [];
            this.otherData = [];
        }
        //
        this.btnTabPetSelect();
    },
    onGetItemsFail(error) {
        console.log('get Items that bat ' + error);

        if (error.message != undefined) {
            cc.PopupController.getInstance().showPopup(error.message);
        } else {
            cc.PopupController.getInstance().showPopup('Cannot get the server data');
        }
        cc.PopupController.getInstance().hidePopupAfterDelay(2);
    },
    // Indicator 
    selectPage1() {
        this.showPageIndex(0);
    },

    selectPage2() {
        this.showPageIndex(1);
    },

    selectPage3() {
        this.showPageIndex(2);
    },

    selectPageLast() {
        var numberOfPages = Math.floor(this.dataList.length / 8);
        if ((this.dataList.length % 8) > 0) {
            numberOfPages += 1;
        }
        this.showPageIndex(numberOfPages - 1);
    },

    selectPageNext() {
        var numberOfPages = Math.floor(this.dataList.length / 8);
        if ((this.dataList.length % 8) > 0) {
            numberOfPages += 1;
        }
        if (this.currentPage < numberOfPages - 1) {
            this.showPageIndex(this.currentPage + 1);
        }
    },

    selectPagePrev() {
        if (this.currentPage > 0) {
            this.showPageIndex(this.currentPage - 1);
        }
    },

    showPageIndex(index) {
        if (this.indicatorLess.active) {
            for (var i = 0; i < this.indicatorLess.children.length; ++i) {
                let btn = this.indicatorLess.children[i].getComponent(cc.Button);
                if (i == index) {
                    btn.interactable = false;
                } else {
                    btn.interactable = true;
                }
            }
        } else if (this.indicatorMore.active) {
            var numberOfPages = Math.floor(this.dataList.length / 8);
            if ((this.dataList.length % 8) > 0) {
                numberOfPages += 1;
            }

            let page1Node = this.indicatorMore.getChildByName('page1');
            let pageCurrentNode = this.indicatorMore.getChildByName('pageCurrent');
            let pageLastNode = this.indicatorMore.getChildByName('pageLast');
            if (index == 0) {
                let btn = page1Node.getComponent(cc.Button);
                btn.interactable = false;
                //
                let btnLast = pageLastNode.getComponent(cc.Button);
                btnLast.interactable = true;
                //
                let lbl = pageCurrentNode.children[0].children[0].getComponent(cc.Label);
                lbl.string = '2'
                    //
                let btnCurrent = pageCurrentNode.getComponent(cc.Button);
                btnCurrent.interactable = true;
            } else if (index == numberOfPages - 1) {
                let btn1 = page1Node.getComponent(cc.Button);
                btn1.interactable = true;
                //
                let btnLast = pageLastNode.getComponent(cc.Button);
                btnLast.interactable = false;
                //
                let lbl = pageCurrentNode.children[0].children[0].getComponent(cc.Label);
                lbl.string = '2'
                    //
                let btnCurrent = pageCurrentNode.getComponent(cc.Button);
                btnCurrent.interactable = true;
            } else {
                let btn1 = page1Node.getComponent(cc.Button);
                btn1.interactable = true;
                //
                let btnLast = pageLastNode.getComponent(cc.Button);
                btnLast.interactable = true;
                //
                let lbl = pageCurrentNode.children[0].children[0].getComponent(cc.Label);
                lbl.string = '' + (index + 1)
                    //
                let btnCurrent = pageCurrentNode.getComponent(cc.Button);
                btnCurrent.interactable = false;
            }
        }
        this.currentPage = index;

        // Change Items cho ScrollView
        var countVisible = 0
        for (var i = 0; i < this.selectedContentView.children.length; ++i) {
            let petItemNode = this.selectedContentView.children[i];
            let dataIndex = (index * 8) + i;
            if (dataIndex < this.dataList.length) {
                countVisible += 1;
                petItemNode.active = true;
                let dataItem = this.dataList[dataIndex];

                //set cho tuy loai
                if (this.selectedScrollView === this.petTabScrollView) {
                    let lblID = petItemNode.children[0].children[1].children[0].children[0].getComponent(cc.Label);

                    if (dataItem.id != undefined) {
                        const address = dataItem.id;
                        const prefix = address.substring(0, 4);
                        const subfix = address.substring(address.length - 6, address.length);
                        lblID.string = prefix + '...' + subfix;
                    }

                    if (dataItem.star != undefined) {
                        let starsNode = petItemNode.children[0].children[1].children[1].children;
                        for (var starIndex = 0; starIndex < starsNode.length; ++starIndex) {
                            let starItem = starsNode[starIndex];
                            if (starIndex < dataItem.star) {
                                starItem.active = true;
                            } else {
                                starItem.active = false;
                            }
                        }
                    }
                }
            } else {
                petItemNode.active = false;
            }
        }
        if (countVisible <= 4) {
            var contentSize = this.selectedContentView.getContentSize();
            contentSize.height = this.selectedContentView.mOriginHeight / 2;
            this.selectedContentView.setContentSize(contentSize);
        } else {
            var contentSize = this.selectedContentView.getContentSize();
            contentSize.height = this.selectedContentView.mOriginHeight;
            this.selectedContentView.setContentSize(contentSize);
        }

        //
        if (this.selectedScrollView != null) {
            this.selectedScrollView.scrollToTop(0.3);
        }
    },

    showIndicatorIfNeed() {
        var numberOfPages = Math.floor(this.dataList.length / 8);
        if ((this.dataList.length % 8) > 0) {
            numberOfPages += 1;
        }
        if (numberOfPages > 1) {
            if (numberOfPages <= 3) {
                this.indicatorLess.active = true;
                this.indicatorMore.active = false;
            } else {
                this.indicatorLess.active = false;
                this.indicatorMore.active = true;

                let pageLastNode = this.indicatorMore.getChildByName('pageLast');
                let lbl = pageLastNode.children[0].children[0].getComponent(cc.Label);
                lbl.string = '' + numberOfPages
            }
            var size = this.selectedScrollView.node.getContentSize();
            size.height = this.selectedScrollView.mOriginHeight - 150;
            this.selectedScrollView.node.setContentSize(size);
        } else {
            this.indicatorLess.active = false;
            this.indicatorMore.active = false;

            var size = this.selectedScrollView.node.getContentSize();
            size.height = this.selectedScrollView.mOriginHeight;
            this.selectedScrollView.node.setContentSize(size);
        }
        //
        this.showPageIndex(0);
    },

    // Tab Logic
    btnTabPetSelect() {
        if (this.petsData != null) {
            this.dataList = this.petsData;

            if (this.btnTabSelected != null) {
                this.btnTabSelected.interactable = true;
            }
            this.btnTabPet.interactable = false;
            this.btnTabSelected = this.btnTabPet;
            //
            if (this.selectedScrollView != null) {
                this.selectedScrollView.node.active = false;
            }
            this.selectedScrollView = this.petTabScrollView;
            this.selectedContentView = this.petTabContentView;
            this.selectedScrollView.node.active = true;
            //
            this.showIndicatorIfNeed();
        }

    },

    btnTabItemSelect() {
        if (this.itemsData != null) {
            this.dataList = this.itemsData;

            if (this.btnTabSelected != null) {
                this.btnTabSelected.interactable = true;
            }
            this.btnTabItems.interactable = false;
            this.btnTabSelected = this.btnTabItems;
            //
            if (this.selectedScrollView != null) {
                this.selectedScrollView.node.active = false;
            }
            this.selectedScrollView = this.itemsTabScrollView;
            this.selectedContentView = this.itemsTabContentView;
            this.selectedScrollView.node.active = true;
            //
            this.showIndicatorIfNeed();
        }
    },
    btnTabOtherSelect() {
        if (this.otherData != null) {
            this.dataList = this.otherData;

            if (this.btnTabSelected != null) {
                this.btnTabSelected.interactable = true;
            }
            this.btnTabOther.interactable = false;
            this.btnTabSelected = this.btnTabOther;
            //
            if (this.selectedScrollView != null) {
                this.selectedScrollView.node.active = false;
            }
            this.selectedScrollView = this.othersTabScrollView;
            this.selectedContentView = this.othersTabContentView;
            this.selectedScrollView.node.active = true;
            //
            this.showIndicatorIfNeed();
        }
    },
});