import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// a few global constants
var MINDIM = 1;
var MAXDIM = 25;
var ARRLEN = 10000;

// A function component of React: only contains a return method and is stateless.  It's a plain js function which takes props as the argument and returns a React element.
function Square({ value, bgc, onClick }) {
    return (
        <button className="square" onClick={onClick} style={{ backgroundColor: bgc }}>
            {value}
        </button>
    );
}

/**
 * board consists of squares numbered as / 1 2 3 \ for 3x3
 *                                       | 4 5 6 |
 *                                       \ 7 8 9 /
 */


// this component does nothing except render stuff, so using a regular function is simpler
const FunctionalBoard = ({ dmnsn, squares, bgClrs, onClick }) => {
    const dimensionArray = [...Array(dmnsn).keys()];  // [ 0, 1, ... dmnsn-1 ];
    const boardMatrix = dimensionArray.map((v, index) => {
        const startVal = dmnsn * index;

        return dimensionArray.map(value => startVal + value);
    });

    return (
        <div>
            {
                boardMatrix.map((row, rowIndex) =>
                    <div className="board-row" key={rowIndex}>
                        {
                            row.map(value =>
                                <Square
                                    key={value}
                                    value={squares[value]}
                                    onClick={() => onClick(value)}
                                    bgc={bgClrs[value]}
                                />
                            )
                        }
                    </div>)
            }
        </div>
    );

    // this commented stuff does the same thing as everything inside the return statement above, it is just factored differently
    // const renderSquare = value =>
    //     <Square
    //         key={value}
    //         value={squares[value]}
    //         onClick={() => onClick(value)}
    //         bgc={bgClrs[value]}
    //     />;
    // const renderRow = (row, rowIndex) =>
    //     <div className="board-row" key={rowIndex}>
    //         {
    //             row.map(renderSquare)
    //         }
    //     </div>;
    // const elBoard = boardMatrix.map(renderRow);

    // return <div>{elBoard}</div>;
};



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
        const d = this.props.dmnsn;
        const twoDemBoard = Array(d).fill(null);
        for (let i = 0; i < d; i++) {
            const rowArr = Array(d).fill(null);
            for (let j = 0; j < d; j++) {
                rowArr[j] = i * d + j;
            }
            twoDemBoard[i] = rowArr;
        }
        // twoDemBoard = [[0, 1, 2], [3, 4, 5], [6, 7, 8]] for dim = 3;
        return (
            <div>
                {twoDemBoard.map((e) => this.boardRow(e))}
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
        this.state = this.getInitialState();
        this.handleSortToggle = this.handleSortToggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    getInitialState() {
        // mahe the initial state immutable to support state reset
        const initialState = {
            history: [{
                squares: Array(ARRLEN).fill(null),
                squrNum: null,
            }],
            moveNumber: 0, // the displayed move number on UI
            xIsNext: true,
            isSortOn: false,
            bgColors: Array(ARRLEN).fill('white'),
            dimension: 3,
        };
        return initialState;
    }

    resetState() {
        this.setState(this.getInitialState());
    }

    handleClick(i) {
        // increment the move number
        const mvN = this.state.moveNumber + 1;

        // get the history only for moves so far; this is important for maintaining the history correctly even when going back in time
        const hstr = this.state.history.slice(0, mvN);

        // the board squares right before the new move
        const sqrs = hstr[hstr.length - 1].squares.slice();

        // return and no updating if already won or moving into an occupied square
        if (sqrs[i] || winnerAndWinningLineOrDraw(sqrs, this.state.dimension)) return;

        // add the new move in
        sqrs[i] = this.state.xIsNext ? 'X' : 'O';

        // then, update the state to re-render the UI to reflect all changes caused by the new move
        this.setState({
            history: hstr.concat([{
                squares: sqrs,
                squrNum: i,
            }]),
            moveNumber: mvN,
            xIsNext: !this.state.xIsNext,
        });

        // now, it's time to set up the winning line highlighting if the new move wins
        const w = winnerAndWinningLineOrDraw(sqrs, this.state.dimension);
        if (w) {
            const clrs = this.state.bgColors.slice();
            for (let i = 1; i <= this.state.dimension; i++) clrs[w[i]] = 'lightblue';

            this.setState({
                bgColors: clrs,
            });
        }
    }

    // not sure why this one doesn't need binding
    jumpTo(mv) {
        this.setState({
            moveNumber: mv,
            xIsNext: (mv % 2) === 0, // set xIsNext to true if mv is even
            bgColors: Array(ARRLEN).fill('white'), // totally clear/reset the color; this is why no coloring when winning in time travel in the history; moving color to history is one way to correct this
        });
    }

    handleSortToggle() {
        this.setState({
            isSortOn: !this.state.isSortOn,
        });
    }

    handleChange(event) {
        const v = parseInt(event.target.value);
        if (v < MINDIM || v > MAXDIM) {
            alert('You entered ' + v + '. Please enter a value between ' + MINDIM + ' and ' + MAXDIM + '.');
            return;
        }
        this.resetState();
        this.setState({
            dimension: v,
        });
    }

    render() {
        // Using the map method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to “jump” to past moves.
        // Array.map() syntax: array.map( function(currentValue, index, arr), thisValue )
        //                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        const historicalMoves = this.state.history.map((currValue, index) => {
            const dscrptn = index ? 'Go to move # ' + index : 'Go to game start';
            const crrtMv = (index === this.state.moveNumber) ? (<span style={{ fontWeight: 900 }}>{dscrptn}</span>) : dscrptn;
            const sn = currValue.squrNum;
            const lctn = index ? '(' + row(sn, this.state.dimension) + ', ' + col(sn, this.state.dimension) + ')' : null;
            // In the tic-tac-toe game’s history, each past move has a unique ID associated with it: it’s the sequential index of the move. The moves are never re-ordered, deleted, or inserted in the middle, so it’s safe to use the move index as a key.
            return (
                <li key={index}>
                    <button onClick={() => this.jumpTo(index)}>{crrtMv}</button> {lctn}
                </li>
            );
        });
        // to support sort toggle: no change to the history at all, only change the on-screen presentation of the history
        const sortedMoves = this.state.isSortOn ? historicalMoves.sort((a, b) => { return (b.key - a.key) }) : historicalMoves;

        // set the status accordingly right before rendering
        const sqrs = this.state.history[this.state.moveNumber].squares;
        const w = winnerAndWinningLineOrDraw(sqrs, this.state.dimension);
        let status;
        if (w === 'D') {
            status = 'It\'s a draw.';
        } else {
            status = w ? 'Winner is ' + w[0] : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div>
                <div className="game-board">
                    <Board
                        squares={sqrs}
                        onClick={(i) => this.handleClick(i)}
                        bgClrs={this.state.bgColors}
                        dmnsn={this.state.dimension}
                    />
                    <br />
                    <FunctionalBoard
                        squares={sqrs}
                        onClick={(i) => this.handleClick(i)}
                        bgClrs={this.state.bgColors}
                        dmnsn={this.state.dimension}
                    />
                </div>

                <div class="left" id="bigger"></div>

                <div className="left">
                    <div>{status}</div>
                    <div class="left" id="bigger"></div>
                    <button type="button" onClick={this.handleSortToggle}>
                        {this.state.isSortOn ? 'Un Sort' : 'Sort'}
                    </button>
                    <ol>{sortedMoves}</ol>
                </div>

                <div class="left" id="bigger"></div>

                <form>
                    Enter dimension:
                    <input type="text" value={this.state.dimension} onChange={this.handleChange} />
                </form>
            </div>
        );
    }
}

function isPlayerWon(sqrs, plyr, d) {
    var c = 0, a = Array(d).fill(null);

    // won in rows
    for (let i = 0; i < d; i++) {
        c = 0;
        for (let j = 0; j < d; j++) {
            let mv = i * d + j;
            if (sqrs[mv] === plyr) {
                a[j] = mv;
                c++;
            } else {
                break;
            }
        }
        if (c === d) {
            return [plyr, a].flat();
        }
    }

    // won in columns
    for (let j = 0; j < d; j++) {
        c = 0;
        for (let i = 0; i < d; i++) {
            let mv = i * d + j;
            if (sqrs[mv] === plyr) {
                a[i] = mv;
                c++;
            } else {
                break;
            }
        }
        if (c === d) {
            return [plyr, a].flat();
        }
    }

    // diagonal left top to right bottom
    c = 0;
    for (let i = 0; i < d; i++) {
        let mv = i * (d + 1);
        if (sqrs[mv] === plyr) {
            a[i] = mv;
            c++;
        } else {
            break;
        }
        if (c === d) {
            return [plyr, a].flat();
        }
    }

    // diagonal right top to left bottom
    c = 0;
    const m = d - 1;
    for (let i = 1; i <= d; i++) {
        let mv = i * m;
        if (sqrs[mv] === plyr) {
            a[i - 1] = mv;  // since i started from 1 not 0
            c++;
        } else {
            break;
        }
        if (c === d) {
            return [plyr, a].flat();
        }
    }

    return false;
}

function winnerAndWinningLineOrDraw(sqrs, d) {
    // x wins
    let a = isPlayerWon(sqrs, 'X', d);
    if (a) return a;

    // o wins
    a = isPlayerWon(sqrs, 'O', d);
    if (a) return a;

    // game continues
    for (let i = 0; i < d * d; i++) {
        if (sqrs[i] === null) {
            return null;
        }
    }

    // draw
    return 'D';
}

function row(squareNum, d) {
    return Math.floor(squareNum / d) + 1;
}

function col(squareNum, d) {
    return (squareNum % d) + 1;
}

// ============================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
