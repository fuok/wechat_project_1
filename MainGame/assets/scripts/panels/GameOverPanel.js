let GameManager = require('GameManager')

cc.Class({
    extends: cc.Component,

    properties: {
        levelLabel: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.levelLabel.string = 'LV. ' + GameManager.instance.curLevelIndex;
    },

    // update (dt) {},
    onSkipButtonPressed () {
        this.node.destroy();
        GameManager.instance.showRankingPanel();
    }
});
