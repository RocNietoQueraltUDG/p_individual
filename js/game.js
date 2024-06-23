import { game } from './memory.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    parent: 'game', // Ensure the game canvas is added to the correct element
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const phaserGame = new Phaser.Game(config);

function preload() {
    this.load.image('back', '../resources/back.png');
    this.load.image('cb', '../resources/cb.png');
    this.load.image('co', '../resources/co.png');
    this.load.image('sb', '../resources/sb.png');
    this.load.image('so', '../resources/so.png');
    this.load.image('tb', '../resources/tb.png');
    this.load.image('to', '../resources/to.png');
}

function create() {
    // Set background color to match the desired background color
    this.cameras.main.setBackgroundColor('#f0f0f0');

    const cards = game.init(cardClicked.bind(this));
    const cardWidth = 100; // Width of the card image
    const cardHeight = 150; // Height of the card image
    const spacing = 10; // Space between cards
    const numRows = Math.ceil(cards.length / 6); // Number of rows based on the number of cards

    // Calculate total width and height occupied by cards and spacing
    const totalWidth = 6 * cardWidth + (6 - 1) * spacing;
    const totalHeight = numRows * cardHeight + (numRows - 1) * spacing;

    // Calculate initial offsets to center the cards within the game area
    let offsetX, offsetY; 
    if (cards.length >= 6) {
        offsetX = (this.sys.game.config.width - totalWidth)/1.25;
        offsetY = (this.sys.game.config.height - totalHeight) ;
    } else {
        offsetX = (this.sys.game.config.width - totalWidth/2) / 2;
        offsetY = (this.sys.game.config.height - totalHeight/2) / 2;
    }
    

    this.cards = cards.map((card, index) => {
        const col = index % 6;
        const row = Math.floor(index / 6);
        const x = offsetX + col * (cardWidth + spacing);
        const y = offsetY + row * (cardHeight + spacing);
        const sprite = this.add.sprite(x, y, card.current);
        sprite.setInteractive();
        sprite.cardData = card;
        return sprite;
    });

    this.input.on('gameobjectdown', (pointer, gameObject) => {
        game.click(gameObject.cardData);
    });
}

function update() {
    this.cards.forEach(sprite => {
        sprite.setTexture(sprite.cardData.current);
    });
}

function cardClicked() {
    this.cards.forEach(sprite => {
        sprite.setTexture(sprite.cardData.current);
    });
}

document.getElementById('save').addEventListener('click', () => {
    game.save();
    alert('Game saved');
});