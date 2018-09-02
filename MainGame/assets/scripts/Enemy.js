let ParticleManager = require('ParticleManager');
let AudioManager = require('AudioManager');
let BrickManager = require('BrickManager');
let EnemyManager = require('EnemyManager')
let GameManager = require('GameManager');

const EnemyType = {
    Normal: 0,
    SingleRecovery: 1,
    FullRecovery: 2,
};

cc.Class({
    extends: cc.Component,

    properties: {
        enemyType: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
    },

    init (pos, fallingSpeed) {
        this.node.position = pos;
        this.fallingSpeed = fallingSpeed;
        this.brickIndex = BrickManager.instance.getBrickIndexFromX(this.node.position.x);
    },

    update (dt) {
        this.node.y -= this.fallingSpeed * dt * EnemyManager.instance.timeScale;
        if (this.node.y < BrickManager.instance.groundPosY + 50 /* brick size */) {
            this.onHitBrick();
            let brickIndex = BrickManager.instance.getBrickIndexFromX(this.node.x);
            let brick = BrickManager.instance.bricks[brickIndex];
            if (!brick.isBroken) {
                brick.break();
            }
        }
    },
    
    onCollisionEnter (other) {
        if (other.node.group == 'border') {
            this.onHitBrick();
        }
        else if (other.node.group == 'player') {
            // 这里有待商榷，是让enemy简单消失还是子弹效果，之后再说
            this.onHitBrick();
        }
    },

    eliminate () {
        if (this.enemyType == EnemyType.Normal) {
            EnemyManager.instance.destroyNormalEnemy(this.node);
        } else if (this.enemyType == EnemyType.SingleRecovery 
                   || this.enemyType == EnemyType.FullRecovery) {
            EnemyManager.instance.destroyRecovery(this.node);
        }
    },

    onHitBrick() {
        this.eliminate();
    },

    onHitByBullet (direction=1) {
        // 被子弹击中的粒子效果
        ParticleManager.instance.createEnemyHitFX1(this.node.position, direction);
        ParticleManager.instance.createEnemyHitFX2(this.node.position, direction);
        ParticleManager.instance.createEnemyHitFX3(this.node.position, direction);

        if (this.enemyType == EnemyType.SingleRecovery) {
            EnemyManager.instance.destroyRecovery(this.node);
            BrickManager.instance.repairOneBrick();
            AudioManager.instance.playSingleRecovery();  // 音效
        } else if (this.enemyType == EnemyType.FullRecovery) {
            EnemyManager.instance.destroyRecovery(this.node);
            BrickManager.instance.repairAllBrokenBricks();
            AudioManager.instance.playFullRecovery();  // 音效
        } else if (this.enemyType == EnemyType.Normal) {
            EnemyManager.instance.destroyNormalEnemy(this.node);
        }
    }
});
