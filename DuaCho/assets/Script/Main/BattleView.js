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
        raceView: cc.Node,
        racePart0Node: cc.Node,
        racePart00Node: cc.Node,
        racePart1Node: cc.Node,
        racePart2Node: cc.Node,
        racePart3Node: cc.Node,
        racePart4Node: cc.Node,
        racePart5Node: cc.Node,
        raceStartNode: cc.Node,

        petGroupView: cc.Node,
        petTemplates: [cc.Node],

        battleResultView: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    onDestroy() {
        this.petGroupView.destroy();
    },

    onEnable() {
        this.battleResultView.active = false;
        this.raceView.active = true;
        // load AnimationClip
        var self = this;
        cc.loader.loadRes("pet/1/dog1_run", function(err, clip) {
            self.setupGameplay(clip);
        });

        cc.PopupController.getInstance().showPopup("Starting in 3...");
        this.scheduleOnce(function() {
            cc.PopupController.getInstance().showPopup("Starting in 2...");
            this.scheduleOnce(function() {
                cc.PopupController.getInstance().showPopup("Starting in 1...");
                this.scheduleOnce(function() {
                    cc.PopupController.getInstance().hidePopup();
                    this.playGame();
                }, 1);
            }, 1);
        }, 1);
    },

    onDisable() {
        this.stopGame();
    },

    update(dt) {
        if (this.isPlaying) {
            //update position to descride the rank
            for (var i = 0; i < this.petGroupView.children.length; ++i) {
                let petItem = this.petGroupView.children[i];

                let currentX = petItem.getPosition().x;
                let targetX = petItem.mTargetX;
                if (currentX != targetX) {
                    let speed = petItem.mSpeed;
                    let dtSpeed = speed * dt;
                    if (Math.abs(currentX - targetX) > Math.abs(dtSpeed)) {
                        //move
                        let newX = currentX + dtSpeed;
                        petItem.setPosition(newX, petItem.getPosition().y);
                    } else {
                        petItem.setPosition(targetX, petItem.getPosition().y);
                    }
                }
            }
        }
    },

    //Menu
    playGameAgain() {
        this.raceView.active = true;
        this.battleResultView.active = false;
        this.stopRaceAnimation(true);
        // load AnimationClip
        var self = this;
        cc.loader.loadRes("pet/1/dog1_run", function(err, clip) {
            self.setupGameplay(clip);
        });

        cc.PopupController.getInstance().showPopup("Starting in 3...");
        this.scheduleOnce(function() {
            cc.PopupController.getInstance().showPopup("Starting in 2...");
            this.scheduleOnce(function() {
                cc.PopupController.getInstance().showPopup("Starting in 1...");
                this.scheduleOnce(function() {
                    cc.PopupController.getInstance().hidePopup();
                    this.playGame();
                }, 1);
            }, 1);
        }, 1);
    },

    closeRace() {
        this.battleResultView.active = false;
        this.stopRaceAnimation(true);
        cc.GameController.getInstance().backToLobby();
    },

    //Gameplay
    changeRanking() {
        if (this.isPlaying) {
            let randomRank = Math.floor(Math.random() * 10) % 5;
            for (var i = 0; i < this.petGroupView.children.length; ++i) {
                let petItem = this.petGroupView.children[i];
                let currentRank = petItem.mRank;

                var newRank = currentRank;
                if (i + 1 + randomRank <= this.numberOfPets) {
                    newRank = (i + 1 + randomRank);
                } else {
                    newRank = (i + 1 + randomRank) - this.numberOfPets;
                }
                petItem.mRank = newRank
                let controller = petItem.getComponent('AnimationController');
                controller.updateRank(newRank);

                // tinh speed
                let distanceEachRank = 60 + controller.deltaDistance;
                let totalDistance = (currentRank - newRank) * distanceEachRank;
                let duration = 2.0; //seconds
                let speed = totalDistance / duration;
                petItem.mSpeed = speed; // per seconds, value > or < 0
                petItem.mTargetX = petItem.getPosition().x + totalDistance;
            }
            //
            this.scheduleOnce(function() {
                this.changeRanking();
            }, 3);
        }
    },

    playGame() {
        this.playRaceAnimation();
        this.isPlaying = true;

        this.scheduleOnce(function() {
            this.changeRanking();
        }, 3);

        this.scheduleOnce(function() {
            this.stopGame();

        }, 30);
    },

    stopGame() {
        this.isPlaying = false;
        this.stopRaceAnimation(false);
        //
        this.battleResultView.active = true;
    },

    setupGameplay(clip) {
        // global params
        this.isPlaying = false;
        this.numberOfPets = 5;
        //  
        let randomRank = Math.floor(Math.random() * 10) % 5;
        var self = this;
        for (var i = 0; i < this.numberOfPets; i++) {
            let petItem = cc.instantiate(self.petTemplates[i]);
            let anim = petItem.getComponent(cc.Animation);

            if (i + 1 + randomRank <= this.numberOfPets) {
                petItem.mRank = (i + 1 + randomRank);
            } else {
                petItem.mRank = (i + 1 + randomRank) - this.numberOfPets;
            }

            //gan animation clip
            anim.addClip(clip);

            //gan controller
            let controller = petItem.getComponent('AnimationController');
            controller.init({
                animationNode: anim,
                clipName: clip.name,
                ranking: '' + petItem.mRank,
            });
            if (i == 3) {
                self.petGroupView.addChild(petItem, 0);
            } else if (i == 1) {
                self.petGroupView.addChild(petItem, 1);
            } else {
                self.petGroupView.addChild(petItem, 2);
            }

            // tinh speed
            petItem.mOriginPos = petItem.getPosition();
            let distanceEachRank = 60 + controller.deltaDistance;
            let totalDistance = (this.numberOfPets - petItem.mRank) * distanceEachRank;
            let duration = 2.0; //seconds
            let speed = totalDistance / duration;
            petItem.mSpeed = speed; // per seconds, value > or < 0
            petItem.mTargetX = petItem.getPosition().x + totalDistance;
        }
    },

    // Animation
    playRaceAnimation() {
        let racePart0Anim = this.racePart0Node.getComponent(cc.Animation);
        racePart0Anim.play('race_p0');

        let racePart00Anim = this.racePart00Node.getComponent(cc.Animation);
        racePart00Anim.play('race_p00');

        let racePart1Anim = this.racePart1Node.getComponent(cc.Animation);
        racePart1Anim.play('race_p1');

        let racePart2Anim = this.racePart2Node.getComponent(cc.Animation);
        racePart2Anim.play('race_p2');

        let racePart3Anim = this.racePart3Node.getComponent(cc.Animation);
        racePart3Anim.play('race_p3');

        let racePart4Anim = this.racePart4Node.getComponent(cc.Animation);
        racePart4Anim.play('race_p4');

        let racePart5Anim = this.racePart5Node.getComponent(cc.Animation);
        racePart5Anim.play('race_p5');

        let raceStartAnim = this.raceStartNode.getComponent(cc.Animation);
        raceStartAnim.play('race_start');

        for (var i = 0; i < this.petGroupView.children.length; ++i) {
            let petItem = this.petGroupView.children[i];
            let controller = petItem.getComponent('AnimationController');
            controller.play();
        }
    },

    stopRaceAnimation(isReset) {
        let racePart0Anim = this.racePart0Node.getComponent(cc.Animation);
        racePart0Anim.stop();

        let racePart00Anim = this.racePart00Node.getComponent(cc.Animation);
        racePart00Anim.stop();


        let racePart1Anim = this.racePart1Node.getComponent(cc.Animation);
        racePart1Anim.stop();


        let racePart2Anim = this.racePart2Node.getComponent(cc.Animation);
        racePart2Anim.stop();


        let racePart3Anim = this.racePart3Node.getComponent(cc.Animation);
        racePart3Anim.stop();


        let racePart4Anim = this.racePart4Node.getComponent(cc.Animation);
        racePart4Anim.stop();


        let racePart5Anim = this.racePart5Node.getComponent(cc.Animation);
        racePart5Anim.stop();


        let raceStartAnim = this.raceStartNode.getComponent(cc.Animation);
        raceStartAnim.stop();


        for (var i = 0; i < this.petGroupView.children.length; ++i) {
            let petItem = this.petGroupView.children[i];
            if (isReset == true) {
                petItem.setPosition(petItem.mOriginPos);
            }
            //
            let controller = petItem.getComponent('AnimationController');
            controller.stop();
        }

        if (isReset == true) {
            this.petGroupView.removeAllChildren(true);

            var pos = this.racePart0Node.getPosition();
            pos.x = 0;
            this.racePart0Node.setPosition(pos);
            //
            pos = this.racePart00Node.getPosition();
            pos.x = 0;
            this.racePart00Node.setPosition(pos);
            //
            pos = this.racePart1Node.getPosition();
            pos.x = 0;
            this.racePart1Node.setPosition(pos);
            //
            pos = this.racePart2Node.getPosition();
            pos.x = 0;
            this.racePart2Node.setPosition(pos);
            //
            pos = this.racePart2Node.getPosition();
            pos.x = 0;
            this.racePart2Node.setPosition(pos);
            //
            pos = this.racePart3Node.getPosition();
            pos.x = 0;
            this.racePart3Node.setPosition(pos);
            //
            pos = this.racePart4Node.getPosition();
            pos.x = 0;
            this.racePart4Node.setPosition(pos);
            //
            pos = this.racePart5Node.getPosition();
            pos.x = 0;
            this.racePart5Node.setPosition(pos);

            pos = this.raceStartNode.getPosition();
            pos.x = 0;
            this.raceStartNode.setPosition(pos);
        }
    },
});