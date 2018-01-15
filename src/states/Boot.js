import Phaser from 'phaser'

export default class Boot extends Phaser.State {
  init () {
    // Recommended to leave as 1 unless you need multi-touch support
    this.input.maxPointers = 1

    // Phaser will automatically pause if the browser tab the game is in loses focus
    this.stage.disableVisibilityChange = true

    if (this.game.device.desktop) {
      // Desktop specific settings go here
    } else {
      // Mobile specific settings go here
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
      this.scale.setMinMax(480, 260, 1024, 768)
      this.scale.forceLandscape = true
    }
  }

  preload () {
    // Load anything you need for the preloader (e.g. loading bars) here
    this.load.image('loaderBar', 'assets/images/loader-bar.png');
    this.load.image('mansion', 'assets/images/mansion.jpg');
    this.load.image('cheese', 'assets/images/cheese.png');
    this.load.image('boo', 'assets/images/king_boo.png');

    this.load.spritesheet('button_easy', 'assets/images/buttons/easy.png', 312, 104);
    this.load.spritesheet('button_medium', 'assets/images/buttons/medium.png', 312, 104);
    this.load.spritesheet('button_hard', 'assets/images/buttons/hard.png', 312, 104);

    this.load.image('face_down_card', 'assets/images/cards/face_down.png');

    this.load.image('face_card_1', 'assets/images/cards/baldog.jpg');
    this.load.image('face_card_2', 'assets/images/cards/bowser.jpg');
    this.load.image('face_card_3', 'assets/images/cards/cloud.jpg');
    this.load.image('face_card_4', 'assets/images/cards/donkey_kong.jpg');
    this.load.image('face_card_5', 'assets/images/cards/donkey_kong_jr.jpg');
    this.load.image('face_card_6', 'assets/images/cards/dunno.jpg');
    this.load.image('face_card_7', 'assets/images/cards/luigi.jpg');
    this.load.image('face_card_8', 'assets/images/cards/mario.jpg');
    this.load.image('face_card_9', 'assets/images/cards/mario_2.jpg');
    this.load.image('face_card_10', 'assets/images/cards/peach.jpg');
    this.load.image('face_card_11', 'assets/images/cards/pot_1.jpg');
    this.load.image('face_card_12', 'assets/images/cards/pot_2.jpg');
    this.load.image('face_card_13', 'assets/images/cards/pot_3.jpg');
    this.load.image('face_card_14', 'assets/images/cards/pot_4.jpg');
    this.load.image('face_card_15', 'assets/images/cards/pot_5.jpg');
    this.load.image('face_card_16', 'assets/images/cards/pot_6.jpg');
    this.load.image('face_card_17', 'assets/images/cards/pot_7.jpg');
    this.load.image('face_card_18', 'assets/images/cards/pot_8.jpg');
    this.load.image('face_card_19', 'assets/images/cards/rob_o.jpg');
    this.load.image('face_card_20', 'assets/images/cards/star.jpg');
    this.load.image('face_card_21', 'assets/images/cards/waluigi.jpg');
    this.load.image('face_card_22', 'assets/images/cards/warhammer.jpg');
    this.load.image('face_card_23', 'assets/images/cards/wario.jpg');
    this.load.image('face_card_24', 'assets/images/cards/wario_2.jpg');
    this.load.image('face_card_25', 'assets/images/cards/yoshi.jpg');


    for(let i = 1; i < 26; i++){
      this.load.image('face_card_ ' + i, 'assets/images/cards/blank_card_' + i + '.png');
    }


    this.load.audio('boo_happy', 'assets/audio/boo_happy.ogg');
    this.load.audio('boo_sad', 'assets/audio/boo_sad.ogg');
  }

  create () {
    // Set the stage background colour
    this.game.stage.backgroundColor = '#000'

    // Everything from the preload function will have been loaded into cache by
    // this point, so we can now start the preloader
    this.state.start('Preloader')
  }
}
