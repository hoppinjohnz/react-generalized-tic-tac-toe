import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// a few global constants
const DEFDIM = 3;
const WINLEN = 3;

const MINDIM = 1;
const MAXDIM = 25;
const ARRLEN = MAXDIM * MAXDIM; // TODO possible to use dimension length instead to be more efficient

const XTOKEN = 'X';
const OTOKEN = 'O';

// A function component of React: only contains a return method and is stateless.  It's a plain js function which takes props as the argument and returns a React element.
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
        const d = this.props.dmnsn;
        const twoDemBoard = Array(d).fill(null);
        let i;
        for (i = 0; i < d; i++) {
            const rowArr = Array(d).fill(null);
            let j;
            for (j = 0; j < d; j++) {
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
        this.handleWinLength = this.handleWinLength.bind(this);
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
            dimension: DEFDIM,
            winlngth: WINLEN,
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
        if (sqrs[i] || winnerAndWinningLineOrDraw(i, sqrs, this.state.dimension, this.state.winlngth)) return;

        // add the new move in
        sqrs[i] = this.state.xIsNext ? XTOKEN : OTOKEN;

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
        const w = winnerAndWinningLineOrDraw(i, sqrs, this.state.dimension, this.state.winlngth);
        if (w) {
            const clrs = this.state.bgColors.slice();
            let i;
            for (i = 1; i <= this.state.dimension; i++) clrs[w[i]] = 'lightblue';

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
        const w = this.state.winlngth;
        if (v < MINDIM || v > MAXDIM) {
            alert('You entered ' + v + '. Please enter a value between ' + MINDIM + ' and ' + MAXDIM + '.');
            return;
        }
        this.resetState();
        this.setState({
            dimension: v,
            winlngth: w,
        });
    }

    handleWinLength(event) {
        const v = parseInt(event.target.value);
        const d = this.state.dimension;
        if (v < MINDIM || v > this.state.dimension) {
            alert('You entered ' + v + '. Please enter a value between ' + MINDIM + ' and ' + this.state.dimension + '.');
            return;
        }
        this.resetState();
        this.setState({
            dimension: d,
            winlngth: v,
        });
    }

    onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
          event.preventDefault();
        }
    }

    render() {
        // Using the map method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to “jump” to past moves.
        // Array.map() syntax: array.map( function(currentValue, index, arr), thisValue )
        //                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        const historicalMoves = this.state.history.map((currValue, index) => {
            const dscrptn = index ? 'Go to move ' : 'Go to game start';
            const crrtMv = (index === this.state.moveNumber) ? (<span style={ {fontWeight: 900} }>{dscrptn}</span>) : dscrptn;
            const sn = currValue.squrNum;
            const lctn = index ? '(' + rowNum(sn, this.state.dimension) + ', ' + colNum(sn, this.state.dimension) + ')' : null;
            // In the tic-tac-toe game’s history, each past move has a unique ID associated with it: it’s the sequential index of the move. The moves are never re-ordered, deleted, or inserted in the middle, so it’s safe to use the move index as a key.
            return (
                <li key={index}>
                    <button onClick={() => this.jumpTo(index)}>{crrtMv}</button> {lctn}
                </li>
            );
        });
        // to support sort toggle: no change to the history at all, only change the on-screen presentation of the history
        const sortedMoves = this.state.isSortOn ? historicalMoves.sort( (a, b) => {return (b.key - a.key)} ) : historicalMoves;

        // set the status accordingly right before rendering
        const sqrs = this.state.history[this.state.moveNumber].squares;
        const sn = this.state.history[this.state.moveNumber].squrNum;
        const w = winnerAndWinningLineOrDraw(sn, sqrs, this.state.dimension, this.state.winlngth);
        let status;
        if (w === 'D') {
            status = 'It\'s a draw.';
        } else {
            status = w ? 'Winner is ' + w[0] : 'Next player: ' + (this.state.xIsNext ? XTOKEN : OTOKEN);
        }

        return (
            <div>
                <h1> Tic-Tac-Toe Generalized </h1>

                <p> This is a traditional tic-tac-toe game by default.  In addition, it can be played with any board dimension and any win length.  Try to change board dimension to 11 and win length to 5.  It will become a challenging and enjoyable game of 5-in-a-roll. </p>

                <p> The play history allows to time travel back into history. You can go back to re-play or do-it-over play from any point in the past. Try it. </p>

                <div class="left" id="bigger"></div>

                <form onKeyPress={this.onKeyPress}>
                    Enter Board Dimension:
                    <input type="text" value={this.state.dimension} onChange={this.handleChange} />
                </form>
                <div class="left" id="tiny"></div>

                <form onKeyPress={this.onKeyPress}>
                    Enter Winning Length:
                    <input type="text" value={this.state.winlngth} onChange={this.handleWinLength} />
                </form>

                <div class="left" id="small"></div>

                <div className="game">
                    <div className="game-board">
                        <Board
                            squares={sqrs}
                            onClick={(i) => this.handleClick(i)}
                            bgClrs={this.state.bgColors}
                            dmnsn={this.state.dimension}
                        />
                    </div>

                    <div className="game-info">
                        <div>{status}</div>
                        <div class="left" id="big"></div>
                        <button type="button" onClick={this.handleSortToggle}>
                            {this.state.isSortOn ? 'Un Sort History' : 'Sort History'}
                        </button>
                        <ol>{sortedMoves}</ol>
                    </div>
                </div>
            </div>
        );
    }
}

function fullRow(mv, d) {
    const r = rowNum(mv, d) - 1;
    let a = [], j;
    for (j = 0; j < d; j++) a.push(r * d + j);
    return a;
}

function playerWinningMoves(plyr, sn, sqrs, d, wl) {
    let c = 0, a = Array(ARRLEN).fill(null);
    let i, j, k, mv;

    const fr = fullRow(sn, d);
    for (j = 0; j < d; j++) {
        const p = sqrs[fr[j]];
        if (p === plyr) {
            a[j] = fr[j];
            c++;
            if (c === wl) return [plyr, a].flat();
        } else {
            c = 0;
            a = [];
        }
    }


    // won in rows
    // for (i = 0; i < d; i++) {
    //     c = 0;
    //     for (j = 0; j < d; j++) {
    //         mv = i * d + j;
    //         if (sqrs[mv] === plyr) {
    //             a[j] = mv;
    //             c++;
    //             if (c === wl) return [plyr, a].flat();
    //         } else {
    //             c = 0;
    //             a = [];
    //         }
    //     }
    //     a = [];
    // }

    // won in columns
    for (j = 0; j < d; j++) {
        c = 0;
        for (i = 0; i < d; i++) {
            mv = i * d + j;
            if (sqrs[mv] === plyr) {
                a[i] = mv;
                c++;
                if (c === wl) return [plyr, a].flat();
            } else {
                c = 0;
                a = [];
            }
        }
        a = [];
    }

    // diagonal left top to right bottom and its upper diagonal lines
    for (k = 0; k < d; k++) {
        c = 0;
        for (i = 0; i < d - k; i++) {
            mv = i * (d + 1) + k;
            if (sqrs[mv] === plyr) {
                a[i] = mv;
                c++;
                if (c === wl) return [plyr, a].flat();
            } else {
                c = 0;
                a = [];
            }
        }
        a = [];
    }

    // its lower sub diagonal lines
    for (k = 1; k < d; k++) { // no k = 0 to skip main diagonal
        c = 0;
        for (i = 0; i < d - k; i++) {
            mv = i * (d + 1) + k * d;
            if (sqrs[mv] === plyr) {
                a[i] = mv;
                c++;
                if (c === wl) return [plyr, a].flat();
            } else {
                c = 0;
                a = [];
            }
        }
        a = [];
    }

    // diagonal right top to left bottom and its upper lines
    for (k = 0; k < d; k++) {
        c = 0;
        const m = d - 1;
        for (i = 1; i <= d - k; i++) {
            mv = i * m - k;
            if (sqrs[mv] === plyr) {
                a[i - 1] = mv;  // since i started from 1 not 0
                c++;
                if (c === wl) return [plyr, a].flat();
            } else {
                c = 0;
                a = [];
            }
        }
        a = [];
    }

    // its lower sub diagonal lines
    for (k = 1; k < d; k++) { // no main diagonal
        c = 0;
        const m = d - 1;
        for (i = 1; i <= d - k; i++) {
            mv = i * m + k * d;
            if (sqrs[mv] === plyr) {
                a[i - 1] = mv;  // since i started from 1 not 0
                c++;
                if (c === wl) return [plyr, a].flat();
            } else {
                c = 0;
                a = [];
            }
        }
        a = [];
    }

    return false;
}

function winnerAndWinningLineOrDraw(mv, sqrs, d, wl) {
    // x wins
    let a = playerWinningMoves(XTOKEN, mv, sqrs, d, wl);
    if (a) return a;

    // o wins
    a = playerWinningMoves(OTOKEN, mv, sqrs, d, wl);
    if (a) return a;

    // game continues
    let i;
    for (i = 0; i < d * d; i++) {
        if (sqrs[i] === null) {
            return null;
        }
    }

    // draw
    return 'D';
}

function rowNum(squareNum, d) {
    return Math.floor(squareNum / d) + 1;
}

function colNum(squareNum, d) {
    return (squareNum % d) + 1;
}

function fullCol(mv, d) {
    const c = colNum(mv, d) - 1;
    let a = [], i;
    for (i = 0; i < d; i++) a.push(i * d + c);
    return a;
}

function diagonalNE(mv, d, wl) {
    const r = rowNum(mv, d);
    const c = colNum(mv, d);
    const u = c - r;

    let a = [], k;
    if (u > 0) { // upper
        for (k = u; k < d; k++) a.push(k + (k - u) * d);
        return (a.length < wl ? null : a);
    } else if (u < 0) { // lower
        for (k = -u; k < d; k++) a.push(k + d - 1 + (k + u) * d);
        return (a.length < wl ? null : a);
    } else { // diag
        for (k = 0; k < d; k++) a.push((d + 1) * k);
        return a;
    }
}

function diagonalNW(mv, d, wl) {
    const r = rowNum(mv, d);
    const c = colNum(mv, d);
    const u = r + c;

    let a = [], k;
    const t = d - u, s = d - 1;
    if (u < d) { // upper
        for (k = t; k <= d; k++) a.push(u + (k - t) * s);
        return (a.length < wl ? null : a);
    } else if (u > d) { // lower
        for (k = u - d + 1; k < d; k++) a.push(u + k * s);
        return (a.length < wl ? null : a);
    } else { // diag
        for (k = 1; k <= d; k++) a.push(k * s);
        return a;
    }
}

// ============================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
