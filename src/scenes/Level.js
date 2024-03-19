
// You can write more code here
// let this.gameOptions = {
//     shipHorizontalSpeed: 400,       // ship horizontal speed, can be modified to change gameplay
//     barrierSpeed: 100,              // barrier vertical speed, can be modified to change gameplay
//     barrierGap: 150,                // gap between two barriers, in pixels
//     safeZones: 5                    // amount of possible safe zone. It affects safe zone width
// }


/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// gamePlayBg
		const gamePlayBg = this.add.image(540, 960, "gamePlayBg");
		gamePlayBg.scaleX = 1.01;
		gamePlayBg.alpha = 0.3;
		gamePlayBg.alphaTopLeft = 0.3;
		gamePlayBg.alphaTopRight = 0.3;
		gamePlayBg.alphaBottomLeft = 0.3;
		gamePlayBg.alphaBottomRight = 0.3;

		// container_gameOver
		const container_gameOver = this.add.container(0, 0);
		container_gameOver.visible = false;

		// gameOverBg
		const gameOverBg = this.add.image(540, 960, "gameOverBg");
		gameOverBg.scaleX = 1.01;
		gameOverBg.scaleY = 1.01;
		container_gameOver.add(gameOverBg);

		// text_1
		const text_1 = this.add.text(540, 550, "", {});
		text_1.setOrigin(0.5, 0.5);
		text_1.text = "Game Over";
		text_1.setStyle({ "fontFamily": "Arial", "fontSize": "150px", "fontStyle": "bold" });
		container_gameOver.add(text_1);

		// replayBtn
		const replayBtn = this.add.image(540, 1400, "replay");
		container_gameOver.add(replayBtn);

		// text_gameOverScore
		const text_gameOverScore = this.add.text(540, 850, "", {});
		text_gameOverScore.setOrigin(0.5, 0.5);
		text_gameOverScore.text = "Score: 0";
		text_gameOverScore.setStyle({ "fontFamily": "Arial", "fontSize": "100px", "fontStyle": "bold" });
		container_gameOver.add(text_gameOverScore);

		// text_gameOverBest
		const text_gameOverBest = this.add.text(536, 1020, "", {});
		text_gameOverBest.setOrigin(0.5, 0.5);
		text_gameOverBest.text = "Best: 0";
		text_gameOverBest.setStyle({ "fontFamily": "Arial", "fontSize": "100px", "fontStyle": "bold" });
		container_gameOver.add(text_gameOverBest);

		this.replayBtn = replayBtn;
		this.text_gameOverScore = text_gameOverScore;
		this.text_gameOverBest = text_gameOverBest;
		this.container_gameOver = container_gameOver;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Image} */
	replayBtn;
	/** @type {Phaser.GameObjects.Text} */
	text_gameOverScore;
	/** @type {Phaser.GameObjects.Text} */
	text_gameOverBest;
	/** @type {Phaser.GameObjects.Container} */
	container_gameOver;

	/* START-USER-CODE */

	// Write more your code here

	create() {

		this.editorCreate();
		this.input.setDefaultCursor('pointer');

		this.gameOptions = {
			shipHorizontalSpeed: 520,
			barrierSpeed: 100,
			barrierGap: 280,
			safeZones: 4
		}

		this.score = 0;
		this.isGameOver = false;
		this.increaseBarrierAndShipSpeed = null;

		this.bestScore = parseInt(localStorage.getItem('bestScoreRadical')) || 0;

		this.ship = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height / 5 * 4, "ship");
		this.ship.setScale(1);
		this.fireParticle();
		this.input.on("pointerdown", this.moveShip, this);
		this.input.on("pointerup", this.stopShip, this);
		this.addBarriers();

		this.scoreAndBestText();

		this.increaseBarrierAndShipSpeed = setInterval(() => {
			if (this.isGameOver) {
                clearInterval(this.increaseBarrierAndShipSpeed);
            }
			this.increaseBarrierSpeed();
			this.increaseShipSpeed();
			this.reduceBarrierGap();
		}, 5000);
	}

	scoreAndBestText() {
		this.scoreText = this.add.text(35, 16, 'Score: 0', {
			fontSize: '64px', fill: '#fafefd', fontFamily: 'Arial', fontStyle: 'bold'
		});

		this.bestScoreText = this.add.text(790, 16, 'Best: ' + this.bestScore, {
			fontSize: '64px', fill: '#fafefd', fontFamily: 'Arial', fontStyle: 'bold'
		});
	}

	moveShip(p) {
		let speedMultiplier = (p.x < this.game.config.width / 2) ? -1 : 1;
		this.ship.body.velocity.x = this.gameOptions.shipHorizontalSpeed * speedMultiplier;
	}
	stopShip() {
		this.ship.body.velocity.x = 0;
	}
	addBarriers() {
		this.horizontalBarrierGroup = this.physics.add.group()
		for (let i = 0; i < 10; i++) {
			this.horizontalBarrierPool = [this.horizontalBarrierGroup.create(0, 0, "barrier").setScale(2), this.horizontalBarrierGroup.create(0, 0, "barrier").setScale(2)];
			this.placeHorizontalBarriers();
		}
		this.horizontalBarrierGroup.setVelocityY(this.gameOptions.barrierSpeed);
	}
	getTopmostBarrier() {
		let topmostBarrier = this.game.config.height;
		this.horizontalBarrierGroup.getChildren().forEach(function (barrier) {
			topmostBarrier = Math.min(topmostBarrier, barrier.y)
		});
		return topmostBarrier;
	}
	placeHorizontalBarriers() {
		let topmost = this.getTopmostBarrier();
		let holePosition = Phaser.Math.Between(0, this.gameOptions.safeZones - 1);
		this.horizontalBarrierPool[0].x = holePosition * this.game.config.width / this.gameOptions.safeZones;
		this.horizontalBarrierPool[0].y = topmost - this.gameOptions.barrierGap;
		this.horizontalBarrierPool[0].setOrigin(1, 0);
		this.horizontalBarrierPool[1].x = (holePosition + 1) * this.game.config.width / this.gameOptions.safeZones;
		this.horizontalBarrierPool[1].y = topmost - this.gameOptions.barrierGap;
		this.horizontalBarrierPool[1].setOrigin(0, 0);
		this.horizontalBarrierPool = [];
	}

	fireParticle() {
		let gravityDirection = (this.ship.body.velocity.x < 0) ? 200 : -200;
		this.emitter = this.add.particles(0, 0, "particle", {
			color: [0xfacc32, 0xf89800, 0xf83630, 0x9f0406],
			colorEase: 'quad.out',
			lifespan: 600,
			angle: { min: 100, max: 70 },
			scale: { start: 0.3, end: 0, ease: 'sine.out' },
			speed: 100,
			advance: 0,
			gravityY: 400,
			gravityY: -gravityDirection,
			blendMode: 'ADD'
		});

		// this.emitter.startFollow(this.ship);
		this.emitter.startFollow(this.ship, 0, 20, true);
	}

	update() {
		if (!this.isGameOver) {
			this.ship.x = Phaser.Math.Wrap(this.ship.x, 0, this.game.config.width);
			this.horizontalBarrierGroup.getChildren().forEach((barrier) => {
				if (barrier.active && this.ship.y < barrier.y) {
					this.score++;
					this.scoreText.setText('Score: ' + this.score);
					if (this.score > this.bestScore) {
						this.bestScore = this.score;
						localStorage.setItem('bestScoreRadical', this.bestScore);	
					}
					barrier.active = false;
				}
			});

			this.physics.world.collide(this.ship, this.horizontalBarrierGroup, function () {
				this.gameOver();
			}, null, this);

			this.horizontalBarrierGroup.getChildren().forEach(function (barrier) {
				if (barrier.y > this.game.config.height) {
					barrier.active = true;
					this.horizontalBarrierPool.push(barrier);
					if (this.horizontalBarrierPool.length == 2) {
						this.placeHorizontalBarriers();
					}
				}
			}, this);
		}
	}

	increaseBarrierSpeed() {
		this.gameOptions.barrierSpeed += 7;
		this.horizontalBarrierGroup.setVelocityY(this.gameOptions.barrierSpeed);
	}

	increaseShipSpeed() {
		this.gameOptions.shipHorizontalSpeed += 10;
	}

	reduceBarrierGap() {
		this.gameOptions.barrierGap -= 2;
	}

	gameOver() {
		this.isGameOver = true;
		this.physics.pause();
		// this.emitter.destroy();
		this.emitter.explode(1500);
		this.cameras.main.shake(500, 0.01);
		clearInterval(this.increaseBarrierAndShipSpeed);
		setTimeout(() => {
			this.bestScoreText.setText('Best: ' + this.bestScore);
			this.replay();
		}, 2000);
	}

	replay() {
		this.pointerOverAndOut();
		this.container_gameOver.setDepth(1);
		this.text_gameOverScore.setText('Score: ' + this.score);
		this.text_gameOverBest.setText('Best: ' + this.bestScore);
		this.container_gameOver.visible = true;
		this.replayBtn.setInteractive().on('pointerdown', () => {
			this.scene.restart();
		});
	}

	pointerOverAndOut(){
		this.pointerOver = (aBtn,scale) => {
			this.input.setDefaultCursor('pointer');
			this.tweens.add({
				targets: aBtn,
				scaleX: scale + 0.05,
				scaleY: scale + 0.05,
				duration: 50
			})
		}
		this.pointerOut = (aBtn,scale) => {
			this.input.setDefaultCursor('default');
			this.tweens.add({
				targets: aBtn,
				scaleX: scale,
				scaleY: scale,
				duration: 50,
				onComplete: () => {
					aBtn.forEach((btn) => {
						btn.setScale(scale);
					});
				}
			})
		}

		this.replayBtn.on('pointerover', () => this.pointerOver([this.replayBtn],1));
		this.replayBtn.on('pointerout', () => this.pointerOut([this.replayBtn],1));
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
