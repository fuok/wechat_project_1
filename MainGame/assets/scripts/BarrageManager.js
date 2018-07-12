let nextLevelBarrages = [
    '膜拜大神！！！',
    '难道是直播？',
    '菜鸡一个。。。。',
    '前边的you can you up',
    '我是来看弹幕的',
    '火钳刘明',
    '这动作有毒',
    '666666',
    '我已经看到结局了',
    '卢本伟牛X',
    '是在下输了',
    '游戏体验极差',
    '战斗力五',
    '帅不过三秒',
    '我永远喜欢企鹅',
    '令人窒息的操作',
];

let tutorialBarrages = [
    '',
    '主播，用枪打水果',
    '',
    '',
    '这货是扔石头吧',
    '',
    '臂力惊人',
    '臂力惊人',
    '',
    '策划脑抽吧，只能45度角攻击',
    '',
    '试试一发射仨，上分快',
    '串糖葫芦，爽',
    '水果会砸坏地板，一会儿就凉凉',
    '',
    '前边的，打草莓能修复地板',
    '',
    '',
    '发现个隐藏系统，持续连击会出现慢动作',
    '',
    '',
    '',
    '亲测有效',
    '亲测有效',
    '',
    '',
    '我打了一下午，想得高分要一直保持连击',
    '',
];

let barrageColors = [
    cc.color(204, 255, 0, 255),
    cc.color(247, 57, 255, 255),
    cc.color(55, 255, 159, 255),
];

let BarrageManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        rootNode: {
            default: null,
            type: cc.Node
        },

        barrageFXPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        BarrageManager.instance = this;
        this.GameManager = require('GameManager');
        this.barrageFXPool = new cc.NodePool();
        this.barrages = [];
    },

    start () {
    },

    update (dt) {
        for (let i = 0; i < this.barrages.length; i++) {
            let barrageNode = this.barrages[i];
            barrageNode.x -= dt * barrageNode.speed;
            if (barrageNode.position.x < -2000) {
                this.destroyFX(barrageNode);
            }
        }
    },

    addCombo(comboCount) {
        this.createBarrageFX(comboCount + '连!!!! (＃°Д°)');
    },

    cancelAllBarrageSchedules () {
        this.unschedule(this.tutorialBarrage);
    },

    setTutorialBarrages () {
        this.tutorialBarrageIndex = 0;
        this.schedule(this.tutorialBarrage, 1, tutorialBarrages.length - 1);
    },

    tutorialBarrage () {
        if (tutorialBarrages[this.tutorialBarrageIndex] != '') {
            this.createBarrageFX(tutorialBarrages[this.tutorialBarrageIndex]);
        }
        this.tutorialBarrageIndex += 1;
    },

    generateNextLevelBarrage() {
        let i = Math.floor(Math.random() * nextLevelBarrages.length);
        this.createBarrageFX(nextLevelBarrages[i]);
    },

    createBarrageFX (content) {
        let fxNode = null;

        if (this.barrageFXPool.length > 0) {
            fxNode = this.barrageFXPool.get();
        } else {
            fxNode = cc.instantiate(this.barrageFXPrefab);
        }
        this.barrages.push(fxNode);
        // pos参数是相对于rootNode的pos
        let row = Math.floor(Math.random() * 3);
        let y = 800 - row * 70;
        fxNode.position = cc.v2(1000, y);
        fxNode.speed = 700 + Math.random() * 200;
        fxNode.color = barrageColors[Math.floor(Math.random() * barrageColors.length)];
        fxNode.getComponent(cc.Label).string = content;
        this.rootNode.addChild(fxNode);
    },

    destroyFX (fxNode) {
        let index = this.barrages.indexOf(fxNode);
        if (index > -1) {
            this.barrages.splice(index, 1);
        }
        this.barrageFXPool.put(fxNode);
    },
});
