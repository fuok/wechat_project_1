let BrickManager = require('BrickManager');

let EnemyManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        timeScale: 1,
        enemyWaveInterval: 0,
        enemyBreakInterval: 0,
        enemyGenerationY: 1100,
        rootNode: {
            default: null,
            type: cc.Node
        },
        normalEnemyPrefab: {
            default: null,
            type: cc.Prefab
        },
        singleRecoveryPrefab: {
            default: null,
            type: cc.Prefab
        },
        fullRecoveryPrefab: {
            default: null,
            type: cc.Prefab
        },
        getScoreLabelPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        EnemyManager.instance = this;
        // 避免循环引用，先用这个写法
        this.GameManager = require('GameManager');
        this.enemyPool = new cc.NodePool();
        this.enemies = [];
    },

    start () {
    },

    resetLevel () {
        this.cancelAllTimeSchedules();

        this.curLevel = this.GameManager.instance.curLevel;
        this.curLevelEnemyCountPerWave = this.enemyWaveInterval / this.curLevel.normalEnemyInterval;
        this.curWaveGeneratedNormalEnemyCount = 0;

        if (this.GameManager.instance.curLevelIndex == 0) {
            // 教学关，启动预定义好的关卡
            this.curTutorialStage = 0;
            this.schedule(this.tutorialLevel, 10, 4);
            this.tutorialLevel();
        } else {
            this.schedule(this.controlGenerateNewNormalEnemy, this.curLevel.normalEnemyInterval);
            this.schedule(this.createNewSingleRecovery, this.curLevel.singleRecoveryInterval);
            this.schedule(this.createNewFullRecovery, this.curLevel.fullRecoveryInterval);
        }
    },

    getEnemyPosByIndex (indX, indY) {
        let posX = BrickManager.instance.getBrickPosX(indX);
        let posY = this.enemyGenerationY + indY * BrickManager.instance.brickSize;
        return cc.v2(posX, posY);
    },

    tutorialLevel () {
        let speed = 100;
        this.curTutorialStage += 1;
        switch(this.curTutorialStage) {
            case 1:
                this.createNewNormalEnemy(this.getEnemyPosByIndex(6, 0), speed);
                this.createNewNormalEnemy(this.getEnemyPosByIndex(12, 6), speed);
                this.createNewSingleRecovery(this.getEnemyPosByIndex(23, 16), speed);
                break;
            case 2:
            case 3:
            case 4:
                this.createNewNormalEnemy(this.getEnemyPosByIndex(10, 0), speed);
                this.createNewNormalEnemy(this.getEnemyPosByIndex(9, 1), speed);
                this.createNewNormalEnemy(this.getEnemyPosByIndex(24, 7), speed);
                this.createNewNormalEnemy(this.getEnemyPosByIndex(26, 9), speed);
                this.createNewSingleRecovery(this.getEnemyPosByIndex(17, 16), speed);
                break;
            case 6:
                this.GameManager.instance.nextLevel();
                return;
        }
    },

    controlGenerateNewNormalEnemy () {
        if (this.curWaveGeneratedNormalEnemyCount == -1) {
            this.curWaveGeneratedNormalEnemyCount = 0;
            this.unschedule(this.controlGenerateNewNormalEnemy);
            this.schedule(this.controlGenerateNewNormalEnemy, this.curLevel.normalEnemyInterval);
            return;
        }

        this.curWaveGeneratedNormalEnemyCount += 1;
        this.createOneOrTwoEnemies();
        if (this.curWaveGeneratedNormalEnemyCount > this.curLevelEnemyCountPerWave) {
            this.curWaveGeneratedNormalEnemyCount = -1;
            this.unschedule(this.controlGenerateNewNormalEnemy);
            this.schedule(this.controlGenerateNewNormalEnemy, this.enemyBreakInterval);
        }

    },

    getAllEnemies () {
        return this.enemies;
    },

    cancelAllTimeSchedules() {
        this.unschedule(this.controlGenerateNewNormalEnemy);
        this.unschedule(this.createNewSingleRecovery);
        this.unschedule(this.createNewFullRecovery);
        this.unschedule(this.tutorialLevel);
    },

    clearAllEnemies () {
        this.cancelAllTimeSchedules();
        while(this.enemies.length > 0) {
            this.enemies[this.enemies.length - 1].eliminate();
        }
    },

    initEnemyRandomly (enemyNode) {
        enemyNode.getComponent('Enemy').init(cc.v2(BrickManager.instance.getRandomPosX(), 1200), this.randomSpeed());
    },

    randomSpeed() {
        let minSpeed = this.curLevel.minSpeed;
        let maxSpeed = this.curLevel.maxSpeed;
        return Math.random() * (maxSpeed - minSpeed) + minSpeed;
    },

    addEnemy (enemyNode) {
        let enemy = enemyNode.getComponent('Enemy');
        this.rootNode.addChild(enemyNode);
        this.enemies.push(enemy);
        BrickManager.instance.getBrick(enemy.brickIndex).addEnemy(enemy);
    },

    removeEnemy (enemyNode) {
        let enemy = enemyNode.getComponent('Enemy');
        let index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
        BrickManager.instance.getBrick(enemy.brickIndex).removeEnemy(enemy);
    },

    createOneOrTwoEnemies () {
        if (Math.random() >= 0.5) {
            this.createNewNormalEnemy();
        } else {
            this.createTwoEnemies();
        }
    },

    createTwoEnemies () {
        let indexDis = Math.floor(Math.random() * 10) + 1;
        let firstIndex = Math.floor(Math.random() * (BrickManager.instance.brickCount - 2 * indexDis) + indexDis);
        let secondIndex = Math.random() >= 0.5 ? firstIndex + indexDis : firstIndex - indexDis;
        let firstY = this.enemyGenerationY + Math.random() * 300;
        let secondY = firstY + Math.abs(secondIndex - firstIndex) * BrickManager.instance.brickSize;
        
        let enemy1pos = cc.v2(BrickManager.instance.getBrickPosX(firstIndex), firstY);
        let enemy2pos = cc.v2(BrickManager.instance.getBrickPosX(secondIndex), secondY);
        let speed = this.randomSpeed();

        this.createNewNormalEnemy(enemy1pos, speed);
        this.createNewNormalEnemy(enemy2pos, speed);
    },
    
    createNewNormalEnemy (pos, fallingSpeed) {
        let normalEnemyNode = null;

        if (this.enemyPool.length > 0) {
            normalEnemyNode = this.enemyPool.get();
        } else {
            normalEnemyNode = cc.instantiate(this.normalEnemyPrefab);
        }
        if (pos == undefined) {
            this.initEnemyRandomly(normalEnemyNode);
        } else {
            normalEnemyNode.getComponent('Enemy').init(pos, fallingSpeed);
        }
        this.addEnemy(normalEnemyNode);
        return normalEnemyNode;
    },

    createNewSingleRecovery (pos, fallingSpeed) {
        let singleRecoveryNode = cc.instantiate(this.singleRecoveryPrefab);
        if (pos == undefined || fallingSpeed == undefined) {
            this.initEnemyRandomly(singleRecoveryNode);
        } else {
            singleRecoveryNode.getComponent('Enemy').init(pos, fallingSpeed);
        }
        this.addEnemy(singleRecoveryNode);
    },

    createNewFullRecovery () {
        let fullRecoveryNode = cc.instantiate(this.fullRecoveryPrefab);
        this.initEnemyRandomly(fullRecoveryNode);
        this.addEnemy(fullRecoveryNode);
    },

    destroyNormalEnemy (enemyNode) {
        this.removeEnemy(enemyNode);
        this.enemyPool.put(enemyNode);
    },

    destroyRecovery (recoveryNode) {
        this.removeEnemy(recoveryNode);
        recoveryNode.destroy();
    },

    killNormalEnemy (enemyNode) {
        //显示击中得分
        var getScoreLabel=cc.instantiate(this.getScoreLabelPrefab);
        this.rootNode.addChild(getScoreLabel);
        getScoreLabel.setPosition(enemyNode);
        //延迟销毁
        setTimeout(function () {
            getScoreLabel.destroy();
          }.bind(this), 500);
        //回收对象
        this.destroyNormalEnemy(enemyNode);
    },

    slowMotion() {
        this.getComponent(cc.Animation).play();
    }
});
