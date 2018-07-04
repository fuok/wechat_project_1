let ScoreManager = require('ScoreManager')
let EnemyManager = require('EnemyManager')

let levels = [
    {
        scoreLimit: 10,
        normalEnemyInterval: 1,
        singleRecoveryInterval: 8,
        fullRecoveryInterval: 15,
        // DEBUG
        minSpeed: 100,
        maxSpeed: 150,
    },
    {
        scoreLimit: 30,
        normalEnemyInterval: 0.5,
        singleRecoveryInterval: 5,
        fullRecoveryInterval: 10,
        minSpeed: 150,
        maxSpeed: 200,
    },
    {
        scoreLimit: 100,
        normalEnemyInterval: 0.2,
        singleRecoveryInterval: 5,
        fullRecoveryInterval: 10,
        minSpeed: 200,
        maxSpeed: 400,
    }
];

let GameManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        // 地面节点，用于确定星星生成的高度
        rootNode: {
            default: null,
            type: cc.Node
        },
        uiNode: {
            default: null,
            type: cc.Node
        },
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },
        groundPosY: 0,
        curLevel: {
            get() {
                return levels[this.curLevelIndex];
            }
        },
    },

    // LIFE-CYCLE CALLBACKS:


    onLoad: function () {
        GameManager.instance = this;

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;

    },

    start() {
        this.curLevelIndex = -1;
        this.nextLevel();
    },

    update(dt) {
    },

    checkNextLevel () {
        if (ScoreManager.instance.currentScore > levels[this.curLevelIndex].scoreLimit) {
            this.nextLevel();
        }
    },

    nextLevel () {
        if (this.curLevelIndex >= levels.length - 1) {
            return;
        }
        
        this.curLevelIndex += 1;
        EnemyManager.instance.resetLevel();
    },

    restartGame () {
        this.player.stopAllActions(); //停止 player 节点的跳跃动作
        cc.director.loadScene('game');
    },

    gameOver () {
        this.loadPanel('prefabs/panels/GameOverPanel');
    },

    loadPanel(panelName) {//加载图层
        cc.loader.loadRes(panelName, (err, prefab) => {
            if (!err) {
                let node = cc.instantiate(prefab);
                this.uiNode.addChild(node);
            }
        });
    }

});