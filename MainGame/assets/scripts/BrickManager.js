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
            this.bricks.push(newBrick);
        }
    },

    resetAllBricks() {
        for (let i = 0; i < this.brickCount; i++) {
            this.bricks[i].getComponent('Brick').repair(false);
        }
    },

    // update (dt) {},
    getBrickIndexFromX (x) {
        return parseInt((x + this.canvasWidth / 2) / this.brickSize);
    },

    getRandomPosX () {
        let randIndex = Math.floor(Math.random() * 30);
        return this.bricks[randIndex].x;
    },

    isPosXWalkable (x) {
        if (x < -this.canvasWidth / 2 || x >= this.canvasWidth / 2) {
            return false;
        }
        let index = this.getBrickIndexFromX(x);
        return !this.bricks[index].getComponent('Brick').isBroken;
    },

    repairAllBrokenBricks () {
        for (let i = 0; i < this.bricks.length; i++) {
            this.bricks[i].getComponent('Brick').repair();
        }
    },

    repairSingleRandomBrokenBrick () {
        let brokenBricks = [];
        for (let i = 0; i < this.bricks.length; i++) {
            if (this.bricks[i].getComponent('Brick').isBroken) {
                brokenBricks.push(this.bricks[i]);
            }
        }

        if (brokenBricks.length > 0) {
            let randomBrickIndex = Math.floor(Math.random() * brokenBricks.length);
            brokenBricks[randomBrickIndex].getComponent('Brick').repair();
        }
    },

    checkAllBricksBroken () {
        for (let i = 0; i < this.bricks.length; ++i) {
            if (!this.bricks[i].getComponent('Brick').isBroken) {
                return;
            }
        }

        GameManager.instance.gameOver();
    }
});
