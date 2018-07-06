let ScoreManager = require('ScoreManager')
let BrickManager = require('BrickManager')
let EnemyManager = require('EnemyManager')

const GameState = {
    Opening: 0,
    Playing: 1,
    GameOver: 2,
};

let levels = [
    {
        scoreLimit: 50,
        normalEnemyInterval: 1.5,
        singleRecoveryInterval: 6,
        fullRecoveryInterval: 15,
        minSpeed: 150,
        maxSpeed: 170,
        //TODO
        burstNumber: 5,
    },
    {
        scoreLimit: 80,
        normalEnemyInterval: 1.4,
        singleRecoveryInterval: 5,
        fullRecoveryInterval: 14,
        minSpeed: 170,
        maxSpeed: 190,
    },
    {
        scoreLimit: 150,
        normalEnemyInterval: 1.3,
        singleRecoveryInterval: 4,
        fullRecoveryInterval: 13,
        minSpeed: 190,
        maxSpeed: 210,
    },
    {
        scoreLimit: 200,
        normalEnemyInterval: 1.2,
        singleRecoveryInterval: 4,
        fullRecoveryInterval: 13,
        minSpeed: 210,
        maxSpeed: 240,
    },
    {
        scoreLimit: 280,
        normalEnemyInterval: 1.1,
        singleRecoveryInterval: 4,
        fullRecoveryInterval: 13,
        minSpeed: 240,
        maxSpeed: 280,
    },
    {
        scoreLimit: 400,
        normalEnemyInterval: 1,
        singleRecoveryInterval: 3.5,
        fullRecoveryInterval: 12,
        minSpeed: 280,
        maxSpeed: 350,
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
        curLevel: {
            get() {
                return levels[this.curLevelIndex];
            }
        },
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