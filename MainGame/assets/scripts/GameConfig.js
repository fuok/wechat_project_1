var GameConfig = {
    DEVICE_WIDTH: 1080, // 屏幕宽度
    DEVICE_HEIGHT: 1920,
    GAME_CANVAS_WIDTH: 1030, // 游戏区域的宽度
    GAME_CANVAS_HEIGHT: 1900, // 游戏区域的高度（不准）

    MAIN_MENU_NUM: "Classic",// 主选择菜单

    GameCore: 0,//游戏得分
    GameHeightScore: 0,//游戏最高分

    IS_GAME_MUSIC: true,// 游戏音效

    IS_GAME_SHARE: false,// 游戏分享
    IS_GAME_START: false, //游戏是否开始
    IS_GAME_OVER: false,// 游戏是否结束
};
module.exports = GameConfig;

