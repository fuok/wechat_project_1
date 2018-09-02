let GameConfig = require('GameConfig');

let BrickManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        brickPrefab: {
            default: null,
            type:cc.Prefab
        },
        gameCanvasNode: {
            default: null,
            type:cc.Node
        },
        playerNode: {
            default: null,
            type:cc.Node
        },
        brickSize: 36,
        brickCount: 28,
        groundPosY: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        BrickManager.instance = this;
        this.EnemyManager = require('EnemyManager');

        this.canvasWidth = GameConfig.GAME_CANVAS_WIDTH;
        this.bricks = [];

        // create all bricks from the prefab
        for (let i = 0; i < this.brickCount; i++) {
            let newBrick = cc.instantiate(this.brickPrefab);
            this.gameCanvasNode.addChild(newBrick);
            // set brick's position, brick size 36, totally 28 bricks
            let newBrickX = -(this.canvasWidth - this.brickSize) / 2  + i * this.brickSize;
            let newBrickY = this.groundPosY;
            newBrick.getComponent('Brick').initPos(newBrickX, newBrickY);
            this.bricks.push(newBrick.getComponent('Brick'));
        }
    },

    resetAllBricks() {
        for (let i = 0; i < this.brickCount; i++) {
            this.bricks[i].repair(false);
        }
    },

    getBrick(index) {
        return this.bricks[index];
    },
    // update (dt) {},
    getBrickIndexFromX (x) {
        return parseInt((x + this.canvasWidth / 2) / this.brickSize);
    },

    getRandomPosX () {
        let randIndex = Math.floor(Math.random() * this.brickCount);
        return this.bricks[randIndex].node.x;
    },

    getBrickPosX (index) {
        return this.bricks[index].node.x;
    },

    isPosXWalkable (x) {
        if (x < -this.canvasWidth / 2 || x >= this.canvasWidth / 2) {
            return false;
        }
        let index = this.getBrickIndexFromX(x);
        return !this.bricks[index].isBroken;
    },

    repairAllBrokenBricks () {
        // 先将所有当前砖块速度设为0
        this.EnemyManager.instance.freezeAllEnemies();
        this.repairAllBrokenBricksIndex = 0;
        this.schedule(this.repairAllBrokenBricksCallback, 0.02, this.brickCount);
    },

    repairAllBrokenBricksCallback () {
        this.bricks[this.repairAllBrokenBricksIndex].repair(true, false);
        this.repairAllBrokenBricksIndex += 1;
        // 不知道为什么, repeat不好用，所以在这里强制取消schedule
        if (this.repairAllBrokenBricksIndex >= this.brickCount) {
            this.unschedule(this.repairAllBrokenBricksCallback);
        }
    },

    findNearestBrickFromPlayer () {
        let playerPosX = this.playerNode.position.x;
        let playerIndex = this.getBrickIndexFromX(playerPosX);
        let leftIndex = playerIndex;
        let rightIndex = playerIndex + 1;
        while (leftIndex >= 0 || rightIndex <= this.brickCount - 1) {
            if (leftIndex >= 0) {
                if (this.bricks[leftIndex].isBroken) {
                    return leftIndex;
                }
            }
            if (rightIndex <= this.brickCount - 1) {
                if (this.bricks[rightIndex].isBroken) {
                    return rightIndex;
                }
            }
            leftIndex -= 1;
            rightIndex += 1;
        }

        return -1;
    },

    repairOneBrick () {
        let brokenBrickIndex = this.findNearestBrickFromPlayer();
        if (brokenBrickIndex >= 0) {
            this.bricks[brokenBrickIndex].repair();
        }
    },

    checkAllBricksBroken () {
        for (let i = 0; i < this.bricks.length; ++i) {
            if (!this.bricks[i].isBroken) {
                return;
            }
        }

        GameManager.instance.gameOver();
    }
});
