let GameManager = require('GameManager')
let EnemyManager = require('EnemyManager')
let BrickManager = require('BrickManager')

const EnemyType = {
    Normal: 0,
    SingleRecovery: 1,
    FullRecovery: 2,
};

cc.Class({
    extends: cc.Component,

    properties: {
        enemyType: 0,
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
        this.init();
    },

    init () {
        this.node.x = BrickManager.instance.getRandomPosX();
        this.node.y = 1200;
        this.resetSpeed();
    },

    update (dt) {
        this.node.y -= this.fallingSpeed * dt;
    },
    
    resetSpeed() {
        let minSpeed = GameManager.instance.curLevel.minSpeed;
        let maxSpeed = GameManager.instance.curLevel.maxSpeed;
        this.fallingSpeed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
    },

    onCollisionEnter (other) {
        if (other.node.group == 'border') {
            this.onHitBrick();
        }
        else if (other.node.group == 'player') {
            GameManager.instance.gameOver();
        } else if (other.node.group == 'brick') {
            this.onHitBrick();
        }
    },

    onHitBrick() {
        if (this.enemyType == EnemyType.Normal) {
            EnemyManager.instance.destroyNormalEnemy(this.node);
        } else if (this.enemyType == EnemyType.SingleRecovery 
                   || this.enemyType == EnemyType.FullRecovery) {
            EnemyManager.instance.destroyRecovery(this.node);
        }
    },

    onHitByBullet () {
        if (this.enemyType == EnemyType.SingleRecovery) {
            BrickManager.instance.repairSingleRandomBrokenBrick();
            EnemyManager.instance.destroyRecovery(this.node);
        } else if (this.enemyType == EnemyType.FullRecovery) {
            BrickManager.instance.repairAllBrokenBricks();
            EnemyManager.instance.destroyRecovery(this.node);
        } else if (this.enemyType == EnemyType.Normal) {
            EnemyManager.instance.killNormalEnemy(this.node);
        }
    }
});
