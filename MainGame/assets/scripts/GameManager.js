let ScoreManager = require('ScoreManager')
let BrickManager = require('BrickManager')
let EnemyManager = require('EnemyManager')

const GameState = {
    Opening: 0,
    Playing: 1,
    GameOver: 2,
};

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
        cameraNode: {
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
        curLevelIndex: 0,
        levelCount: 999,
        gameState: {
            get () {
                return this._gameState;
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:


    onLoad: function () {
        GameManager.instance = this;

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;

    },

    start() {
        this.Opening();
    },

    Opening () {
        this._gameState = GameState.Opening;
        this.player.getComponent('Player').reset();
        BrickManager.instance.resetAllBricks();
        EnemyManager.instance.clearAllEnemies();
        this.cameraNode.getComponent('CameraController').resetCameraToTarget();
        this.loadPanel('prefabs/panels/OpeningPanel');
    },

    gameStart () {
        this._gameState = GameState.Playing;
        this.player.getComponent('Player').reset();
        this.player.getComponent('Player').enableInput();
        BrickManager.instance.resetAllBricks();
        EnemyManager.instance.clearAllEnemies();
        this.curLevelIndex = -1;
        this.nextLevel();
        this.cameraNode.getComponent('CameraController').moveCameraToCenter();
    },

    gameOver () {
        this._gameState = GameState.GameOver;
        this.player.getComponent('Player').disableInput();
        EnemyManager.instance.clearAllEnemies();
        this.cameraNode.getComponent('CameraController').moveCameraToTarget();
    },

    nextLevel () {
        if (this.curLevelIndex >= this.levelCount - 1) {
            return;
        }
        
        this.curLevelIndex += 1;
        EnemyManager.instance.resetLevel();
        console.log("level=" + this.curLevelIndex);
    },

    showGameOverPanel () {
        this.loadPanel('prefabs/panels/GameOverPanel');
    },

    showWechatRankingPanel () {
        this.loadPanel('prefabs/panels/WechatRankingPanel');
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