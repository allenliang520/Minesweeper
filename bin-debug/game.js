var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this) || this;
        _this.shape = new egret.Shape();
        _this.gameState = 0;
        return _this;
    }
    Game.prototype.initGame = function () {
        Minesweeper.initTable(this);
        this._sprite = new egret.Sprite();
        this.addChild(this._sprite);
        Minesweeper.drawBox(this._sprite);
    };
    Game.prototype.endGame = function () {
        this.gameState = 2;
    };
    return Game;
}(egret.Sprite));
__reflect(Game.prototype, "Game");
//# sourceMappingURL=game.js.map