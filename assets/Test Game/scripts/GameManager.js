// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let GameManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        // 这个属性引用了星星预制资源
        enemyPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // 得分音效资源
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:


    onLoad: function () {
        GameManager.instance = this;
        this.enemyPool = new cc.NodePool();
        this.enemies = [];

        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;// + 418;
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        // 生成一个新的星星
        this.createNewEnemy();
        // 初始化计分
        this.score = 0;

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },

    start() {
        this.schedule(function() {
            this.createNewEnemy();
        }, 0.5);
    },

    update(dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            //this.gameOver();
            return;
        }
        this.timer += dt;
    },

    getAllEnemies () {
        return this.enemies;
    },

    createNewEnemy () {
        let enemy = null;

        if (this.enemyPool.length > 0) {
            enemy = this.enemyPool.get();
        } else {
            enemy = cc.instantiate(this.enemyPrefab);
        }
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(enemy);
        this.enemies.push(enemy);
        enemy.getComponent('Enemy').init();
    },

    destroyEnemy (enemy) {
        let index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
        this.enemyPool.put(enemy);
    },

    killEnemy (enemy) {
        this.destroyEnemy(enemy);
        this.gainScore();
    },

    gainScore () {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gameOver () {
        this.player.stopAllActions(); //停止 player 节点的跳跃动作
        cc.director.loadScene('game');
    }
});