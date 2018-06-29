let GameManager = require('GameManager')
let EnemyManager = require('EnemyManager')
let BrickManager = require('BrickManager')

const EnemyType = {
    Normal: 0,
    Recover: 1,
};

cc.Class({
    extends: cc.Component,

    properties: {
        fallingSpeed : 0,
        speedMin : 0,
        speedMax : 1080,
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
        this.fallingSpeed = Math.random() * (this.speedMax - this.speedMin) + this.speedMin;
    },

    update (dt) {
        this.node.y -= this.fallingSpeed * dt;
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
        } else if (this.enemyType == EnemyType.Recover) {
            EnemyManager.instance.destroyFullRecovery(this.node);
        }
    },

    onHitByBullet () {
        if (this.enemyType == EnemyType.Recover) {
            BrickManager.instance.repairAllBrokenBricks();
            EnemyManager.instance.destroyFullRecovery(this.node);
        } else if (this.enemyType == EnemyType.Normal) {
            EnemyManager.instance.killNormalEnemy(this.node);
        }
    }
});
