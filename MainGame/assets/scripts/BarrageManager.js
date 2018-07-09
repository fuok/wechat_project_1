
let nextLevelBarrages = [
    '膜拜大神！！！',
    '难道是直播？',
    '菜鸡一个。。。。',
    '前边的you can you up',
    '我是来看弹幕的',
    '火钳刘明',
    '前方高能',
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
        fxNode.getChildByName('Barrage Node').getComponent(cc.Animation).scheduleOnce(this.destroyFX.bind(this, fxNode), 4);
    },

    destroyFX (fxNode) {
        this.barrageFXPool.put(fxNode);
    },
});
