let BrickManager = require('BrickManager');
let AudioManager = require('AudioManager');
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

    initPos(x, y) {
        this.node.x = x;
        this.node.y = y;
        this.initialPosY = y;
    },

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
        if (!this.isBroken) {
            ParticleManager.instance.createBrickHitFX(this.node.position);

            this._isBroken = true;
            this.node.active = false;
            BrickManager.instance.checkAllBricksBroken();
            AudioManager.instance.playBreakFloor();  // 音效
        }
    },

    repair (playFX=true, force=false) {
        // 干掉该列的敌人，这一步我们暂定不需要判断是否已经坏了，一律强制干掉敌人
        while (this.enemies.length > 0) {
            this.enemies[this.enemies.length - 1].onHitByBullet();
        }

        if (this.isBroken == true || force) {
            this._isBroken = false;
            this.node.active = true;
            // 播放修复砖块的特效
            if (playFX) {
                this.node.getComponent(cc.Animation).play();
            }
        }
    },

    repairAnimComplete() {
        this.node.y = this.initialPosY;
    }

});
