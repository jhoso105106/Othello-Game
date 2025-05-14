# Othello Game

## Overview
This project is a simple implementation of the classic board game Othello (also known as Reversi). The game allows two players to compete against each other by placing their pieces on an 8x8 board, with the objective of having the majority of pieces in their color at the end of the game.

## Project Structure
```
othello-game
├── src
│   ├── index.html      # HTML structure for the Othello game
│   ├── app.js         # JavaScript logic for game functionality
│   └── styles
│       └── styles.css  # CSS styles for the game layout and appearance
├── README.md          # Documentation for the project
```

## Files Description
- **src/index.html**: This file contains the HTML structure for the Othello game. It includes the game board, player information, and buttons to start or reset the game.
  
- **src/app.js**: This file contains the JavaScript logic for the Othello game. It handles the game state, player turns, board updates, and win conditions. It exports functions such as `initializeGame`, `makeMove`, and `checkWinner`.

- **src/styles/styles.css**: This file contains the CSS styles for the Othello game. It defines the layout and appearance of the game board, pieces, and buttons.

## How to Play
1. Open the `index.html` file in a web browser to start the game.
2. Players take turns placing their pieces on the board. A piece can be placed in a position where it will "sandwich" one or more of the opponent's pieces between the newly placed piece and another piece of the player's color.
3. The game continues until no more valid moves are available for either player.
4. The player with the most pieces of their color on the board at the end of the game wins.

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Open `src/index.html` in your preferred web browser to play the game.

Enjoy playing Othello!