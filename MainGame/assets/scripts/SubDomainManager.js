let GameConfig = require('GameConfig');

let SubDomainManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        SubDomainManager.instance = this;
    },

    start () {

    },

    submitScore (score) { //提交得分
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                score: score,
            });
        } else {
            cc.log("提交得分:" + GameConfig.MAIN_MENU_NUM + " : " + score)
        }
    }
});
