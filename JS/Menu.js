class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
    }

    preload() {
        // Pre-carga de imágenes necesarias
        this.load.image('backgroundMenu', 'Assets/Menu/BackgroundMenu.png');
        this.load.image('title', 'Assets/Menu/Titulo.png');
        this.load.image('enter', 'Assets/Menu/Press_Enter.png');
        this.load.image('instructions', 'Assets/Menu/instructions.png');
        this.load.audio('menuMusic', 'Assets/Musica/Menu.mp3');
        this.load.image('botonDerecho', 'Assets/Menu/Control.png');
        this.load.image('botonIzquierdo', 'Assets/Menu/Board.png');
        this.load.image('texturaMedieval', 'Assets/Menu/Texturas.png');
    }

    create() {
        this.sound.stopAll();

        this.mundoMusic = this.sound.add('menuMusic', { volume: 0.3, loop: true });
        this.mundoMusic.play();
        // Fondo 
        this.background = this.add.image(0, 0, 'backgroundMenu')
        .setOrigin(0, 0)
        .setScale(this.sys.game.config.width / 1920, this.sys.game.config.height / 1080); 
        
        // Título y aviso para presionar Enter
        this.title = this.add.image(this.sys.game.config.width / 2, 80, 'title').setOrigin(0.5);
        this.pressEnter = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height - 60, 'enter').setOrigin(0.5);

        // Efecto de parpadeo para el texto 'press enter'
        this.time.addEvent({
            delay: 700,
            callback: () => { this.pressEnter.visible = !this.pressEnter.visible; },
            loop: true
        });

        // Evento para iniciar el juego
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('Mundo1'); 
        });

// Crear botón derecho
const botonDerecho = this.add.image(this.sys.game.config.width - 50, 50, 'botonDerecho').setInteractive();
botonDerecho.on('pointerdown', () => {
    this.tweens.add({
        targets: botonDerecho,
        scale: 0.9, // Escala reducida para simular el click
        duration: 100, // Duración de la animación
        onComplete: () => {
            this.mostrarPopupControles(); // Mostrar el popup después de completar la animación
        }
    });
});
botonDerecho.on('pointerout', () => {
    botonDerecho.setScale(1); // Restablecer la escala cuando el puntero sale del botón
});
botonDerecho.on('pointerup', () => {
    this.tweens.add({
        targets: botonDerecho,
        scale: 1, // Volver al tamaño original
        duration: 100 // Duración de la animación
    });
});

// Crear botón izquierdo
const botonIzquierdo = this.add.image(50, 50, 'botonIzquierdo').setInteractive();
botonIzquierdo.on('pointerdown', async () => {
    this.tweens.add({
        targets: botonIzquierdo,
        scale: 0.9, // Escala reducida para simular el click
        duration: 100, // Duración de la animación
        onComplete: async () => {
            const top10 = await this.obtenerTop10(); // Esperar a obtener los datos
            this.mostrarPopupTop10(top10); // Mostrar el popup con los datos
        }
    });
});
botonIzquierdo.on('pointerout', () => {
    botonIzquierdo.setScale(1); // Restablecer la escala cuando el puntero sale del botón
});
botonIzquierdo.on('pointerup', () => {
    this.tweens.add({
        targets: botonIzquierdo,
        scale: 1, // Volver al tamaño original
        duration: 100 // Duración de la animación
    });
});


    } 
    //
    async obtenerTop10() {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['JuegoData'], 'readonly');
            const objectStore = transaction.objectStore('JuegoData');
            const index = objectStore.index('time');
            const request = index.getAll(null, 10); // Obtén los 10 mejores tiempos
            
            request.onsuccess = () => {
                resolve(request.result); // Devuelve los resultados
            };
            request.onerror = () => {
                reject('No se pudo obtener los datos');
            };
        });
    }

    mostrarPopupTop10(datos) {
        // Fondo oscuro semitransparente
        const fondo = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000, 0.5)
            .setOrigin(0)
            .setInteractive()
            .setDepth(0); // Menor profundidad para que esté en el fondo
    
        const popupWidth = 500;
        const popupHeight = 380;
        const x = (this.sys.game.config.width - popupWidth) / 2;
        const y = (this.sys.game.config.height - popupHeight) / 2;
    
        // Fondo del popup
        const popup = this.add.image(x, y, 'texturaMedieval')
            .setOrigin(0)
            .setDisplaySize(popupWidth, popupHeight)
            .setDepth(10); // Mayor profundidad para asegurar que esté al frente del fondo oscuro
    
        // Texto de título
        this.add.text(this.sys.game.config.width / 2, y + 40, 'Top 10 Jugadores', {
            fontSize: '26px',
            fontFamily: 'MedievalSharp',
            fill: '#dcdcdc',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: { x: 20, y: 10 },
            align: 'center'
        })
        .setOrigin(0.5)
        .setDepth(11); // Asegurar que el texto esté al frente del fondo del popup
    
        // Listado de jugadores
        let listStartY = y + 80;
        datos.forEach((entry, index) => {
            let color = '#dcdcdc'; // Color por defecto
            if (index === 0) {
                color = '#ffd700'; // Oro
            } else if (index === 1) {
                color = '#c0c0c0'; // Plata
            } else if (index === 2) {
                color = '#cd7f32'; // Bronce
            }
    
            this.add.text(x + 25, listStartY, `${index + 1}. ${entry.username} - ${entry.time} s`, {
                fontSize: '20px',
                fontFamily: 'MedievalSharp',
                fill: color,
                stroke: '#000',
                backgroundColor: 'rgba(0,0,0,0.5)',
                strokeThickness: 2
            })
            .setDepth(11); // Texto del listado también al frente
            listStartY += 30;
        });
    
        // Botón de cerrar
        const closeButton = this.add.text(x + popupWidth - 50, y + 10, 'X', {
            fontSize: '20px',
            fontFamily: 'MedievalSharp',
            fill: '#ff0000',
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: { x: 10, y: 5 }
        })
        .setInteractive()
        .setDepth(11); // Botón de cerrar también al frente
    
        closeButton.on('pointerdown', () => {
            fondo.destroy();
            popup.destroy();
            closeButton.destroy();
            this.children.list.filter(child => child.type === 'Text').forEach(text => text.destroy());
        });
    }
    
    
    mostrarPopupControles() {
        const fondo = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000, 0.5)
            .setOrigin(0)
            .setInteractive()
            .setDepth(0);
    
        const popupWidth = 500;
        const popupHeight = 300;
        const x = (this.sys.game.config.width - popupWidth) / 2;
        const y = (this.sys.game.config.height - popupHeight) / 2;
    
        const popup = this.add.image(x, y, 'texturaMedieval')
            .setOrigin(0)
            .setDisplaySize(popupWidth, popupHeight)
            .setDepth(10);
    
        this.add.text(this.sys.game.config.width / 2, y + 40, 'Controles del Juego', {
            fontSize: '26px',
            fontFamily: 'MedievalSharp',
            fill: '#dcdcdc',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: { x: 20, y: 10 },
            align: 'center'
        })
        .setOrigin(0.5)
        .setDepth(11);
    
        const controlsDescription = `\nCaminar: Flechas Izq/Der\n\nBrincar: Espacio\n\nPausa: P\n`;
        this.add.text(x + 115, y + 80, controlsDescription, {
            fontSize: '20px',
            fontFamily: 'MedievalSharp',
            fill: '#dcdcdc',
            stroke: '#000',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: { x: 20, y: 10 },
            strokeThickness: 2,
            align: 'center'
        })
        .setDepth(11);
    
        const closeButton = this.add.text(x + popupWidth - 50, y + 10, 'X', {
            fontSize: '20px',
            fontFamily: 'MedievalSharp',
            fill: '#ff0000',
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: { x: 10, y: 5 }
        })
        .setInteractive()
        .setDepth(11);
    
        closeButton.on('pointerdown', () => {
            fondo.destroy();
            popup.destroy();
            closeButton.destroy();
            this.children.list.filter(child => child.type === 'Text').forEach(text => text.destroy());
        });
    }
    
    
}
