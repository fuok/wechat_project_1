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
        ground: {
            default: null,
            type:cc.Node
        },
        brickSize: 36,
        brickCount: 30,
        canvasWidth: 1080,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        BrickManager.instance = this;

        this.bricks = [];
        // create all bricks from the prefab
        for (let i = 0; i < this.brickCount; i++) {
            let newBrick = cc.instantiate(this.brickPrefab);
            this.ground.addChild(newBrick);
            // set brick's position, brick size 36, totally 30 bricks
            newBrick.x = -(this.canvasWidth - this.brickSize) / 2  + i * this.brickSize;
            newBrick.y = 0;
            this.bricks.push(newBrick);
        }
    },

    start () {
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
            this.bricks[i].getComponent('Brick').isBroken = false;
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
