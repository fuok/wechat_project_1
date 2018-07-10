
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
    'UP主，用枪打水果',
    '',
    '',
    '那不是枪，是扔石头吧。。。。',
    '',
    '臂力惊人',
    '臂力惊人',
    '',
    '这游戏有点轴啊，只能45度角攻击',
    '',
    '试试一枪穿俩，上分快',
    '串糖葫芦，爽',
    '水果掉地板上会把地板砸坏，都砸坏你就玩完了',
    '',
    '前边的，打草莓可以修复一块地板',
    '',
    '',
    '这游戏有个隐藏系统，持续连击水果可以开启慢动作！',
    '',
    '',
    '',
    '亲测有效',
    '亲测有效',
    '',
    '',
    '这游戏我玩了上百遍了，想活下去要尽量保持连击',
    '',
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
    },

    start () {
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
        this.createBarrageFX(tutorialBarrages[this.tutorialBarrageIndex]);
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
        // pos参数是相对于rootNode的pos
        let row = Math.floor(Math.random() * 3);
        let y = 800 - row * 70;
        fxNode.position = cc.v2(0, y);
        fxNode.getChildByName('Barrage Node').getChildByName('Barrage Label').getComponent(cc.Label).string = content;
        this.rootNode.addChild(fxNode);
        fxNode.getChildByName('Barrage Node').getComponent(cc.Animation).scheduleOnce(this.destroyFX.bind(this, fxNode), 6);
    },

    destroyFX (fxNode) {
        this.barrageFXPool.put(fxNode);
    },
});
