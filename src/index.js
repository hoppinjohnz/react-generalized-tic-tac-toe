import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var DIM = 5;

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square key={i}
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    boardRow(rw) {
        const cols = rw.slice();
        return (
            <div key={cols} className="board-row">
                {cols.map((i) => this.renderSquare(i))}
            </div>
        );
    }

    fullBoard() {
        const a = Array(DIM).fill(null);
        for (let i = 0; i < DIM; i++) {
            const b = Array(DIM).fill(null);
            for (let j = 0; j < DIM; j++) {
                b[j] = i * DIM + j;
            }
            a[i] = b;
        }
        // a = [[0, 1, 2], [3, 4, 5], [6, 7, 8]] for dim = 3;
        return (
            <div>
                {a.map((e) => this.boardRow(e))}
            </div>
        );
    }

    render() {
        return (
            this.fullBoard()
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(DIM * DIM).fill(null),
                cell: null,
            }],
            moveNumber: 0, // the displayed move number on UI
            xIsNext: true,
        };
    }

    handleClick(i) {
        const mvN = this.state.moveNumber + 1;
        // very important: make a copy of history only for elements so far; this automatically shorten the history correctly when going back in time 
        const hstr = this.state.history.slice(0, mvN);

        // the current board squares right before updating
        const sqrs = hstr[hstr.length - 1].squares.slice();

        // return and no updating if already won or moving into an occupied square
        if (calculateWinner(sqrs) || sqrs[i]) {
            return;
        }

        // add the current move
        sqrs[i] = this.state.xIsNext ? 'X' : 'O';

        // update the state to result in the updated UI with the current new move
        this.setState({
            history: hstr.concat([{
                squares: sqrs,
                cell: i,
            }]),
            moveNumber: mvN,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(mv) {
        this.setState({
            moveNumber: mv,
            xIsNext: (mv % 2) === 0, // set xIsNext to true if mv is even
        });
    }

    render() {
        // Using the map method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to “jump” to past moves.
        // Array.map() syntax: array.map( function(currentValue, index, arr), thisValue )
        //                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        const moves = this.state.history.map((currValue, index) => {
            const dscrptn = index ? 'Go to move # ' + index : 'Go to game start';
            const crrtMv = (index === this.state.moveNumber) ? '>>> ' + dscrptn : dscrptn;
            const c = currValue.cell;
            const lctn = index ? '(' + row(c) + ', ' + col(c) + ')' : null;
            // In the tic-tac-toe game’s history, each past move has a unique ID associated with it: it’s the sequential index of the move. The moves are never re-ordered, deleted, or inserted in the middle, so it’s safe to use the move index as a key.
            return (
                <li key={index}>
                    <button onClick={() => this.jumpTo(index)}>{crrtMv}</button> {lctn}
                </li>
            );
        });

        const sqrs = this.state.history[this.state.moveNumber].squares;

        const w = calculateWinner(sqrs);
        let stts = w ? 'Winner is ' + w : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={sqrs}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{stts}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function isWon(sqrs, plyr) {
    var c = 0;
    // won in rows
    for (let i = 0; i < DIM; i++) {
        c = 0;
        for (let j = 0; j < DIM; j++) {
            if (sqrs[i * DIM + j] === plyr) {
                c++;
            } else {
                break;
            }
        }
        if (c === DIM) {
            return true;
        }
    }

    // won in columns
    for (let j = 0; j < DIM; j++) {
        c = 0;
        for (let i = 0; i < DIM; i++) {
            if (sqrs[i * DIM + j] === plyr) {
                c++;
            } else {
                break;
            }
        }
        if (c === DIM) {
            return true;
        }
    }

    // diagonal left top to right bottom
    c = 0;
    for (let i = 0; i < DIM; i++) {
        if (sqrs[i * (DIM + 1)] === plyr) {
            c++;
        } else {
            break;
        }
        if (c === DIM) {
            return true;
        }
    }

    // diagonal right top to left bottom
    c = 0;
    const m = DIM - 1;
    for (let i = 1; i <= DIM; i++) {
        if (sqrs[i * m] === plyr) {
            c++;
        } else {
            break;
        }
        if (c === DIM) {
            return true;
        }
    }

    return false;
}

function calculateWinner(sqrs) {
    if (isWon(sqrs, 'X')) {
        return 'X';
    } else if (isWon(sqrs, 'O')) {
        return 'O';
    } else {
        return null;
    }
}

function row(c) {
    return Math.floor(c / DIM) + 1;
}

function col(c) {
    return (c % DIM) + 1;
}

// ============================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
