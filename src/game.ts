class Game extends egret.Sprite {
	public constructor() {
		super()
	}
	private _sprite : egret.Sprite
	private shape:egret.Shape = new egret.Shape();
	public gameState:number = 0
	public initGame () {
		Minesweeper.initTable(this)
		this._sprite = new egret.Sprite()
		this.addChild(this._sprite)
		Minesweeper.drawBox(this._sprite)
	}
	public endGame () {
		this.gameState = 2
	}
}