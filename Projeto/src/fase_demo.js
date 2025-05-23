class fase_demo extends Phaser.Scene {

    // função para carregamento de assets
    preload () {
        console.log('load assets');

        // Carregar a imagem do sprite do jogador
        this.load.spritesheet('player_sp', 'assets/spritesheets/a-king.png', { frameWidth: 78, frameHeight: 58 });

        // Carregar os tilesets do mapa
        this.load.image('Terrain (32x32)', 'assets/maps/Terrain (32x32).png');
        this.load.image('Closiong (46x56)', 'assets/maps/Closiong (46x56).png');
        this.load.image('Decorations (32x32)', 'assets/maps/Decorations (32x32).png');

        // Carregar o arquivo de mapa JSON
        this.load.tilemapTiledJSON('themap', 'assets/maps/Mapa_Porco.json');
    }

    // função para criação dos elementos
    create () {
        // Criação do mapa e associação das imagens de tileset
        this.map = this.make.tilemap({ key: 'themap', tileWidth: 16, tileHeight: 16 });

        // Guardar os tilesets em um objeto para facilitar o acesso
        this.tileset = {
            terrain: this.map.addTilesetImage('Terrain (32x32)', 'Terrain (32x32)'),
            closing: this.map.addTilesetImage('Closiong (46x56)', 'Closiong (46x56)'),
            decorations: this.map.addTilesetImage('Decorations (32x32)', 'Decorations (32x32)')
        };

        // Criação das camadas na ordem desejada (do fundo para o topo)
        this.groundLayer = this.map.createDynamicLayer('Background azul', this.tileset.terrain, 0, 0);
        this.groundLayer.setDepth(0); // Definindo profundidade

        this.wallsLayer = this.map.createDynamicLayer('Parede', this.tileset.terrain, 0, 0);
        this.wallsLayer.setDepth(2);

        this.wallsLayer = this.map.createDynamicLayer('ParedeWall', this.tileset.terrain, 0, 0);
        this.wallsLayer.setDepth(1);

        this.plataformaLayer = this.map.createDynamicLayer('Plataforma', this.tileset.decorations, 0, 0);
        this.plataformaLayer.setDepth(3);

        this.decoracoesLayer = this.map.createDynamicLayer('Decoracoes', this.tileset.decorations, 0, 0);
        this.decoracoesLayer.setDepth(4); // A camada de decoração ficará no topo

        // criação do rei (jogador)
        this.player = this.physics.add.sprite(300, 200, 'player_sp', 5);
        this.player.setDepth(5); // O jogador fica acima das camadas
        //this.player.setgravityY = 300; // Adiciona gravidade ao jogador
        this.physics.world.gravity.y = 10000; // Adiciona gravidade ao mundo

        // Definir colisão para a camada de plataforma
        this.wallsLayer.setCollisionByExclusion([-1]); // Configura colisão para todos os tiles, exceto o vazio
        this.plataformaLayer.setCollisionByExclusion([-1]); // Configura colisão para todos os tiles, exceto o vazio

        // Adicionar colisão entre o jogador e cada camada de colisão
        this.physics.add.collider(this.player, this.wallsLayer);
        this.physics.add.collider(this.player, this.plataformaLayer);
        
        // Definir as teclas de movimento
        this.keyA = this.input.keyboard.addKey('A');
        this.keyD = this.input.keyboard.addKey('D');
        this.keyW = this.input.keyboard.addKey('W');
        this.keyS = this.input.keyboard.addKey('S');
        this.keySPACE = this.input.keyboard.addKey('SPACE');
    }

    // update é chamada a cada novo quadro
    update () {
        // velocidade horizontal
        if (this.keyD?.isDown) {
            this.player.setVelocityX(210);
        } else if (this.keyA?.isDown) {
            this.player.setVelocityX(-210);
        } else {
            this.player.setVelocityX(0); 
        }

        // velocidade vertical
        if (this.keyW.isDown && this.player.body.onFloor()) {  // verifica se o jogador está no chão antes de pular
            this.player.setVelocityY(-6000);
        } else if (this.keyS.isDown) {
            this.player.setVelocityY(210);
        } else {
            this.player.setVelocityY(0); 
        }
    }
}
