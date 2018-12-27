# react-generalized-tic-tac-toe

This tic-tac-toe game was built by following the [Tutorial: Intro to React](https://reactjs.org/tutorial/tutorial.html).  It is meant as an exercise for learning React, so it's well documented.  

In addition to implementing the six suggested improvements, it generalizes the tic-tac-toe game to n-th dimension where n = 1, 2, ..., 25.  The limit of 25 is arbitrary. 

## Six Improvements

1. Display the location for each move in the format (row, column) in the move history list.
2. Bold the currently selected move in the move history list.
3. Rewrite Board to use two loops to make the squares instead of hard-coding them.
4. Add a toggle button to let you sort the moves in either ascending or descending order.
5. When someone wins, highlight the winning squares.
6. When no one wins, display the result as a draw.

## Build & Run

After cloning the repository at a command-line terminal, go to the home directory then enter command:

```
npm start
```

Hit [localhost:3000](http://localhost:3000/) to play the game if your browser didn't open the game.

## Change Dimensions

Enter your favorite dimension at the bottom of the page to play a generalized tic-tac-toe game.

## Future Enhancements

1. To allow winning to less than the dimension. For example, to win on five in a line when the dimension is ten.
2. To mark the win as well when time travelling to win.
