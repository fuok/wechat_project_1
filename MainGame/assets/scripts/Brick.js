let BrickManager = require('BrickManager');
let ParticleManager = require('ParticleManager');

cc.Class({
    extends: cc.Component,

    properties: {
        enemies:[],
        isBroken: {
            get () {
                return this._isBroken;
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._isBroken = false;
    },

    start () {

    },

    // update (dt) {},

    addEnemy(enemy) {
        this.enemies.push(enemy);
    },
    removeEnemy(enemy) {
        let index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    },
    break () {
        // 粒子效果
        ParticleManager.instance.createBrickHitFX(this.node.position);

        this._isBroken = true;
        this.node.active = false;
        BrickManager.instance.checkAllBricksBroken();
    },
    onCollisionEnter: function(other) {
        if (other.node.group == 'enemy') {
            this.break();
        }
    },

    repair (playFX=true, force=false) {
        if (this.isBroken == true || force) {
            this._isBroken = false;
            this.node.active = true;
            // 播放修复砖块的特效
            if (playFX) {
                ParticleManager.instance.createBrickRepairFX(this.node.position);
            }
            // 干掉该列的敌人
            while (this.enemies.length > 0) {
                console.log('Enemy removed!');
                this.enemies[this.enemies.length - 1].onHitByBullet(10);
            }
        }
    }
});
