let GameManager = require('GameManager');
let EnemyManager = require('EnemyManager');
let BrickManager = require('BrickManager');
let ParticleManager = require('ParticleManager');

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
            // 这里有待商榷，是让enemy简单消失还是子弹效果，之后再说
            this.onHitBrick();
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
        // 被子弹击中的粒子效果
        ParticleManager.instance.createEnemyHitFX1(this.node.position);
        ParticleManager.instance.createEnemyHitFX2(this.node.position);
        ParticleManager.instance.createEnemyHitFX3(this.node.position);

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
