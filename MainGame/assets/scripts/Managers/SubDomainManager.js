let GameConfig = require('GameConfig');

let SubDomainManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        SubDomainManager.instance = this;
    },

    start() {

    },

    sharePicture(pictureName) {
        let titleStr = '快来跟我一起挑战企鹅大战水果吧。';
        if ("shareTicket" == pictureName) {
            titleStr = "看看你在群里排第几？快来和我挑战企鹅大战水果吧。";
        } else if (pictureName != undefined && pictureName != null) {
            // titleStr = "我得了" + pictureName + "分," + titleStr;
        }
        if (CC_WECHATGAME) {
            window.wx.shareAppMessage({
                title: titleStr,
                query: "x=" + GameConfig.MAIN_MENU_NUM,
                //截图分享
                imageUrl: canvas.toTempFilePathSync({
                    destWidth: 500,
                    destHeight: 400
                }),
                // imageUrl:'res/raw-assets/resources/texture/poster.png',//如果是本地加载可以用绝对路径
                success: (res) => {
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        if ("shareTicket" == pictureName) {
                            window.wx.postMessage({
                                messageType: 5,
                                MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                                shareTicket: res.shareTickets[0]
                            });
                        }
                    }
                }
            });
        } else {
            this.toastMessage(1);
            cc.log("执行了截图" + titleStr);
        }
    },

    sharePoster(pictureName) {
        let titleStr = '一起来挑战企鹅射爆水果吧！';
        if ("shareTicket" == pictureName) {
            titleStr = "看看你在群里排第几？一起来挑战企鹅射爆水果吧！";
        } else if (pictureName != undefined && pictureName != null) {
            titleStr = "我坚持到了Lv." + pictureName + "，" + titleStr;
        }
        if (CC_WECHATGAME) {

            cc.loader.loadRes('texture/poster', function (err, data) {
                window.wx.shareAppMessage({
                    title: titleStr,
                    query: "x=" + GameConfig.MAIN_MENU_NUM,
                    imageUrl: data.url,
                    success: (res) => {
                        if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                            if ("shareTicket" == pictureName) {
                                window.wx.postMessage({
                                    messageType: 5,
                                    MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                                    shareTicket: res.shareTickets[0]
                                });
                            }
                        }
                    }
                })

            });

        } else {
            this.toastMessage(1);
            cc.log("执行了截图" + titleStr);
        }
    },

    removeRankData() {//移除排行榜数据
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 0,
            });
        } else {
            cc.log("移除排行榜数据。");
        }
    },

    submitScore(score) { //提交得分
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
