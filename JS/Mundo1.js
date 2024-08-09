class Mundo1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Mundo1' }); // Inicializa la escena
        this.danoCooldown = false;
        this.vidas = 3;  // Asegúrate de que las vidas se inicializan correctamente
        this.slimes = []; 
        this.bats = [];
        this.timer = 0;
        this.timerText = null;
    }

    preload() {
        this.load.audio('mundoMusic', 'Assets/Musica/Mundo1.mp3');
        // Precargar todo lo que necesito para el Mundo1
        this.load.image('background', 'Assets/environment/background.png');
        this.load.image('middleground', 'Assets/environment/middleground.png');
        this.load.image('tiles', 'Assets/environment/tileset.png');
        this.load.image('collisions', 'Assets/environment/collisions.png');
        this.load.tilemapTiledJSON('map', 'Assets/Mundos/Mundo1.json');

        this.loadSprites(); // Llamo a la funcion para cargar las animaciones del personaje

        //Corazones
        this.load.image('tresCorazones', 'Assets/Personaje/Vida/3_Corazones.png');
        this.load.image('dosCorazones', 'Assets/Personaje/Vida/2_Corazones.png');
        this.load.image('unCorazon', 'Assets/Personaje/Vida/1_Corazon.png');

        //SLIME
        for (let i = 0; i <= 3; i++) {
            this.load.image(`slimeMove${i}`, `Assets/Enemigos/Slime/Moverse/slime-move-${i}.png`);
            this.load.image(`slimeIdle${i}`, `Assets/Enemigos/Slime/Parado/slime-idle-${i}.png`);
            this.load.image(`slimeDie${i}`, `Assets/Enemigos/Slime/Muerte/slime-die-${i}.png`);
        }
        //BAT
        for (let i = 0; i <= 3; i++) {
            this.load.image(`batIdle${i}`, `Assets/Enemigos/Bat/Idle/SimpleEnemies Bat_Idle_${i}.png`);
        }
        for (let i = 0; i <= 4; i++) {
            this.load.image(`batDeath${i}`, `Assets/Enemigos/Bat/Death/SimpleEnemies Bat_Death_${i}.png`);
        }
    }

    loadSprites() {
        // Cargo los sprites del personaje con ciclo for para no tener que copiar y pegar por cada imagen
        for (let i = 1; i <= 8; i++) {
            this.load.image(`parado${i}`, `Assets/Personaje/Parado/Parado${i}.png`);
        }
        for (let i = 1; i <= 4; i++) {
            this.load.image(`brincar${i}`, `Assets/Personaje/Brincar/Brincar${i}.png`);
            this.load.image(`caer${i}`, `Assets/Personaje/Caer/Caer${i}.png`);
        }
        for (let i = 1; i <= 10; i++) {
            this.load.image(`correr${i}`, `Assets/Personaje/Correr/Correr${i}.png`);
        }
    }

    create() {
        this.sound.stopAll();

        this.mundoMusic = this.sound.add('mundoMusic', { volume: 0.3, loop: true });
        this.mundoMusic.play();

        const map = this.make.tilemap({ key: 'map' }); // Crea el mapa a partir del archivo JSON 
        const tileset = map.addTilesetImage('tileset', 'tiles'); // Añade el tiles al mapa.
        
        var gameWidth = this.sys.game.config.width;
        var gameHeight = this.sys.game.config.height;

        this.background = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'background')
            .setOrigin(0, 0)
            .setScrollFactor(0.5)
            .setDisplaySize(gameWidth, gameHeight); // Ajustar el tamaño para cubrir completamente

        this.middleground = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'middleground')
            .setOrigin(0, 0)
            .setScrollFactor(0.75)
            .setDisplaySize(gameWidth, gameHeight); // Ajustar el tamaño

    
        const mainLayer = map.createLayer('Main Layer', tileset, 0, 0); // Crea los bloques del tiles
        const collisionLayer = map.createLayer('Collisions Layer', tileset, 0, 0); // Crea las colisiones

        collisionLayer.setCollision([1]); // Activo las colisiones con ID 1 que es el definido en tiled
        collisionLayer.visible = false; // Oculto las colisiones 

        this.jugador = new Jugador(this, 50, 3700); // Crea al jugador en esas coordenadas
        this.physics.add.collider(this.jugador, collisionLayer); // Hace que las coliciones afecten al personaje
    
        // Configura la cámara para seguir al jugador y ajustar su zoom
        this.cameras.main.startFollow(this.jugador);
        this.cameras.main.setZoom(2.5);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    
        this.cursors = this.input.keyboard.createCursorKeys(); // Aqui se configuran las teclas, en el update es donde llamo a la clase personaje

        // Configuracion de Pausa
        this.teclaPausa = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.teclaPausa.on('down', () => {
            this.togglePause(); 
        });

        this.indicadorVida = this.add.image(0, 0, 'tresCorazones');
        this.indicadorVida.setDepth(100);
        this.indicadorVida.setScale(0.5); 
    
        // Posiciona el indicador en la esquina superior izquierda de la cámara
        this.updateLifeIndicatorPosition();  

        this.slime = new Slime(this, 150, 3700); 
        this.physics.add.collider(this.slime, this.jugador, this.handlePlayerEnemyCollisionSlime, null, this);
        this.physics.add.collider(this.slime, collisionLayer);

        this.bat = new Bat(this, 140, 3400);
        this.physics.add.collider(this.bat, this.jugador, this.handlePlayerEnemyCollisionBat, null, this);
        this.physics.add.collider(this.bat, collisionLayer);        

        this.bat1 = new Bat(this, 160, 3000);
        this.physics.add.collider(this.bat1, this.jugador, this.handlePlayerEnemyCollisionBat1, null, this);
        this.physics.add.collider(this.bat1, collisionLayer); 

        this.bat2 = new Bat(this, 170, 2200);
        this.physics.add.collider(this.bat2, this.jugador, this.handlePlayerEnemyCollisionBat2, null, this);
        this.physics.add.collider(this.bat2, collisionLayer);

        this.bat3 = new Bat(this, 180, 1500);
        this.physics.add.collider(this.bat3, this.jugador, this.handlePlayerEnemyCollisionBat3, null, this);
        this.physics.add.collider(this.bat3, collisionLayer);

        this.vidas = 3; // Reinicia las vidas
        this.danoCooldown = false; // Reinicia el cooldown de daño
        this.reiniciarVida();   
    
        this.timer = 0;
        this.timerText = this.add.text(this.sys.game.config.width - 290, 185, 'Tiempo: 0', {
            fontSize: '18px',
            fontFamily: 'MedievalSharp',
            fill: '#ffffff'
        }).setOrigin(0, 0).setScrollFactor(0).setDepth(100).setScale(0.5);

        // Evento para actualizar el timer cada segundo
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timer++;
                this.timerText.setText('Tiempo: ' + this.timer);
            },
            loop: true
        });

    }

    updateTimer() {
        this.timer++;
        this.timerText.setText('Tiempo: ' + this.timer);
    }

    update() {
        this.jugador.update(this.cursors);

        // Asegurarse que el indicador de vida sigue al jugador adecuadamente
        this.updateLifeIndicatorPosition();
    
        // Actualiza el fondo para parallax
        this.background.tilePositionX = this.cameras.main.scrollX * 0.5;
        this.middleground.tilePositionX = this.cameras.main.scrollX * 0.75;

        if (this.jugador.x >= 28 && this.jugador.x <= 198.67 && this.jugador.y === 132.5) {
            this.winGame();
        }
    }

    updateLifeIndicatorPosition() {
        // Ajusta la posición del indicador de vida basado en la posición de la cámara
        this.indicadorVida.x = this.cameras.main.worldView.x + 20; // Ajusta según sea necesario
        this.indicadorVida.y = this.cameras.main.worldView.y + 20; // Ajusta según sea necesario
    }

    reiniciarVida() {
        this.vidas = 3; // Restablece las vidas a su valor inicial.
        this.actualizarVida(); // Actualiza la UI o cualquier otra cosa relacionada con las vidas.
    }

    togglePause() {
        // Función para pausar el juego y lanzar la escena de pausa
        this.scene.pause();
        this.scene.launch('Pausa');
    }        

    recibirDano() {
        if (!this.danoCooldown) {
            console.log('Daño recibido', this.vidas);  // Añadir para depuración
            this.vidas--;
            this.danoCooldown = true;
            this.parpadear();
            this.actualizarVida();
            this.time.delayedCall(1000, () => { this.danoCooldown = false; }, [], this);
    
            if (this.vidas <= 0) {
                this.gameOver();
            }
        }
    }    

    parpadear() {
        let contador = 0;
        let maxParpadeos = 10;
        let intervalo = setInterval(() => {
            this.jugador.visible = !this.jugador.visible;
            contador++;
            if (contador >= maxParpadeos) {
                clearInterval(intervalo);
                this.jugador.visible = true; 
                this.danoCooldown = false;
            }
        }, 100); // Parpadea cada 100 ms
    }    

    actualizarVida() {
        switch (this.vidas) {
            case 3:
                this.indicadorVida.setTexture('tresCorazones');
                break;
            case 2:
                this.indicadorVida.setTexture('dosCorazones');
                break;
            case 1:
                this.indicadorVida.setTexture('unCorazon');
                break;
            case 0:
                this.gameOver(); // Llamar a gameOver cuando no queden corazones
                break;
            default:
                this.gameOver(); // Asegurar el fin del juego si las vidas son negativas o están mal gestionadas
                break;
        }
    }
    
    gameOver() {        
        this.anims.remove('parado');
        this.anims.remove('brincar');
        this.anims.remove('caer');
        this.anims.remove('correr');
        this.anims.remove('slimeMove');
        this.anims.remove('slimeIdle');
        this.anims.remove('slimeDie');

        // Cambiar a la escena del menú
        this.scene.start('Game_Over');
    }
    
    
    handlePlayerEnemyCollisionSlime(jugador, slime) {
        // Verifica si el slime existe y está activo para evitar errores
        if (!this.slime || !this.slime.body || !this.slime.active) return;
    
        let bottomOfJugador = this.jugador.y + this.jugador.height;
        let topOfSlime = this.slime.y;
    
        // Verifica si el jugador está cayendo sobre el slime
        if (this.jugador.body.velocity.y > 0 && bottomOfJugador < topOfSlime + 10 && this.jugador.y < this.slime.y) {
            // Aplasta al slime
            this.slime.die();
            this.jugador.body.velocity.y = -200; // Impulso hacia arriba
        } else if (this.jugador.body.velocity.y >= 0 && !(bottomOfJugador < topOfSlime + 10 && bottomOfJugador > topOfSlime - 10)) {
            // El jugador recibe daño si choca de otro modo
            this.recibirDano();
            this.jugador.body.velocity.y = -10; // Un pequeño impulso hacia arriba para indicar colisión
            this.jugador.body.velocity.x = this.jugador.x < this.slime.x ? -100 : 100; // Empuja al jugador en dirección opuesta suavemente
        }
    } 

    handlePlayerEnemyCollisionBat(jugador, bat) {
        if (!this.bat || !this.bat.body || !this.bat.active) return;
    
        let bottomOfJugador = this.jugador.y + this.jugador.height;
        let topOfSlime = this.bat.y;
    
        if (this.jugador.body.velocity.y > 0 && bottomOfJugador < topOfSlime + 10 && this.jugador.y < this.bat.y) {
            this.bat.die();
            this.jugador.body.velocity.y = -200; // Impulso hacia arriba
        } else if (this.jugador.body.velocity.y >= 0 && !(bottomOfJugador < topOfSlime + 10 && bottomOfJugador > topOfSlime - 10)) {
            // El jugador recibe daño si choca de otro modo
            this.recibirDano();
            this.jugador.body.velocity.y = -10; // Un pequeño impulso hacia arriba para indicar colisión
            this.jugador.body.velocity.x = this.jugador.x < this.bat.x ? -100 : 100; // Empuja al jugador en dirección opuesta suavemente
        }
    } 

    handlePlayerEnemyCollisionBat1(jugador, bat1) {
        if (!this.bat1 || !this.bat1.body || !this.bat1.active) return;
    
        let bottomOfJugador = this.jugador.y + this.jugador.height;
        let topOfSlime = this.bat1.y;
    
        if (this.jugador.body.velocity.y > 0 && bottomOfJugador < topOfSlime + 10 && this.jugador.y < this.bat1.y) {
            this.bat1.die();
            this.jugador.body.velocity.y = -200; // Impulso hacia arriba
        } else if (this.jugador.body.velocity.y >= 0 && !(bottomOfJugador < topOfSlime + 10 && bottomOfJugador > topOfSlime - 10)) {
            // El jugador recibe daño si choca de otro modo
            this.recibirDano();
            this.jugador.body.velocity.y = -10; // Un pequeño impulso hacia arriba para indicar colisión
            this.jugador.body.velocity.x = this.jugador.x < this.bat1.x ? -100 : 100; // Empuja al jugador en dirección opuesta suavemente
        }
    } 

    handlePlayerEnemyCollisionBat2(jugador, bat2) {
        if (!this.bat2 || !this.bat2.body || !this.bat2.active) return;
    
        let bottomOfJugador = this.jugador.y + this.jugador.height;
        let topOfBat = this.bat2.y;
    
        if (this.jugador.body.velocity.y > 0 && bottomOfJugador < topOfBat + 10 && this.jugador.y < this.bat2.y) {
            this.bat2.die();
            this.jugador.body.velocity.y = -200; // Impulso hacia arriba
        } else if (this.jugador.body.velocity.y >= 0 && !(bottomOfJugador < topOfBat + 10 && bottomOfJugador > topOfBat - 10)) {
            this.recibirDano();
            this.jugador.body.velocity.y = -10;
            this.jugador.body.velocity.x = this.jugador.x < this.bat2.x ? -100 : 100;
        }
    }

    handlePlayerEnemyCollisionBat3(jugador, bat3) {
        if (!this.bat3 || !this.bat3.body || !this.bat3.active) return;
    
        let bottomOfJugador = this.jugador.y + this.jugador.height;
        let topOfBat = this.bat3.y;
    
        if (this.jugador.body.velocity.y > 0 && bottomOfJugador < topOfBat + 10 && this.jugador.y < this.bat3.y) {
            this.bat3.die();
            this.jugador.body.velocity.y = -200; // Impulso hacia arriba
        } else if (this.jugador.body.velocity.y >= 0 && !(bottomOfJugador < topOfBat + 10 && bottomOfJugador > topOfBat - 10)) {
            this.recibirDano();
            this.jugador.body.velocity.y = -10;
            this.jugador.body.velocity.x = this.jugador.x < this.bat3.x ? -100 : 100;
        }
    }

    winGame() {
        this.scene.start('Win', { time: this.timer }); 
    }
}