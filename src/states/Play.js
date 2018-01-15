import Phaser from 'phaser'

export default class Play extends Phaser.State {
  create () {
    var background = this.game.add.sprite(0, 0, 'mansion');
    background.width = this.game.width;
    background.height = this.game.height;

    /*var return_button = this.game.add.button(175, 700, 'return_button', this.returnToMainMenu, this, 2, 1, 0 );
    return_button.anchor.setTo(0.5, 0.5);*/

    this.correctSound = this.game.add.audio('boo_happy', 1, false);
    this.incorrectSound = this.game.add.audio('boo_sad', 1, false);

    this.firstSelectedCard = null; //global variable to keep a reference to the first selected created face card
    this.secondSelectedCard = null; //global variable to keep a reference to the second selected face card
    this.processingCard = null; //this is the original selected blank card
    this.createdFaceCard = null;
    this.flippedCards = []; //this array keeps both processingCard references so that the original blank card can be resurrected
    this.amountOfCards = -1;

    this.buildCards();
  }

  //method responsible to generate all the cards based on the selected difficulty
  buildCards(){
    var allCards = [];
    var boardWidth;
    var boardHeight;
    var horSpacing;
    var verSpacing;
    var offX = 280; //300
    var offY = 260; //260
    this.customScale = 1;
    this.customWaitTime = 1;

    this.cardGroup = this.game.add.group(); //create a card group so that the whole board can be centered in the screen

    //Initialize variables based on the given difficulty
    switch(this.game.global.difficulty){
      case 'easy':
        boardWidth = 5;
        boardHeight = 2;
        horSpacing = 200;
        verSpacing = 200;
        this.customWaitTime = 1.25;
        break;
      case 'medium':
        boardWidth = 6;
        boardHeight = 4;
        horSpacing = 150;
        verSpacing = 150;
        this.customScale = 0.75;
        this.customWaitTime = 1;
        break;
      case 'hard':
        boardWidth = 10;
        boardHeight = 5;
        horSpacing = 100;
        verSpacing = 100;
        this.customScale = 0.5;
        this.customWaitTime = 0.75;
        break;
      default:
        this.state.start('MainMenu');
        break;
    }

    //create pairs based on the height and width of the board
    this.amountOfCards = boardWidth * boardHeight;
    for(var singleCard = 0; singleCard < (this.amountOfCards / 2); singleCard++){
      allCards.push(singleCard);
      allCards.push(singleCard);
    }

    //create blank card sprites for the entire board. The value of the blank card is randomly taken from the allCards array that was just filled with pairs
    for(var i = 0; i < boardWidth; i++){
      for(var j = 0; j < boardHeight; j++){
        var randomCardIndex = Math.floor(Math.random() * allCards.length);
        var card = this.game.add.sprite(i * horSpacing + offX, 200 + (j * verSpacing), 'face_down_card');
        card.value = allCards[randomCardIndex];
        allCards.splice(randomCardIndex, 1);

        card.anchor.setTo(0.5, 0.5);
        card.scale.setTo(this.customScale, this.customScale);
        card.inputEnabled = true;
        card.flipped = false;
        card.events.onInputDown.add(this.handleFlipCard, this); //add event handler so when the user presses this card handleFlipCard is called
        this.cardGroup.add(card);
      }

      //center the entire board in the users screen
      this.cardGroup.centerX = this.game.world.centerX;
      this.cardGroup.centerY = this.game.world.centerY;
    }

  }

  //executes when a player presses a card. Responsible for saving the selected card in the processingCard variable
  handleFlipCard(selectedCard) {
    if(this.firstSelectedCard != null && this.secondSelectedCard != null){
      return; //do not allow input when animations are still playing
    }

    this.processingCard = selectedCard;
    this.animateFlipCardToShow(); //call animateFlipCardToShow to show an animation
  }

  handleCheckShowingCards(){
    var correctPair = this.firstSelectedCard.value === this.secondSelectedCard.value;

    if(correctPair === true){
      this.correctSound.play();

      var standardEmitter = this.game.add.emitter(0, 0, 200);
      standardEmitter.makeParticles('boo');
      standardEmitter.gravity = 0;
      standardEmitter.minParticleScale = 0.01;
      standardEmitter.maxParticleScale = 0.05;
      standardEmitter.setAll('anchor.x', 0.5);
      standardEmitter.setAll('anchor.y', 0.5);
      standardEmitter.minParticleSpeed.setTo(-200, -200);
      standardEmitter.maxParticleSpeed.setTo(400, 400);

      var booEmitter1 = standardEmitter;
      booEmitter1.x = this.firstSelectedCard.centerX;
      booEmitter1.y = this.firstSelectedCard.centerY;
      booEmitter1.start(true, 1000, null, 20);

      var booEmitter2 = standardEmitter;
      booEmitter2.x = this.secondSelectedCard.centerX;
      booEmitter2.y = this.secondSelectedCard.centerY;
      booEmitter2.start(true, 1000, null, 20);
    }
    else{
      this.incorrectSound.play();
    }

    this.animateFlipCardToHide(!correctPair);
    this.handleEndOfGame();

  }

  //executes when handleFlipCard is done. Responsible to make the original pressed blank card disappear from the screen.
  animateFlipCardToShow(){
    var flipTween = this.game.add.tween(this.processingCard.scale).to({
      x: 0,
      y: 0
    }, 100, Phaser.Easing.Linear.None);
    flipTween.onComplete.add(this.animateFlipCardToShowFace, this);

    flipTween.start();
  }

  //executes when the animation made in animateFlipCardToShow is done. Responsible for creating a face card in the place of the original blank card.
  animateFlipCardToShowFace(){
    var faceCard = this.game.add.sprite(this.processingCard.x, this.processingCard.y, 'face_card_' + (this.processingCard.value + 1));
    faceCard.value = this.processingCard.value;
    faceCard.scale.setTo(this.customScale);
    faceCard.anchor.setTo(0.5, 0.5);
    this.cardGroup.add(faceCard);

    var faceTween = this.game.add.tween(faceCard.scale).to({ //add an animation to show the face card. This card is slightly bigger than the original blank card
      x: this.customScale + 0.25,
      y: this.customScale + 0.25
    }, 100, Phaser.Easing.Linear.None);

    //save the created faceCard object so it can be resized more easily in the animateFlipCardToResize method
    //save the face card in firstSelectedCard or in secondSelectedCard.
    this.createdFaceCard = faceCard;
    if(this.firstSelectedCard == null){
      this.firstSelectedCard = faceCard;
      this.flippedCards[0] = this.processingCard;
    }
    else{
      this.secondSelectedCard = faceCard;
      this.flippedCards[1] = this.processingCard;
    }

    faceTween.onComplete.add(this.animateFlipCardToResize, this); //call animateFlipCardToResize when the animation is over
    faceTween.start();
  }

  //executes when animateFlipCardToShowFace is done. Responsible to resize the scale of the created face card back to 1. Calls handleCheckShowingCards if two cards are selected.
  animateFlipCardToResize(){
    var resizeTween = this.game.add.tween(this.createdFaceCard.scale).to({
      x: 1,
      y: 1
    }, 100, Phaser.Easing.Linear.None);
    resizeTween.start();

    if(this.secondSelectedCard != null){
      var timer = this.game.time.events.add((Phaser.Timer.SECOND * this.customWaitTime), this.handleCheckShowingCards, this);
    }
  }

  animateFlipCardToHide(returnBlankCard){
    var hideFirst = this.game.add.tween(this.firstSelectedCard.scale).to({
      x: 0,
      y: 0
    }, 100, Phaser.Easing.Linear.None);
    var hideSecond = this.game.add.tween(this.secondSelectedCard.scale).to({
      x: 0,
      y: 0
    }, 100, Phaser.Easing.Linear.None);

    hideFirst.start();
    hideSecond.start();

    if(returnBlankCard === true){
      var returnFirstCard = this.game.add.tween(this.flippedCards[0].scale).to({
        x: this.customScale,
        y: this.customScale
      }, 100, Phaser.Easing.Linear.None);
      var returnSecondCard = this.game.add.tween(this.flippedCards[1].scale).to({
        x: this.customScale,
        y: this.customScale
      }, 100, Phaser.Easing.Linear.None);

      returnFirstCard.start();
      returnSecondCard.start();
    }
    else{
      this.amountOfCards = this.amountOfCards - 2;
    }

    this.firstSelectedCard = null;
    this.secondSelectedCard = null;
    this.flippedCards = [];
  }

  handleEndOfGame(){
    if(this.amountOfCards === 0){
      var kingBooSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'boo');
      kingBooSprite.scale.setTo(0, 0);
      kingBooSprite.anchor.setTo(0.5, 0.5);
      kingBooSprite.centerX = this.game.world.centerX;
      kingBooSprite.centerY = this.game.world.centerY;

      var fadeInBoo = this.game.add.tween(kingBooSprite.scale).to({
        x: 0.75,
        y: 0.75
      }, 500, Phaser.Easing.Linear.None);

      fadeInBoo.start();

      var returnTimer = this.game.time.events.add((Phaser.Timer.SECOND * 7), this.returnToMainMenu, this);
    }

  }

  returnToMainMenu(){
    this.game.state.start('MainMenu');
  }

  update () {
    // Add your game logic here
  }
}
