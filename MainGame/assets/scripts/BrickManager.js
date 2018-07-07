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
        rootNode: {
            default: null,
            type:cc.Node
        },
        playerNode: {
            default: null,
            type:cc.Node
        },
        brickSize: 36,
        brickCount: 30,
        groundPosY: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        BrickManager.instance = this;
        this.canvasWidth = GameConfig.DEVICE_WIDTH;

        this.bricks = [];
        // create all bricks from the prefab
        for (let i = 0; i < this.brickCount; i++) {
            let newBrick = cc.instantiate(this.brickPrefab);
            this.rootNode.addChild(newBrick);
            // set brick's position, brick size 36, totally 30 bricks
            newBrick.x = -(this.canvasWidth - this.brickSize) / 2  + i * this.brickSize;
            newBrick.y = this.groundPosY;
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
        let randIndex = Math.floor(Math.random() * 30);
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
        this.repairAllBrokenBricksIndex = 0;
        this.schedule(this.repairAllBrokenBricksCallback, 0.02, this.brickCount);
    },

    repairAllBrokenBricksCallback () {
        this.bricks[this.repairAllBrokenBricksIndex].repair(true, true);
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
