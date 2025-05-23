class fase_1 extends Phaser.Scene {

    // função para carregamento de assets
    preload () {
        console.log('load assets');

        // Carregar a imagem do sprite do jogador
        this.load.spritesheet('player1', 'assets/spritesheets/BunnyWalk-Sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player2', 'assets/spritesheets/BunnyIdleF.png', { frameWidth: 32, frameHeight: 32 });
        // Carregar os tilesets do mapa
        this.load.image('Tile_Asset_Png', 'assets/maps/Tile_Asset_Png.png');
        // Carregar o arquivo de mapa JSON
        this.load.tilemapTiledJSON('themap', 'assets/maps/Mapa_Json.json');
        // Carregar a imagem da flecha
        this.load.image('arrow1', 'assets/spritesheets/image.png');
        this.load.image('arrow2', 'assets/spritesheets/image1.png');
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

        this.leader = this.map.createDynamicLayer('Escadas', this.tileset, 0, 0);
        this.leader.setDepth(1);

        this.plataformaLayer = this.map.createDynamicLayer('Plataforma', this.tileset, 0, 0);
        this.plataformaLayer.setDepth(2);

        // criação do jogador 1
        this.player1 = this.physics.add.sprite(200, 100, 'player1', 5);
        this.player1.setDepth(3); // O jogador fica acima das camadas
        this.player2 = this.physics.add.sprite(1200, 100, 'player2', 5);
        this.player2.setDepth(3); // O jogador fica acima das camadas
        this.arrow1 = this.physics.add.sprite(200, 100, 'arrow1');
        this.arrow1.setScale(0.03);
        this.arrow1.setDepth(3);

        this.arrow2 = this.physics.add.sprite(1200, 100, 'arrow2');
        this.arrow2.setScale(0.03);
        this.arrow2.setDepth(3);
        
        // Definir colisão para a camada de plataforma
        this.plataformaLayer.setCollisionByExclusion([-1]); // Configura colisão para todos os tiles, exceto o vazio
        
        // Adicionar colisão entre o jogador e cada camada de colisão
        this.physics.add.collider(this.player1, this.plataformaLayer, false);
        this.physics.add.collider(this.player2, this.plataformaLayer, false);
        //this.physics.add.collider(this.arrow1, this.plataformaLayer, arrow1HitWall);
        
        // Definir as teclas de movimento
        this.keyA = this.input.keyboard.addKey('A');
        this.keyD = this.input.keyboard.addKey('D');
        this.keyW = this.input.keyboard.addKey('W');
        this.keyS = this.input.keyboard.addKey('S');
        this.keyRight = this.input.keyboard.addKey('RIGHT');
        this.keyLeft = this.input.keyboard.addKey('LEFT');
        this.keyUp = this.input.keyboard.addKey('UP');
        this.keyDown = this.input.keyboard.addKey('DOWN');

        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keySpace2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.space_pressed = false;
        this.space_pressed2 = false;


        this.graphics1 = this.add.graphics({ lineStyle: { width: 2, color: 0x00aaaa }, fillStyle: { color: 0x0000aa } });
        this.circle = new Phaser.Geom.Circle(this.player1.x, this.player1.y, 64);
        this.line = new Phaser.Geom.Line(this.player1.x-20, this.player1.y, this.player1.x+20, this.player1.y);
        this.shoot_angle = 0;

        this.graphics2 = this.add.graphics({ lineStyle: { width: 2, color: 0x00aaaa }, fillStyle: { color: 0x0000aa } });
        this.circle2 = new Phaser.Geom.Circle(this.player2.x, this.player2.y, 64);
        this.line2 = new Phaser.Geom.Line(this.player2.x-20, this.player2.y, this.player2.x+20, this.player2.y);
        this.shoot_angle2 = 0;

        //this.player1.setgravityY = 300; // Adiciona gravidade ao jogador
        this.physics.world.gravity.y = 100; // Adiciona gravidade ao mundo
    }

    // update é chamada a cada novo quadro
    update () {
        // velocidade horizontal
        if (this.keyD?.isDown) {
            this.player1.setVelocityX(210);
            this.shoot_angle -= 0.01;
        } else if (this.keyA?.isDown) {
            this.player1.setVelocityX(-210);
            this.shoot_angle += 0.01;
        } else {
            this.player1.setVelocityX(0); 
            this.shoot_angle = 0;
        }

        // velocidade vertical
        if (this.keyW.isDown){  // verifica se o jogador está no chão antes de pular
            this.player1.setVelocityY(-210);
        } else if (this.keyS.isDown) {
            this.player1.setVelocityY(210);
        } else {
            this.player1.setVelocityY(0); 
            this.shoot_angle = 0;
        }

        //Player 2
        if(this.keyRight.isDown){
            this.player2.setVelocityX(210);
            this.shoot_angle2 -= 0.01;
        } else if (this.keyLeft.isDown) {
            this.player2.setVelocityX(-210);
            this.shoot_angle2 += 0.01;
        } else {
            this.player2.setVelocityX(0); 
            this.shoot_angle2 = 0;
        }

        if(this.keyUp.isDown){
            this.player2.setVelocityY(-210);
        } else if (this.keyDown.isDown) {
            this.player2.setVelocityY(210);
        } else {
            this.player2.setVelocityY(0);
            this.shoot_angle2 = 0;
        }

        if (this.shoot_angle > 1)
            this.shoot_angle -= 1;
        if (this.shoot_angle < 0)
            this.shoot_angle += 1;

        if(this.shoot_angle2 > 1)
            this.shoot_angle2 -= 1;
        if(this.shoot_angle2 < 0)
            this.shoot_angle2 += 1;

        if (!this.keySpace.isDown && this.space_pressed){
            this.graphics1.clear();
            this.arrow1.setPosition(this.player1.x, this.player1.y)
            this.arrow1.setVelocityX(270* Math.cos(this.shoot_angle*2*3.14))
            this.arrow1.setVelocityY(270* Math.sin(this.shoot_angle*2*3.14))
            this.arrow1.setRotation(this.shoot_angle*2*3.14-3*3.14/2);
            if(this.keyA.isDown){
                this.arrow1.setVelocityX(-270* Math.cos(this.shoot_angle*2*3.14))
                this.arrow1.setVelocityY(-270* Math.sin(this.shoot_angle*2*3.14))
                this.arrow1.setRotation(-this.shoot_angle*2*3.14 - 3.14/2);
            }
            if(this.keyW.isDown){
                this.shoot_angle = 270;
                this.arrow1.setVelocityX(0)
                this.arrow1.setVelocityY(270* Math.sin(this.shoot_angle*2*3.14))
                this.arrow1.setRotation(2*3.14 - 2*3.14);
            }
        }
        if (this.keySpace.isDown){
            this.player1.setVelocityX(0);
            this.draw_aim ();
            this.space_pressed = true;
        }
        else{
            this.space_pressed = false;
        }

        if(!this.keySpace2.isDown && this.space_pressed2){
            this.graphics2.clear();
            this.arrow2.setPosition(this.player2.x, this.player2.y)
            this.arrow2.setVelocityX(-270 * Math.cos(this.shoot_angle2*2*3.14))
            this.arrow2.setVelocityY(-270 * Math.sin(this.shoot_angle2*2*3.14))
            this.arrow2.setRotation(this.shoot_angle2*2*3.14-3*3.14/2);
            if(this.keyRight.isDown){
                this.arrow2.setVelocityX(270 * Math.cos(this.shoot_angle2*2*3.14))
                this.arrow2.setVelocityY(270 * Math.sin(this.shoot_angle2*2*3.14))
                this.arrow2.setRotation(this.shoot_angle2*2*3.14 - 3.14/2);
            }
            if(this.keyUp.isDown){
                this.shoot_angle2 = 270;
                this.arrow2.setVelocityX(0)
                this.arrow2.setVelocityY(270 * Math.sin(this.shoot_angle2*2*3.14))
                this.arrow2.setRotation(2*3.14 - 2*3.14);
            }
        }
        if (this.keySpace2.isDown){
            this.player2.setVelocityX(0);
            this.draw_aim2 ();
            this.space_pressed2 = true;
        }else{
            this.space_pressed2 = false;
        }
        
    }

    draw_aim (){
        this.graphics1.clear();
        this.circle.setTo(this.player1.x, this.player1.y, 20);
        var point = this.circle.getPoint(this.shoot_angle);
        Phaser.Geom.Line.SetToAngle(this.line, point.x, point.y, this.shoot_angle*6.28, 20);
        this.graphics1.strokeCircleShape(this.circle);
        this.graphics1.strokeLineShape(this.line);

    }

    draw_aim2 (){
        this.graphics2.clear();
        this.circle2.setTo(this.player2.x, this.player2.y, 20);
        var point = this.circle2.getPoint(this.shoot_angle2);
        Phaser.Geom.Line.SetToAngle(this.line2, point.x, point.y, this.shoot_angle2*6.28, 20);
        this.graphics2.strokeCircleShape(this.circle2);
        this.graphics2.strokeLineShape(this.line2);

    }
}

function arrow1HitWall(arrow1, wall){
    //console.log(arrow1)
    arrow1.y = 1000;
}
