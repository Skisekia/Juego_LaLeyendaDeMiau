class Win extends Phaser.Scene {
    constructor() {
        super({ key: 'Win' });
    }

    init(data) {
        this.finalTime = data.time; 
    }

    create() {
        this.graphics = this.add.graphics({ fillStyle: { color: 0x008000, alpha: 0.5 } });
        this.graphics.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        const victoryText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - 100, `¡Escapaste en: ${this.finalTime} segundos!`, {
            fontSize: '32px',
            fill: '#ffffff'
        });
        victoryText.setOrigin(0.5);

        const returnText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 50, 'Presiona ENTER para volver al menú', {
            fontSize: '20px',
            fill: '#ffffff'
        });
        returnText.setOrigin(0.5);

        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.start('Menu');
        });
    }
}