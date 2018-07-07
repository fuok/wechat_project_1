let ParticleManager = require('ParticleManager');
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
    },

    update (dt) {
        this.node.y -= this.fallingSpeed * dt * EnemyManager.instance.timeScale;
    },
    
    onCollisionEnter (other) {
        if (other.node.group == 'border') {
            this.onHitBrick();
        }
        else if (other.node.group == 'player') {
            // 这里有待商榷，是让enemy简单消失还是子弹效果，之后再说
            this.onHitBrick();
        } else if (other.node.group == 'brick') {
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

    onHitByBullet (score) {
        // 被子弹击中的粒子效果
        ParticleManager.instance.createEnemyHitFX1(this.node.position);
        ParticleManager.instance.createEnemyHitFX2(this.node.position);
        ParticleManager.instance.createEnemyHitFX3(this.node.position);


        if (this.enemyType == EnemyType.SingleRecovery) {
            EnemyManager.instance.destroyRecovery(this.node);
            BrickManager.instance.repairOneBrick();
        } else if (this.enemyType == EnemyType.FullRecovery) {
            EnemyManager.instance.destroyRecovery(this.node);
            BrickManager.instance.repairAllBrokenBricks();
        } else if (this.enemyType == EnemyType.Normal) {
            EnemyManager.instance.destroyNormalEnemy(this.node);
        }
    }
});
