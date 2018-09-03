let AudioManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        shoot: {
            default: null,
            url: cc.AudioClip,
        },
        footstep: {
            default: null,
            url: cc.AudioClip,
        },
        squashFruit: {
            default: null,
            url: cc.AudioClip,
        },
        breakFloor: {
            default: null,
            url: cc.AudioClip,
        },
        singleRecovery: {
            default: null,
            url: cc.AudioClip,
        },
        fullRecovery: {
            default: null,
            url: cc.AudioClip,
        },
        gameStart: {
            default: null,
            url: cc.AudioClip,
        },
        gameOver: {
            default: null,
            url: cc.AudioClip,
        },
        levelUp: {
            default: null,
            url: cc.AudioClip,
        },
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
        AudioManager.instance = this;
        this.footstepID = -1;
    },

    playShoot () {
        cc.audioEngine.play(this.shoot);
    },

    playFootstep () {
        if (this.footstepID == -1) {
            this.footstepID = cc.audioEngine.play(this.footstep, true);
        }
    },

    stopFootstep () {
        if (this.footstepID != -1) {
            cc.audioEngine.stop(this.footstepID);
            this.footstepID = -1;
        }
    },

    playSquashFruit () {
        cc.audioEngine.play(this.squashFruit);
    },

    playBreakFloor () {
        cc.audioEngine.play(this.breakFloor);
    },

    playSingleRecovery () {
        cc.audioEngine.play(this.singleRecovery);
    },

    playFullRecovery () {
        cc.audioEngine.play(this.fullRecovery);
    },

    playGameStart () {
        cc.audioEngine.play(this.gameStart);
    },

    playGameOver () {
        cc.audioEngine.play(this.gameOver);
    },

    playLevelUp () {
        cc.audioEngine.play(this.levelUp);
    },

});
