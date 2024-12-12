class fase_demo extends Phaser.Scene {

    // função para carregamento de assets
    preload () {
        console.log('load assets');

        // Carregar a imagem do sprite do jogador
        this.load.spritesheet('player_sp', 'assets/spritesheets/BunnyWalk-Sheet.png', { frameWidth: 32, frameHeight: 32 });

        // Carregar os tilesets do mapa
        this.load.image('Tile_Asset_Png', 'assets/maps/Tile_Asset_Png.png');

        // Carregar o arquivo de mapa JSON
        this.load.tilemapTiledJSON('themap', 'assets/maps/Mapa_Json.json');
    }

    // função para criação dos elementos
    create () {
        // Criação do mapa e associação das imagens de tileset
        this.map = this.make.tilemap({ key: 'themap', tileWidth: 16, tileHeight: 16 });

        // Guardar os tilesets em um objeto para facilitar o acesso
        this.tileset = this.map.addTilesetImage('Tile_Asset_Png', 'Tile_Asset_Png'),

        // Criação das camadas na ordem desejada (do fundo para o topo)
        this.backLayer = this.map.createDynamicLayer('Back', this.tileset, 0, 0);
        this.backLayer.setDepth(0); // Definindo profundidade

        this.wallsLayer = this.map.createDynamicLayer('Escadas', this.tileset, 0, 0);
        this.wallsLayer.setDepth(1);

        this.plataformaLayer = this.map.createDynamicLayer('Plataforma', this.tileset, 0, 0);
        this.plataformaLayer.setDepth(2);

        // criação do rei (jogador)
        this.player = this.physics.add.sprite(200, 300, 'player_sp', 5);
        this.player.setDepth(3); // O jogador fica acima das camadas
        
        //this.player.setgravityY = 300; // Adiciona gravidade ao jogador
        this.physics.world.gravity.y = 10000; // Adiciona gravidade ao mundo

        // Definir colisão para a camada de plataforma
        //this.backLayer.setCollisionByExclusion([-1]);
        //this.wallsLayer.setCollisionByExclusion([-1]); // Configura colisão para todos os tiles, exceto o vazio
        this.plataformaLayer.setCollisionByExclusion([-1]); // Configura colisão para todos os tiles, exceto o vazio

        // Adicionar colisão entre o jogador e cada camada de colisão
        //this.physics.add.collider(this.player, this.backLayer, false);
        //this.physics.add.collider(this.player, this.wallsLayer, false);
        this.physics.add.collider(this.player, this.plataformaLayer, false);
        
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
            this.player.setVelocityY(-7000);
        } else if (this.keyS.isDown) {
            this.player.setVelocityY(210);
        } else {
            this.player.setVelocityY(0); 
        }
    }
}
