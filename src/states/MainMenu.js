import Phaser from 'phaser'

export default class MainMenu extends Phaser.State {
  create () {
    this.game.global = {
      difficulty: 'undefined'
    }

    var background = this.add.sprite(0, 0,  'mansion');
    background.width = this.game.world.width;
    background.height = this.game.world.height;

    var easy_button = this.game.add.button(this.game.world.centerX / 2, this.game.world.height, 'button_easy', this.startGame, this, 2, 1, 0 );
    easy_button.name = 'easy_button';
    easy_button.anchor.setTo(0.5, 0.5);
    easy_button.centerX = this.game.world.centerX / 2;

    var medium_button = this.game.add.button(this.game.world.centerX, this.game.world.height, 'button_medium', this.startGame, this, 2, 1, 0 );
    medium_button.name = 'medium_button';
    medium_button.anchor.setTo(0.5, 0.5);

    var hard_button = this.game.add.button(this.game.world.centerX * 1.5, this.game.world.height, 'button_hard', this.startGame, this, 2, 1, 0 );
    hard_button.name = 'hard_button';
    hard_button.anchor.setTo(0.5, 0.5);

    var tween_easy = this.game.add.tween(easy_button).to({y: 650}, 1000, Phaser.Easing.Bounce.Out, false);
    var tween_medium = this.game.add.tween(medium_button).to({y: 650}, 1000, Phaser.Easing.Bounce.Out, false);
    var tween_hard = this.game.add.tween(hard_button).to({y: 650}, 1000, Phaser.Easing.Bounce.Out, false);

    tween_easy.start();
    tween_medium.start();
    tween_hard.start();

  }

  update () {
    // Add your game logic here
  }

  startGame(difficulty){
    switch(difficulty.name){
      case 'easy_button':
        this.game.global.difficulty = 'easy';
        break;
      case 'medium_button':
        this.game.global.difficulty = 'medium';

        break;
      case 'hard_button':
        this.game.global.difficulty = 'hard';
        break;
      default:
        this.game.global.difficulty = 'undefined';
        break;
    }
    if(this.game.global.difficulty != 'undefined'){
      this.state.start('Play');
    }
  }
}
