class Minesweeper {
	public constructor() {
	}
	private static stage: egret.Sprite
	private static stage_w: number	//舞台宽度
	private static stage_h: number	//舞台高度
	private static table_w: number = 640	//表格宽度
	private static table_h: number = 640	//舞台高度
	private static box_w: number	//格子宽度
	private static box_h: number	//格子高度
	private static box_x: number = 30	//格子x数量
	private static box_y: number = 30	//格子y数量
	private static box: Array<any>	//格子列表
	private static bombPercentage: number = 1	//炸弹占比
	private static autoOpenLen: number = 4	//
	public static initTable(_stage: egret.Sprite) {
		this.stage = _stage
		this.box_w = this.table_w / this.box_x
		this.box_h = this.table_h / this.box_y
		this.createBox()
		this.initBoxNum()
		console.log(this.box)
	}

	private static createBox() {
		this.box = new Array()
		for (let i = 0; i < this.box_y; i++) {
			this.box[i] = new Array()
			for (let k = 0; k < this.box_x; k++) {
				let $box = {
					x: k,
					y: i,
					state: 0,
					num: 0,
					type: (Math.floor(Math.random() * 100)) < this.bombPercentage ? 1 : 0
				}
				this.box[i].push($box)
			}
		}
	}
	private static initBoxNum() {
		this.box.forEach(em => {
			em.forEach($box => {
				let num = 0
				if ($box.x - 1 >= 0) {	//4
					this.box[$box.y][$box.x - 1].type == 1 ? num++ : 0
				}
				if ($box.y - 1 >= 0) {	//2
					this.box[$box.y - 1][$box.x].type == 1 ? num++ : 0
				}
				if ($box.x + 1 < this.box_x) {	//6
					this.box[$box.y][$box.x + 1].type == 1 ? num++ : 0
				}
				if ($box.y + 1 < this.box_y) {	//8
					this.box[$box.y + 1][$box.x].type == 1 ? num++ : 0
				}
				if ($box.x - 1 >= 0 && $box.y - 1 >= 0) {	//1
					this.box[$box.y - 1][$box.x - 1].type == 1 ? num++ : 0
				}
				if ($box.x + 1 < this.box_x && $box.y - 1 >= 0) {	//3
					this.box[$box.y - 1][$box.x + 1].type == 1 ? num++ : 0
				}
				if ($box.x - 1 >= 0 && $box.y + 1 < this.box_y) {	//7
					this.box[$box.y + 1][$box.x - 1].type == 1 ? num++ : 0
				}
				if ($box.x + 1 < this.box_x && $box.y + 1 < this.box_y) {	//9
					this.box[$box.y + 1][$box.x + 1].type == 1 ? num++ : 0
				}
				$box.num = num
			})
		})
	}
	public static drawBox(_stage: egret.Sprite) {
		this.box.forEach(em => {
			em.forEach($box => {
				$box.shape = new egret.Shape()
				_stage.addChild($box.shape)
				$box.shape.graphics.beginFill(0x0000ff)
				$box.shape.graphics.lineStyle(1, 0x000000)
				$box.shape.graphics.drawRect(Minesweeper.box_w * $box.x, Minesweeper.box_h * $box.y, Minesweeper.box_w, Minesweeper.box_h)
				$box.shape.graphics.endFill();

				$box.label = new egret.TextField()
				$box.label.width = this.box_w
				$box.label.height = this.box_h
				$box.label.textAlign = egret.HorizontalAlign.CENTER
				$box.label.verticalAlign = egret.VerticalAlign.MIDDLE
				$box.label.text = $box.num
				$box.label.x = Minesweeper.box_w * $box.x
				$box.label.y = Minesweeper.box_h * $box.y
				$box.label.textColor = 0x000000
				_stage.addChild($box.label)
				$box.label.size = 0
				
				$box.shape.touchEnabled = true
				$box.shape.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchStart,[$box])
				$box.shape.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchMove,[$box])
				$box.shape.addEventListener(egret.TouchEvent.TOUCH_END,this.touchEnd,[$box])
			});
		})
	}
	private static touch_state:number = 0
	private static touch_x:number = 0
	private static touch_y:number = 0
	private static touch_act
	private static touchStart(e:egret.TouchEvent){
		if(Minesweeper.touch_state != 0 )return;
		Minesweeper.touch_state = 1
		Minesweeper.touch_x = e.stageX
		Minesweeper.touch_y = e.stageY
		let $box = this[0]
		Minesweeper.touch_act = setTimeout(() => {
			Minesweeper.touchReset()
			Minesweeper.boxOnTag($box)
		}, 400);
	}
	private static touchMove(){}
	private static touchEnd(e:egret.TouchEvent){
		if(Minesweeper.touch_state != 1 )return;
		Minesweeper.touchReset()
		let $box = this[0]
		if (Math.abs(e.stageX - Minesweeper.touch_x) <= 5 && Math.abs(e.stageY - Minesweeper.touch_y) <= 5 ){
			Minesweeper.boxOnClick($box)
		}
	}
	private static touchReset(){
		Minesweeper.touch_state = 0
		clearTimeout(Minesweeper.touch_act)
	}
	private static boxOnTag($box) {
		$box.state = 1
		$box.shape.graphics.beginFill(0xffff00)
		$box.shape.graphics.lineStyle(1, 0x000000)
		$box.shape.graphics.drawRect(Minesweeper.box_w * $box.x, Minesweeper.box_h * $box.y, Minesweeper.box_w, Minesweeper.box_h)
		$box.shape.graphics.endFill();
		$box.label.textColor = 0x000000
		$box.label.text = '!'
		$box.label.size = 18
	}
	private static boxOnClick($box) {
		if ($box.state == 2) return
		$box.state = 2
		if ($box.type == 0) {
			$box.shape.graphics.beginFill(0xffffff)
			$box.shape.graphics.lineStyle(1, 0x000000)
			$box.shape.graphics.drawRect(Minesweeper.box_w * $box.x, Minesweeper.box_h * $box.y, Minesweeper.box_w, Minesweeper.box_h)
			$box.shape.graphics.endFill();
			$box.label.size = 12
			$box.label.text = $box.num
			this.checkOtherBox($box,[Minesweeper.autoOpenLen, Minesweeper.autoOpenLen, Minesweeper.autoOpenLen, Minesweeper.autoOpenLen])
		} else {
			$box.shape.graphics.beginFill(0xff0000)
			$box.shape.graphics.lineStyle(1, 0x000000)
			$box.shape.graphics.drawRect(Minesweeper.box_w * $box.x, Minesweeper.box_h * $box.y, Minesweeper.box_w, Minesweeper.box_h)
			$box.shape.graphics.endFill();
			$box.label.text = '*'
			$box.label.size = 18
		}
	}
	private static openBox($box, forward) {
		if ($box.state == 2) return
		$box.state = 2
		$box.shape.graphics.beginFill(0xffffff)
		$box.shape.graphics.lineStyle(1, 0x000000)
		$box.shape.graphics.drawRect(Minesweeper.box_w * $box.x, Minesweeper.box_h * $box.y, Minesweeper.box_w, Minesweeper.box_h)
		$box.shape.graphics.endFill();
		$box.label.size = 12
		$box.label.text = $box.num
		this.checkOtherBox($box, forward)
	}
	private static checkOtherBox($box, forward) {
		let num = 0, tagArr = new Array()
		if ($box.x - 1 >= 0 && forward[3] > 0) {	//4
			checkIt($box.x - 1, $box.y, 3)
		}
		if ($box.y - 1 >= 0 && forward[0] > 0) {	//2
			checkIt($box.x, $box.y - 1, 0)
		}
		if ($box.x + 1 < this.box_x && forward[1] > 0) {	//6
			checkIt($box.x + 1, $box.y, 1)
		}
		if ($box.y + 1 < this.box_y && forward[2] > 0) {	//8
			checkIt($box.x, $box.y+1, 2)
		}
		tagArr.forEach(em => {
			Minesweeper.openBox(Minesweeper.box[em.y][em.x], forward)
		});
		function checkIt (x: number, y: number, z: number) {
			if (Minesweeper.box[y][x].type == 0 && Minesweeper.box[y][x].state == 0) {
				num++
				tagArr.push({x: x,y: y})
				if(forward[z] > 0 && Minesweeper.box[y][x].num !=0) {
					forward[z]--
				}
			} else {
				forward[z] = 0
			}
		}
	}
}