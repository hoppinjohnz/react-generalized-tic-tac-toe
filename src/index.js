import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var DIM = 3;

function Square(props) {
    return (
        <button className="square" onClick={props.onClick} style={{backgroundColor: props.bgc}}>
            {props.value}
        </button>
    );
}

/**
 * board consists of squares numbered as / 1 2 3 \ for 3x3
 *                                       | 4 5 6 |
 *                                       \ 7 8 9 /
 */
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square key={i}
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
                bgc={this.props.bgClrs[i]}
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
                squrNum: null,
            }],
            moveNumber: 0, // the displayed move number on UI
            xIsNext: true,
            isSortOn: false,
            bgColors: Array(DIM * DIM).fill('white'),
        };
        this.handleSortToggle = this.handleSortToggle.bind(this);
    }

    handleClick(i) {
        // increament the move number
        const mvN = this.state.moveNumber + 1;

        // very important: get the history only for moves so far to shorten the history correctly even when going back in time
        const hstr = this.state.history.slice(0, mvN);

        // the board squares right before the new move
        const sqrs = hstr[hstr.length - 1].squares.slice();

        // return and no updating if already won or moving into an occupied square
        // TODO highlight the winning cells here 
        if (sqrs[i] || calculateWinner(sqrs)) return;

        // add the new move in
        sqrs[i] = this.state.xIsNext ? 'X' : 'O';

        // update the state to re-render the UI to reflect all UI changes caused by the new move
        this.setState({
            history: hstr.concat([{
                squares: sqrs,
                squrNum: i,
            }]),
            moveNumber: mvN,
            xIsNext: !this.state.xIsNext,
        });

        // now, it's time to check for winner to highlight the winning line
        const w = calculateWinner(sqrs);
        if (w) {
            const clrs = this.state.bgColors.slice();
            for (let i = 1; i <= DIM; i++) clrs[w[i]] = 'lightblue';

            this.setState({
                bgColors: clrs,
            });
        }
    }

    jumpTo(mv) {
        this.setState({
            moveNumber: mv,
            xIsNext: (mv % 2) === 0, // set xIsNext to true if mv is even
            bgColors: Array(DIM * DIM).fill('white'),
        });
    }

    handleSortToggle() {
        this.setState({
            isSortOn: !this.state.isSortOn,
        });
    }

    render() {
        // Using the map method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to “jump” to past moves.
        // Array.map() syntax: array.map( function(currentValue, index, arr), thisValue )
        //                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        const historicalMoves = this.state.history.map((currValue, index) => {
            const dscrptn = index ? 'Go to move # ' + index : 'Go to game start';
            const crrtMv = (index === this.state.moveNumber) ? (<span style={ {fontWeight: 900} }>{dscrptn}</span>) : dscrptn;
            const c = currValue.squrNum;
            const lctn = index ? '(' + row(c) + ', ' + col(c) + ')' : null;
            // In the tic-tac-toe game’s history, each past move has a unique ID associated with it: it’s the sequential index of the move. The moves are never re-ordered, deleted, or inserted in the middle, so it’s safe to use the move index as a key.
            return (
                <li key={index}>
                    <button onClick={() => this.jumpTo(index)}>{crrtMv}</button> {lctn}
                </li>
            );
        });

        // to support sort toggle: no change to the history at all, just sort the on-screen presentation or not
        const sortedMoves = this.state.isSortOn ? historicalMoves.sort( (a, b) => {return (b.key - a.key)} ) : historicalMoves;

        const sqrs = this.state.history[this.state.moveNumber].squares;
        const w = calculateWinner(sqrs);
        let status;
        if (w === 'D') {
            status = 'It\'s a draw.';
        } else {
            status = w ? 'Winner is ' + w[0] : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={sqrs}
                        onClick={(i) => this.handleClick(i)}
                        bgClrs={this.state.bgColors}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button type="button" onClick={this.handleSortToggle}>
                        {this.state.isSortOn ? 'Un Sort' : 'Sort'}
                    </button>
                    <ol>{sortedMoves}</ol>
                </div>
            </div>
        );
    }
}

function isWon(sqrs, plyr) {
    var c = 0, a = Array(DIM).fill(null);

    // won in rows
    for (let i = 0; i < DIM; i++) {
        c = 0;
        for (let j = 0; j < DIM; j++) {
            let mv = i * DIM + j;
            if (sqrs[mv] === plyr) {
                a[j] = mv;
                c++;
            } else {
                break;
            }
        }
        if (c === DIM) {
            return [plyr, a].flat();
        }
    }

    // won in columns
    for (let j = 0; j < DIM; j++) {
        c = 0;
        for (let i = 0; i < DIM; i++) {
            let mv = i * DIM + j;
            if (sqrs[mv] === plyr) {
                a[i] = mv;
                c++;
            } else {
                break;
            }
        }
        if (c === DIM) {
            return [plyr, a].flat();
        }
    }

    // diagonal left top to right bottom
    c = 0;
    for (let i = 0; i < DIM; i++) {
        let mv = i * (DIM + 1);
        if (sqrs[mv] === plyr) {
            a[i] = mv;
            c++;
        } else {
            break;
        }
        if (c === DIM) {
            return [plyr, a].flat();
        }
    }

    // diagonal right top to left bottom
    c = 0;
    const m = DIM - 1;
    for (let i = 1; i <= DIM; i++) {
        let mv = i * m;
        if (sqrs[mv] === plyr) {
            a[i - 1] = mv;  // since i started from 1 not 0
            c++;
        } else {
            break;
        }
        if (c === DIM) {
            return [plyr, a].flat();
        }
    }

    return false;
}

function calculateWinner(sqrs) {
    // x wins
    let a = isWon(sqrs, 'X');
    if (a) return a;

    // o wins
    a = isWon(sqrs, 'O');
    if (a) return a;

    // game continues
    for (let i = 0; i < sqrs.length; i++) {
        if (sqrs[i] === null) {
            return null;
        }
    }

    // draw
    return 'D';
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
