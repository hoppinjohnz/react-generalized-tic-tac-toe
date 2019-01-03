import React from 'react';
import './App.css';

// a few global constants
const DFLDIM = 3;
const WINLEN = 3;

const MINDIM = 1;
const MAXDIM = 25;
const ARRLEN = MAXDIM * MAXDIM; // TODO possible to use dimension * dimension length instead to be more efficient

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
        this.handleDimChange = this.handleDimChange.bind(this);
        this.handleWinLength = this.handleWinLength.bind(this);
    }
    
    getInitialState() {
        // mahe the initial state immutable to support state reset
        const initialState = {
            history: [{
                squares: Array(ARRLEN).fill(null),
                mvSqurNum: null, // to display (r, c) - move location on history list
            }],
            moveNumber: 0, // the displayed move number on UI
            xIsNext: true,
            isSortOn: false,
            bgColors: Array(ARRLEN).fill('white'),
            dimension: DFLDIM,
            winlngth: WINLEN,
            alreadyWon: false, // to support return without checking previous wins after clicking a square
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

        // return and no updating if moving into an occupied square or already won
        if (sqrs[i] || this.state.alreadyWon) return;

        // add the new move in
        sqrs[i] = this.state.xIsNext ? XTOKEN : OTOKEN;

        // then, update the state to re-render the UI to reflect all changes caused by the new move
        this.setState({
            history: hstr.concat([{
                squares: sqrs,
                mvSqurNum: i,
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
                alreadyWon: true,
            });
        }
    }

    // not sure why this one doesn't need binding
    jumpTo(mv) {
        this.setState({
            moveNumber: mv,
            xIsNext: (mv % 2) === 0, // set xIsNext to true if mv is even
            bgColors: Array(ARRLEN).fill('white'), // totally clear/reset the color; this is why no coloring when winning in time travel in the history; moving color to history is one way to correct this
            alreadyWon: false,
        });
    }

    handleSortToggle() {
        this.setState({
            isSortOn: !this.state.isSortOn,
        });
    }

    handleDimChange(event) {
        const v = parseInt(event.target.value);
        const w = this.state.winlngth;
        if (isNaN(v) || v === null || v < MINDIM || v > MAXDIM || v < w) {
            alert('You entered ' + v + '. Please enter a value between ' + ((v < w) ? w : MINDIM) + ' and ' + MAXDIM + '.');
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
        if (isNaN(v) || v === null || v < MINDIM || v > d) {
            alert('You entered ' + v + '. Please enter a value between ' + MINDIM + ' and ' + d + '.');
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
            const sn = currValue.mvSqurNum;
            const lctn = index ? '(' + (1 + rowNum(sn, this.state.dimension)) + ', ' + (1 + colNum(sn, this.state.dimension)) + ')' : null;
            // In the tic-tac-toe game’s history, each past move has a unique ID associated with it: it’s the sequential index of the move. The moves are never re-ordered, deleted, or inserted in the middle, so it’s safe to use the move index as a key.
            return (
                <li key={index}>
                    <button onClick={() => this.jumpTo(index)}>{crrtMv}</button> {lctn} - {sn}
                </li>
            );
        });
        // to support sort toggle: no change to the history at all, only change the on-screen presentation of the history
        const sortedMoves = this.state.isSortOn ? historicalMoves.sort( (a, b) => {return (b.key - a.key)} ) : historicalMoves;

        // set the status accordingly right before rendering
        const sqrs = this.state.history[this.state.moveNumber].squares;
        const sn = this.state.history[this.state.moveNumber].mvSqurNum;
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
                    <input type="text" value={this.state.dimension} onChange={this.handleDimChange} />
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

export default Game;

export function chkArrForWin(arr, plyr, sqrs, wl) {
    let i, mv, c = 0, a = [];
    for (i = 0; i < arr.length; i++) {
        mv = arr[i];
        if (sqrs[mv] === plyr) {
            a[i] = mv;
            c++;
            if (c === wl) return [plyr, a].flat();
        } else {
            c = 0;
            a = [];
        }
    }
    return null;
}

export function playerWinningMoves(plyr, sn, sqrs, d, wl) {
    let r = [];

    // won in rows
    r = chkArrForWin(rowSec(sn, d, wl), plyr, sqrs, wl); 
    if (r) return r;

    // won in columns
    r = chkArrForWin(colSec(sn, d, wl), plyr, sqrs, wl); 
    if (r) return r;

    // won in north east diagonals
    r = chkArrForWin(neaSec(sn, d, wl), plyr, sqrs, wl); 
    if (r) return r;

    // won in north west diagonals
    r = chkArrForWin(nweSec(sn, d, wl), plyr, sqrs, wl); 
    if (r) return r;

    return false;
}

export function winnerAndWinningLineOrDraw(mv, sqrs, d, wl) {
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

export function rowNum(squareNum, d) {
    return Math.floor(squareNum / d);
}

export function colNum(squareNum, d) {
    return (squareNum % d);
}

export function mv2RowAndCol(sqrN, d) {
    const r = Math.floor(sqrN / d);
    const c = (sqrN % d);
    return [r, c];
}

export function rowAndCol2mv(r, c, d) {
    return r * d + c;
}

export function weSN(r, c, d) {
    const t = c - 1;
    return (t < 0) ? null : rowAndCol2mv(r, t, d);
}

export function eaSN(r, c, d) {
    const t = c + 1;
    return (t >= d) ? null : rowAndCol2mv(r, t, d);
}

export function noSN(r, c, d) {
    const t = r - 1;
    return (t < 0) ? null : rowAndCol2mv(t, c, d);
}

export function soSN(r, c, d) {
    const t = r + 1;
    return (t >= d) ? null : rowAndCol2mv(t, c, d);
}

export function nwSN(r, c, d) {
    const s = r - 1, t = c - 1;
    return (s < 0 || t < 0) ? null : rowAndCol2mv(s, t, d);
}

export function swSN(r, c, d) {
    const s = r + 1, t = c - 1;
    return (s >= d || t < 0) ? null : rowAndCol2mv(s, t, d);
}

export function neSN(r, c, d) {
    const s = r - 1, t = c + 1;
    return (s < 0 || t >= d) ? null : rowAndCol2mv(s, t, d);
}

export function seSN(r, c, d) {
    const s = r + 1, t = c + 1;
    return (s >= d || t >= d) ? null : rowAndCol2mv(s, t, d);
}

export function rowSec(mv, d, wl) {
    let a = [], j;
    const [r, c] = mv2RowAndCol(mv, d);
    for (j = wl - 2; j >= 0; j--) {
        const t = c - j;
        if (t >= 0) {
            const n = weSN(r, t, d);
            if (n != null) a.push(n);
        }
    }
    a.push(mv);
    for (j = 0; j < wl - 1; j++) {
        const t = c + j;
        if (t < d) {
            const n = eaSN(r, t, d);
            if (n != null) a.push(n);
        }
    }
    return a;
}

export function colSec(mv, d, wl) {
    let a = [], i;
    const [r, c] = mv2RowAndCol(mv, d);
    for (i = wl - 2; i >= 0; i--) {
        const t = r - i;
        if (t >= 0) {
            const n = noSN(t, c, d);
            if (n != null) a.push(n);
        }
    }
    a.push(mv);
    for (i = 0; i < wl - 1; i++) {
        const t = r + i;
        if (t < d) {
            const n = soSN(t, c, d);
            if (n != null) a.push(n);
        }
    }
    return a;
}

export function neaSec(mv, d, wl) {
    let a = [], i;
    const [r, c] = mv2RowAndCol(mv, d);
    for (i = wl - 2; i >= 0; i--) {
        const s = r - i;
        const t = c - i;
        if (s >= 0 && t >= 0) {
            const n = nwSN(s, t, d);
            if (n != null) a.push(n);
        }
    }
    a.push(mv);
    for (i = 0; i < wl - 1; i++) {
        const s = r + i;
        const t = c + i;
        if (s < d && t < d) {
            const n = seSN(s, t, d);
            if (n != null) a.push(n);
        }
    }
    return a;
}

export function nweSec(mv, d, wl) {
    let a = [], i;
    const [r, c] = mv2RowAndCol(mv, d);
    for (i = wl - 2; i >= 0; i--) {
        const s = r - i;
        const t = c + i;
        if (s >= 0 && t < d) {
            const n = neSN(s, t, d);
            if (n != null) a.push(n);
        }
    }
    a.push(mv);
    for (i = 0; i < wl - 1; i++) {
        const s = r + i;
        const t = c - i;
        if (s < d && t >= 0) {
            const n = swSN(s, t, d);
            if (n != null) a.push(n);
        }
    }
    return a;
}
