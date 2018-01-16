var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Minesweeper = (function () {
    function Minesweeper() {
    }
    Minesweeper.initTable = function (_stage) {
        this.stage = _stage;
        this.box_w = this.table_w / this.box_x;
        this.box_h = this.table_h / this.box_y;
        this.createBox();
        this.initBoxNum();
        console.log(this.box);
    };
    Minesweeper.createBox = function () {
        this.box = new Array();
        for (var i = 0; i < this.box_y; i++) {
            this.box[i] = new Array();
            for (var k = 0; k < this.box_x; k++) {
                var $box = {
                    x: k,
                    y: i,
                    state: 0,
                    num: 0,
                    type: (Math.floor(Math.random() * 100)) < this.bombPercentage ? 1 : 0
                };
                this.box[i].push($box);
            }
        }
    };
    Minesweeper.initBoxNum = function () {
        var _this = this;
        this.box.forEach(function (em) {
            em.forEach(function ($box) {
                var num = 0;
                if ($box.x - 1 >= 0) {
                    _this.box[$box.y][$box.x - 1].type == 1 ? num++ : 0;
                }
                if ($box.y - 1 >= 0) {
                    _this.box[$box.y - 1][$box.x].type == 1 ? num++ : 0;
                }
                if ($box.x + 1 < _this.box_x) {
                    _this.box[$box.y][$box.x + 1].type == 1 ? num++ : 0;
                }
                if ($box.y + 1 < _this.box_y) {
                    _this.box[$box.y + 1][$box.x].type == 1 ? num++ : 0;
                }
                if ($box.x - 1 >= 0 && $box.y - 1 >= 0) {
                    _this.box[$box.y - 1][$box.x - 1].type == 1 ? num++ : 0;
                }
                if ($box.x + 1 < _this.box_x && $box.y - 1 >= 0) {
                    _this.box[$box.y - 1][$box.x + 1].type == 1 ? num++ : 0;
                }
                if ($box.x - 1 >= 0 && $box.y + 1 < _this.box_y) {
                    _this.box[$box.y + 1][$box.x - 1].type == 1 ? num++ : 0;
                }
                if ($box.x + 1 < _this.box_x && $box.y + 1 < _this.box_y) {
                    _this.box[$box.y + 1][$box.x + 1].type == 1 ? num++ : 0;
                }
                $box.num = num;
            });
        });
    };
    Minesweeper.drawBox = function (_stage) {
        var _this = this;
        this.box.forEach(function (em) {
            em.forEach(function ($box) {
                $box.shape = new egret.Shape();
                _stage.addChild($box.shape);
                $box.shape.graphics.beginFill(0x0000ff);
                $box.shape.graphics.lineStyle(1, 0x000000);
                $box.shape.graphics.drawRect(Minesweeper.box_w * $box.x, Minesweeper.box_h * $box.y, Minesweeper.box_w, Minesweeper.box_h);
                $box.shape.graphics.endFill();
                $box.label = new egret.TextField();
                $box.label.width = _this.box_w;
                $box.label.height = _this.box_h;
                $box.label.textAlign = egret.HorizontalAlign.CENTER;
                $box.label.verticalAlign = egret.VerticalAlign.MIDDLE;
                $box.label.text = $box.num;
                $box.label.x = Minesweeper.box_w * $box.x;
                $box.label.y = Minesweeper.box_h * $box.y;
                $box.label.textColor = 0x000000;
                _stage.addChild($box.label);
                $box.label.size = 0;
                $box.shape.touchEnabled = true;
                $box.shape.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.touchStart, [$box]);
                $box.shape.addEventListener(egret.TouchEvent.TOUCH_MOVE, _this.touchMove, [$box]);
                $box.shape.addEventListener(egret.TouchEvent.TOUCH_END, _this.touchEnd, [$box]);
            });
        });
    };
    Minesweeper.touchStart = function (e) {
        if (Minesweeper.touch_state != 0)
            return;
        Minesweeper.touch_state = 1;
        Minesweeper.touch_x = e.stageX;
        Minesweeper.touch_y = e.stageY;
        var $box = this[0];
        Minesweeper.touch_act = setTimeout(function () {
            Minesweeper.touchReset();
            Minesweeper.boxOnTag($box);
        }, 400);
    };
    Minesweeper.touchMove = function () { };
    Minesweeper.touchEnd = function (e) {
        if (Minesweeper.touch_state != 1)
            return;
        Minesweeper.touchReset();
        var $box = this[0];
        if (Math.abs(e.stageX - Minesweeper.touch_x) <= 5 && Math.abs(e.stageY - Minesweeper.touch_y) <= 5) {
            Minesweeper.boxOnClick($box);
        }
    };
    Minesweeper.touchReset = function () {
        Minesweeper.touch_state = 0;
        clearTimeout(Minesweeper.touch_act);
    };
    Minesweeper.boxOnTag = function ($box) {
        $box.state = 1;
        $box.shape.graphics.beginFill(0xffff00);
        $box.shape.graphics.lineStyle(1, 0x000000);
        $box.shape.graphics.drawRect(Minesweeper.box_w * $box.x, Minesweeper.box_h * $box.y, Minesweeper.box_w, Minesweeper.box_h);
        $box.shape.graphics.endFill();
        $box.label.textColor = 0x000000;
        $box.label.text = '!';
        $box.label.size = 18;
    };
    Minesweeper.boxOnClick = function ($box) {
        if ($box.state == 2)
            return;
        $box.state = 2;
        if ($box.type == 0) {
            $box.shape.graphics.beginFill(0xffffff);
            $box.shape.graphics.lineStyle(1, 0x000000);
            $box.shape.graphics.drawRect(Minesweeper.box_w * $box.x, Minesweeper.box_h * $box.y, Minesweeper.box_w, Minesweeper.box_h);
            $box.shape.graphics.endFill();
            $box.label.size = 12;
            $box.label.text = $box.num;
            this.checkOtherBox($box, [Minesweeper.autoOpenLen, Minesweeper.autoOpenLen, Minesweeper.autoOpenLen, Minesweeper.autoOpenLen]);
        }
        else {
            $box.shape.graphics.beginFill(0xff0000);
            $box.shape.graphics.lineStyle(1, 0x000000);
            $box.shape.graphics.drawRect(Minesweeper.box_w * $box.x, Minesweeper.box_h * $box.y, Minesweeper.box_w, Minesweeper.box_h);
            $box.shape.graphics.endFill();
            $box.label.text = '*';
            $box.label.size = 18;
        }
    };
    Minesweeper.openBox = function ($box, forward) {
        if ($box.state == 2)
            return;
        $box.state = 2;
        $box.shape.graphics.beginFill(0xffffff);
        $box.shape.graphics.lineStyle(1, 0x000000);
        $box.shape.graphics.drawRect(Minesweeper.box_w * $box.x, Minesweeper.box_h * $box.y, Minesweeper.box_w, Minesweeper.box_h);
        $box.shape.graphics.endFill();
        $box.label.size = 12;
        $box.label.text = $box.num;
        this.checkOtherBox($box, forward);
    };
    Minesweeper.checkOtherBox = function ($box, forward) {
        var num = 0, tagArr = new Array();
        if ($box.x - 1 >= 0 && forward[3] > 0) {
            checkIt($box.x - 1, $box.y, 3);
        }
        if ($box.y - 1 >= 0 && forward[0] > 0) {
            checkIt($box.x, $box.y - 1, 0);
        }
        if ($box.x + 1 < this.box_x && forward[1] > 0) {
            checkIt($box.x + 1, $box.y, 1);
        }
        if ($box.y + 1 < this.box_y && forward[2] > 0) {
            checkIt($box.x, $box.y + 1, 2);
        }
        tagArr.forEach(function (em) {
            Minesweeper.openBox(Minesweeper.box[em.y][em.x], forward);
        });
        function checkIt(x, y, z) {
            if (Minesweeper.box[y][x].type == 0 && Minesweeper.box[y][x].state == 0) {
                num++;
                tagArr.push({ x: x, y: y });
                if (forward[z] > 0 && Minesweeper.box[y][x].num != 0) {
                    forward[z]--;
                }
            }
            else {
                forward[z] = 0;
            }
        }
    };
    Minesweeper.table_w = 640; //表格宽度
    Minesweeper.table_h = 640; //舞台高度
    Minesweeper.box_x = 30; //格子x数量
    Minesweeper.box_y = 30; //格子y数量
    Minesweeper.bombPercentage = 1; //炸弹占比
    Minesweeper.autoOpenLen = 4; //
    Minesweeper.touch_state = 0;
    Minesweeper.touch_x = 0;
    Minesweeper.touch_y = 0;
    return Minesweeper;
}());
__reflect(Minesweeper.prototype, "Minesweeper");
//# sourceMappingURL=Minesweeper.js.map