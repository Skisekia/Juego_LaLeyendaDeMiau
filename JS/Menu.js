class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
    }

    preload() {
        // Carga de imágenes 
        this.load.image('backgroundMenu', 'Assets/Menu/BackgroundMenu.png');
        this.load.image('title', 'Assets/Menu/Titulo.png');
        this.load.image('enter', 'Assets/Menu/Press_Enter.png');
        this.load.audio('menuMusic', 'Assets/Musica/Menu.mp3');
    }

    create() {
        this.startGame();
        // Fondo 
        this.background = this.add.image(0, 0, 'backgroundMenu')
        .setOrigin(0, 0)
        .setScale(this.sys.game.config.width / 1920, this.sys.game.config.height / 1080); 
        // Título
        this.title = this.add.image(this.sys.game.config.width / 2, 80, 'title').setOrigin(0.5);

        // Botón de empezar 
        this.pressEnter = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height - 60, 'enter').setOrigin(0.5);

        // Animación para hacer parpadear el texto de 'press enter'
        this.time.addEvent({
            delay: 700,
            callback: () => { this.pressEnter.visible = !this.pressEnter.visible; },
            loop: true
        });

        // Iniciar el juego al presionar 'Enter'
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('Mundo1');
        });
    } 

    startGame() {
        this.sound.stopAll();
        this.menuMusic = this.sound.add('menuMusic', { volume: 0.05, loop: true });
        this.menuMusic.play();
    }
}