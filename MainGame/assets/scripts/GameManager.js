let ScoreManager = require('ScoreManager')
let BrickManager = require('BrickManager')
let EnemyManager = require('EnemyManager')

const GameState = {
    Opening: 0,
    Playing: 1,
    GameOver: 2,
};

let initLevel = {
        scoreLimit: 200,
        playerMoveSpeed: 400,
        normalEnemyInterval: 1.2,
        singleRecoveryInterval: 6,
        fullRecoveryInterval: 15,
        minSpeed: 150,
        maxSpeed: 250,
        //TODO
        burstNumber: 5,
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
        nextLevelLabel: {
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
        let openingPanel = this.uiNode.getChildByName('Opening Panel');
        if (openingPanel != undefined) {
            openingPanel.destroy();
        }
        this._gameState = GameState.Playing;
        this.player.getComponent('Player').reset();
        this.player.getComponent('Player').enableInput();
        BrickManager.instance.resetAllBricks();
        EnemyManager.instance.clearAllEnemies();
        this.curLevelIndex = 1;
        ScoreManager.instance.setScore(0);
        this.nextLevelAnimDone();
    },

    gameOver () {
        this._gameState = GameState.GameOver;
        this.player.getComponent('Player').disableInput();
        EnemyManager.instance.clearAllEnemies();
        this.cameraNode.getComponent('CameraController').moveCameraToTarget();
    },

    nextLevel () {
        // 这个函数只是用来清除当前场景，并转镜头用的
        this.cameraNode.getComponent('CameraController').moveCameraToTarget();
        EnemyManager.instance.cancelAllTimeSchedules();
        EnemyManager.instance.clearAllEnemies();
        this.curLevelIndex += 1;
        this.nextLevelLabel.active = true;
        this.nextLevelLabel.getComponent(cc.Label).string = "LEVEL " + this.curLevelIndex;
        this.scheduleOnce(this.nextLevelAnimDone, 2);
    },

    nextLevelAnimDone () {
        // 这个函数是真正的初始化当前level的地方
        this.nextLevelLabel.active = false;
        this.generateCurLevel(this.curLevelIndex);
        EnemyManager.instance.resetLevel();
        this.player.getComponent('Player').moveSpeed = this.curLevel.playerMoveSpeed;
        this.cameraNode.getComponent('CameraController').moveCameraToCenter();
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
    },

    generateCurLevel (index) {
        // index从0开始
        if (index == 1) {
            this.curLevel = Object.assign(initLevel);
        } else {
            this.previousLevel = Object.assign(this.curLevel);
            this.curLevel.scoreLimit = this.previousLevel.scoreLimit * 2;
            this.curLevel.playerMoveSpeed = this.previousLevel.playerMoveSpeed * 1.1;
            this.curLevel.normalEnemyInterval = this.previousLevel.normalEnemyInterval * 0.9;
            this.curLevel.singleRecoveryInterval = this.previousLevel.singleRecoveryInterval * 0.9;
            this.curLevel.fullRecoveryInterval = this.previousLevel.fullRecoveryInterval * 0.9;
            this.curLevel.minSpeed = this.previousLevel.minSpeed * 1.05;
            this.curLevel.maxSpeed = this.previousLevel.maxSpeed * 1.05;
            this.curLevel.burstNumber = this.previousLevel.burstNumber * 1.1;
        }
    },

    checkScoreForLevel(score) {
        if (score > this.curLevel.scoreLimit) {
            this.nextLevel();
        }
    }
});