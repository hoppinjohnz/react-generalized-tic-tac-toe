import React from 'react';
import './App.css';

// a few global constants
const DFLDIM = 7;
const WINLEN = 5;

const MINDIM = 1;
const MAXDIM = 25;
const ARRLEN = MAXDIM * MAXDIM; // TODO possible to use dimension * dimension length instead to be more efficient

const XTOKEN = 'X';
const OTOKEN = 'O';

// A function component of React: only contains a return method and is stateless.  It's a plain js function which takes props as the argument and returns a React element.
function Square(props) {
    return (
        <button className="square" onClick={props.onClick} style={{backgroundColor: props.bgc}} >
            <span className={props.currmv} > {props.value} </span>
        </button>
    );
}

/**
 * board consists of sqrs numbered as / 1 2 3 \ for 3x3
 *                                    | 4 5 6 |
 *                                    \ 7 8 9 /
 */
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square key={i}
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
                bgc={this.props.bgClrs[i]}
                currmv={(i === this.props.sqrnum) ? 'current_move' : null} // to make the current move stand out
            />
        );
    }

    boardRow(rw) {
        const r = rw.slice();
        return (
            <div key={r} className="board-row">
                {r.map((c) => this.renderSquare(c))}
            </div>
        );
    }

    fullBoard() {
        const d = this.props.dmnsn;
        const twoDimBoard = Array(d).fill(null);
        let i;
        for (i = 0; i < d; i++) { // cannot use map here: need to pass d in
            const rowArr = Array(d).fill(null);
            let j;
            for (j = 0; j < d; j++) {
                rowArr[j] = i * d + j;
            }
            twoDimBoard[i] = rowArr;
        }
        // twoDimBoard = [[0, 1, 2], [3, 4, 5], [6, 7, 8]] for dim = 3;
        return (
            <div>
                {twoDimBoard.map((r) => this.boardRow(r))}
            </div>
        );
    }

    render() {
        return this.fullBoard();
    }
}

/**
 * The value of the child input is assigned to the this.dimension property of the parent via 'ref' attribute connected to the dimension prop, 
 * so the child's value is available to the parent.
 */
function CustomInput(props) {
    return (
        <div>
            <label>{props.label}:</label>
            <input className="input_size" type="text" placeholder={props.plchldr} ref={(props.dimension === null) ? props.winlength : props.dimension} />
            <div style={{color: "red"}}>{(props.input_error === null) ? props.wl_error : props.input_error}</div>
        </div>
    );
}

function PlayForMeInput(props) {
    return (
        <div>
            <div style={{color: "red"}}>{(props.input_error === null) ? props.wl_error : props.input_error}</div>
            <input type="submit" value="Click Me To Play The Next Move" />
        </div>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.handleSortToggle = this.handleSortToggle.bind(this);
        this.handleDimSubmit = this.handleDimSubmit.bind(this);
        this.handleWinLenSubmit = this.handleWinLenSubmit.bind(this);
        this.handlePlayForMe = this.handlePlayForMe.bind(this);
    }
    
    getInitialState() {
        // make the initial state immutable to support state reset
        const initialState = {
            history: [{
                histSquares: Array(ARRLEN).fill(null), // doesn't show which move is the current move
                mvSqurNum: null, // the current move to display (r, c) - move location on history list
                bgColors: Array(ARRLEN).fill('white'),
                alreadyWon: false, // to support return without checking previous wins after clicking a square
            }],
            mvSequentialNum: 0, // the single trigger data from which all rendering data are derived
            xIsNext: true,
            isSortOn: false,
            dimension: DFLDIM,
            winlngth: WINLEN,
            dm_error: null,
            wl_error: null,
        };
        return initialState;
    }
  
    resetState() {
       this.setState(this.getInitialState());
    }

    handleClick(i) {
        const mvN = this.state.mvSequentialNum;

        // store the move number for the new move
        const newMvN = mvN + 1;

        // get the history only for moves so far; this is important for maintaining the history correctly even when going back in time
        const hstr = this.state.history.slice(0, newMvN);

        // the board right before the new move
        const sqrs = hstr[mvN].histSquares.slice();
        const alrW = hstr[mvN].alreadyWon;

        // stop and no updating if clicked on an occupied square or game won
        if (sqrs[i] || alrW) return;


        // process the new move after this point

        // add the new move in
        sqrs[i] = this.state.xIsNext ? XTOKEN : OTOKEN;

        // highlight the winning line if the new move wins
        const w = winnerAndWinningLineOrDraw(i, sqrs, this.state.dimension, this.state.winlngth);
        const clrs = hstr[mvN].bgColors.slice();
        let alrWon = false;
        if (w) {
            let j;
            for (j = 1; j <= w.length; j++) clrs[w[j]] = 'lightblue';
            alrWon = true;
        }

        // then, update the state to re-render the UI to reflect all changes caused by the new move including winning coloring
        this.setState({
            history: hstr.concat([{
                histSquares: sqrs,
                mvSqurNum: i,
                bgColors: clrs,
                alreadyWon: alrWon,
            }]),
            mvSequentialNum: newMvN,
            xIsNext: !this.state.xIsNext,
        });
    }

    // not sure why this one doesn't need binding
    jumpTo(mv) {
        // TODO need to move every state into history to make coloring win line work correctly
        this.setState({
            mvSequentialNum: mv,
            xIsNext: (mv % 2) === 0, // set xIsNext to true if mv is even
        });
    }

    handleSortToggle() {
        this.setState({
            isSortOn: !this.state.isSortOn,
        });
    }

    onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
          event.preventDefault();
        }
    }

    handleDimSubmit(e) {
        e.preventDefault();
        const v = parseInt(this.dimension.value);
        const w = this.state.winlngth;
        if (isNaN(v) || v === null || v < MINDIM || v > MAXDIM || v < w) {
            const e = 'You entered ' + v + '. Please enter a value between ' + ((v < w) ? w : MINDIM) + ' and ' + MAXDIM + '.';
            this.setState({
                dm_error: e,
            });
            return;
        }
        this.resetState();
        this.setState({
            dimension: v,
            winlngth: w,
        });
    }

    handleWinLenSubmit(e) {
        e.preventDefault();
        const v = parseInt(this.winlength.value);
        const d = this.state.dimension;
        if (isNaN(v) || v === null || v < MINDIM || v > d) {
            const e = 'You entered ' + v + '. Please enter a value between ' + MINDIM + ' and ' + d + '.';
            this.setState({
                wl_error: e,
            });
            return;
        }
        this.resetState();
        this.setState({
            dimension: d,
            winlngth: v,
        });
    }

    handlePlayForMe(e) {
        // to avoid the annoying reload triggered by form onsubmit; wuoldn't work without this
        e.preventDefault();

        // get the current board sqrs
        const mvN = this.state.mvSequentialNum;
        const hstr = this.state.history.slice(0, mvN + 1);
        const sqrs = hstr[mvN].histSquares.slice();

        let min = 0;
        let max = this.state.dimension * this.state.dimension;

        // make sure rndmMv is playable
        let rndmMv = Math.floor(Math.random() * (max - min)) + min;
        while (sqrs[rndmMv] !== null) {
            rndmMv = Math.floor(Math.random() * (max - min)) + min;
        }

        this.handleClick(rndmMv);
        console.log('hi there');
    }

    render() {
        // the single trigger data from which all other rendering data are derived: it can come from clicking either squares or history list
        const mvNum = this.state.mvSequentialNum;

        // Using the map method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to “jump” to past moves.
        // Array.map() syntax: array.map( function(currentValue, index, arr), thisValue )
        //                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        const historicalMoves = this.state.history.map((currValue, index) => {
            const dscrptn = index ? 'Move ' : 'Start';
            // to mark the curr move in the history list
            const crrtMv = (index === mvNum) ? (<span className="current_move" >{dscrptn}</span>) : dscrptn;
            const msn = currValue.mvSqurNum;
            const lctn = index ? (1 + rowNum(msn, this.state.dimension)) + '-' + (1 + colNum(msn, this.state.dimension)) : null;
            // In the tic-tac-toe game’s history, each past move has a unique ID associated with it: it’s the sequential index of the move. The moves are never re-ordered, deleted, or inserted in the middle, so it’s safe to use the move index as a key.
            return (
                <li key={index}>
                    <button onClick={() => this.jumpTo(index)}>{crrtMv} {lctn}</button>
                </li>
            );
        });
        // to support sort toggle: no change to the history at all, only change the on-screen presentation of the history
        const sortedMoves = this.state.isSortOn ? historicalMoves.sort( (a, b) => {return (b.key - a.key)} ) : historicalMoves;

        // get data out of history keyed on the move number whether it's from playing game or clicking on history list
        const my_sqrs = this.state.history[mvNum].histSquares;
        const my_clrs = this.state.history[mvNum].bgColors;
        const sNum = this.state.history[mvNum].mvSqurNum;

        // set the status accordingly right before rendering
        const w = winnerAndWinningLineOrDraw(sNum, my_sqrs, this.state.dimension, this.state.winlngth);
        let status;
        if (w === 'D') {
            status = 'It\'s a draw.';
        } else {
            status = w ? 'Winner is ' + w[0] : 'Next player: ' + (this.state.xIsNext ? XTOKEN : OTOKEN);
        }

        return (
            <div>
                <h3> Tic-Tac-Toe (d, w) = ({this.state.dimension}, {this.state.winlngth}) </h3>

                {/* Usually, the arrow function is on the input itself, but here it's being passed down as a prop. Since the arrow function resides in the parent, the 'this' of 'this.dimension' lives in the parent. */}
                <form onSubmit={this.handleDimSubmit}>
                    <CustomInput
                        label={'Dimension'}
                        dimension={v => this.dimension = v}
                        winlength={null}
                        plchldr={DFLDIM}
                        input_error={this.state.dm_error}
                    />
                </form>

                <div id="tiny"></div>

                <form onSubmit={this.handleWinLenSubmit}>
                    <CustomInput
                        label={'Win Length'}
                        dimension={null}
                        winlength={v => this.winlength = v}
                        plchldr={WINLEN}
                        input_error={this.state.wl_error}
                    />
                </form>

                <div id="tiny"></div>

                <form onSubmit={this.handlePlayForMe}>
                    <PlayForMeInput
                        input_error={this.state.wl_error}
                    />
                </form>

                <div id="small"></div>

                <div className="game">
                    <div className="game-board">
                        <Board
                            squares={my_sqrs}
                            onClick={(i) => this.handleClick(i)}
                            bgClrs={my_clrs}
                            dmnsn={this.state.dimension}
                            sqrnum={sNum}
                        />
                    </div>

                    <div className="game-info">
                        <div>{status}</div>
                        <div id="big"></div>
                        <button type="button" onClick={this.handleSortToggle}>
                            {this.state.isSortOn ? 'Un Sort History' : 'Sort History'}
                        </button>
                        <ol>{sortedMoves}</ol>
                    </div>
                </div>

                <p> This is tic-tac-toe.  But, you can change the board dimension and win length.  Changing board dimension to 11 and win length to 5, you will have a challenging and enjoyable 5-in-a-row game. </p>

                <p> The play history allows you to time-travel into history to re-play or do-it-over from any point in the past. </p>
            </div>
        );
    }
}

export default Game;

export function chkArrForWin(arr, plyr, sqrs, wl) {
    let i, mv, c = 0, a = [], r = [], firstW = true;
    for (i = 0; i < arr.length; i++) { // don't use map() inside for-loop
        mv = arr[i];
        if (sqrs[mv] === plyr) {
            a[i] = mv;
            c++;
            if (c >= wl) {
                if (firstW) {
                    Array.prototype.push.apply(r, [plyr, a].flat());
                    firstW = false;
                } else {
                    Array.prototype.push.apply(r, a.flat());
                }
            }
        } else {
            c = 0;
            a = [];
        }
    }

    if (r.length > 0) return r;

    return null;
}

export function playerWinningMoves(plyr, sn, sqrs, d, wl) {
    let a = [], r = [], firstWin = false;

    // won in rows
    a = chkArrForWin(rowSec(sn, d, wl), plyr, sqrs, wl);
    if (a) {
        if (firstWin) {
            Array.prototype.push.apply(r, a.slice(1));
        } else {
            Array.prototype.push.apply(r, a.slice());
            firstWin = true;
        }
        a = [];
    }

    // won in columns
    a = chkArrForWin(colSec(sn, d, wl), plyr, sqrs, wl);
    if (a) {
        if (firstWin) {
            Array.prototype.push.apply(r, a.slice(1));
        } else {
            Array.prototype.push.apply(r, a.slice());
            firstWin = true;
        }
        a = [];
    }

    // won in north east diagonals
    a = chkArrForWin(neaSec(sn, d, wl), plyr, sqrs, wl);
    if (a) {
        if (firstWin) {
            Array.prototype.push.apply(r, a.slice(1));
        } else {
            Array.prototype.push.apply(r, a.slice());
            firstWin = true;
        }
        a = [];
    }

    // won in north west diagonals
    a = chkArrForWin(nweSec(sn, d, wl), plyr, sqrs, wl);
    if (a) {
        if (firstWin) {
            Array.prototype.push.apply(r, a.slice(1));
        } else {
            Array.prototype.push.apply(r, a.slice());
            firstWin = true;
        }
        a = [];
    }

    if (r.length > 0) return r;

    return false;
}

/**
 * return:
 *  null    not done yet
 *  D       draw
 *  an array like ['X', 0, 1, 2]    x wins and the sqrs 0, 1, 2 to color for winning
 *
 * @param {k} mv
 * @param {*} sqrs
 * @param {*} d
 * @param {*} wl
 */
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
        if (sqrs[i] === null) return null;
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
