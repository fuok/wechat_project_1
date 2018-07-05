let GameManager = require('GameManager')

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
    startButtonPressed () {
        this.node.destroy();
        GameManager.instance.gameStart();
    }
});
