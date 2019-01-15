import React from 'react';
import './App.css';

// a few global constants
const DFLDIM = 3;
const WINLEN = 3;

const MINDIM = 2;
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
            <input type="submit" value="Play For Me" />
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
            xIsTheMove: true,
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
        sqrs[i] = this.state.xIsTheMove ? XTOKEN : OTOKEN;

        // highlight the winning line if the new move wins
        const w = winner_and_winning_line_or_draw(i, sqrs, this.state.dimension, this.state.winlngth);
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
            xIsTheMove: !this.state.xIsTheMove,
        });
    }

    // not sure why this one doesn't need binding
    jumpTo(mv) {
        // TODO need to move every state into history to make coloring win line work correctly
        this.setState({
            mvSequentialNum: mv,
            xIsTheMove: (mv % 2) === 0, // set xIsTheMove to true if mv is even
        });
    }

    handleSortToggle() {
        this.setState({
            isSortOn: !this.state.isSortOn,
        });
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

    random_move(sqrs) {
        // check against the current board to make sure the generated computer move is valid
        let min = 0;
        let max = this.state.dimension * this.state.dimension;
        let rndmMv = Math.floor(Math.random() * (max - min)) + min;
        let i = 0;
        while (sqrs[rndmMv] !== null && i < ARRLEN) {
            i++;
            rndmMv = Math.floor(Math.random() * (max - min)) + min;
        }

        return ((i >= ARRLEN) ? null : rndmMv);
    }

    // return a move most likely to win
    to_win_move(sqrs) {
        // const p = this.state.xIsTheMove ? XTOKEN : OTOKEN;
        // const d = this.state.dimension;
        // const a = most_plausible(p, sqrs, d);
        // // TODO need to find the both ends of a here: need a help function
    }

    move_by_computer() {
        // get the current board sqrs
        const mvN = this.state.mvSequentialNum;
        const hstr = this.state.history.slice(0, mvN + 1);
        const sqrs = hstr[mvN].histSquares.slice();

        return this.random_move(sqrs);
    }

    handlePlayForMe(e) {
        // to avoid the annoying reload triggered by form's on submit; wouldn't work without this
        e.preventDefault();

        const cmv = this.move_by_computer();
        if (cmv === null) return;

        this.handleClick(cmv);
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
            const lctn = index ? (1 + row_number(msn, this.state.dimension)) + '-' + (1 + column_number(msn, this.state.dimension)) : null;
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
        const w = winner_and_winning_line_or_draw(sNum, my_sqrs, this.state.dimension, this.state.winlngth);
        let status;
        if (w === 'D') {
            status = 'It\'s a draw.';
        } else {
            status = w ? 'Winner is ' + w[0] : 'Next player: ' + (this.state.xIsTheMove ? XTOKEN : OTOKEN);
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



export function end_of_plausible_section(sctn, d, wl) {
}

// return a have-to-make move or null if there is no such move
export function have_to_make_move(sqrs, wl) {
}

// return the number of potential good moves adjacent to mv
export function degree_of_freedom(mv, sqrs) {
}

// if sctn contains only one element, it'll have up to 8 adjacent moves; ow 2 adjacent moves
export function adjacent_movable_squares(sctn, sqrs, d) {
    // const h = sctn[0];
    // if (sctn.length === 1) {
    //     const r = row_number(h, d);
    //     const c = column_number(h, d);
    //     const n = r - 1;
    //     const s = r + 1;
    //     const w = c - 1;
    //     const e = c + 1;
    //     if (n > -1) {
    //     } else {
    //     }
    // } else {
    // }
}




// scan for the most plausible line segment for the player
// loop through all possible moves for rows, cols, NE, and NW crosses
// find the longest length of lines made by the player
export function most_plausible(plyr, sqrs, d) {
    let a = [], r = [], l = 0;

    // check rows
    let i;
    for (i = 0; i < d; i++) {
        a = check_line_for_best_potential(whole_row(i, d), plyr, sqrs);
        if (a && a.length > l) {
            l = a.length;
            r = a.slice();
            a = [];
        }
    }

    // check columns
    for (i = 0; i < d; i++) {
        a = check_line_for_best_potential(whole_column(i, d), plyr, sqrs);
        if (a && a.length > l) {
            l = a.length;
            r = a.slice();
            a = [];
        }
    }

    // check south east diagonals
    for (i = 0; i < d; i++) {
        a = check_line_for_best_potential(whole_south_east(i, d), plyr, sqrs);
        if (a && a.length > l) {
            l = a.length;
            r = a.slice();
            a = [];
        }
    }
    for (i = 1; i < d; i++) {
        a = check_line_for_best_potential(whole_south_east(i * d, d), plyr, sqrs);
        if (a && a.length > l) {
            l = a.length;
            r = a.slice();
            a = [];
        }
    }

    // check south west diagonals
    for (i = 0; i < d; i++) {
        a = check_line_for_best_potential(whole_south_west(i, d), plyr, sqrs);
        if (a && a.length > l) {
            l = a.length;
            r = a.slice();
            a = [];
        }
    }
    for (i = 1; i < d; i++) {
        a = check_line_for_best_potential(whole_south_west((i + 1) * d - 1, d), plyr, sqrs);
        if (a && a.length > l) {
            l = a.length;
            r = a.slice();
            a = [];
        }
    }

    if (r.length > 0) return r;

    return null;
}

// get the entire row indexed by row number = 0, 1, ... , d-1
export function whole_row(rn, d) {
    const a = Array(d).fill(null);
    return a.map((x, i) => {return rn * d + i;});
}

// get the entire colomn indexed by col number = 0, 1, ... , d-1
export function whole_column(cn, d) {
    const a = Array(d).fill(null);
    return a.map((x, i) => {return cn + (d * i);});
}

// -1 under, 0 diagonal, 1 upper
export function what_diagonal (mv, d) {
    const r = row_number(mv, d);
    const c = column_number(mv, d);
    if (r === c) return 0;
    else if (r < c) return 1;
    else return -1;
}

// get the entire south-east diagonal identified by mv
export function whole_south_east(mv, d) {
    const wd = what_diagonal(mv, d);
    if (wd === 0) {
        const a = Array(d).fill(null);
        return a.map((x, i) => {return (d + 1) * i;});
    } else {
        const a = [];
        if (wd === 1) { // upper sub
            const s = column_number(mv, d) - row_number(mv, d);
            const l = d - s;
            let i;
            for (i = 0; i < l; i++) {
                a.push(s + i * (d + 1));
            }
        } else {
            const s = row_number(mv, d) - column_number(mv, d);
            const l = d - s;
            let i;
            for (i = 0; i < l; i++) {
                a.push(s * d + i * (d + 1));
            }
        }
        return a;
    }
}

// -1 under, 0 sub-diagonal, 1 upper
export function what_sub_diagonal (mv, d) {
    const s = 1 + row_number(mv, d) + column_number(mv, d);
    if (s === d) return 0;
    else if (s < d) return 1;
    else return -1;
}

// get the entire north-west diagonal identified by mv
export function whole_south_west(mv, d) {
    const wd = what_sub_diagonal(mv, d);
    if (wd === 0) {
        const a = Array(d).fill(null);
        return a.map((x, i) => {
            return (d - 1) * (i + 1);
        });
    } else {
        const a = [];
        if (wd === 1) { // upper
            const s = Math.abs(column_number(mv, d) - row_number(mv, d));
            let i;
            const l = s + 1;
            for (i = 0; i < l; i++) {
                a.push(s + i * (d - 1));
            }
        } else {
            const s = column_number(mv, d) + row_number(mv, d);
            const l = 2 * d - 1 -s;
            let i;
            for (i = 0; i < l; i++) {
                a.push(d * (s - d + 2) - 1 + i * (d - 1));
            }
        }
        return a;
    }
}

export function number_of_lines(mv, d) {
    if (on_inside(mv, d)) return 4;
    if (on_wall(mv, d)) return 2;
    if (on_corner(mv, d)) return 3;
}

export function on_corner(mv, d) {
    const r = row_number(mv, d);
    const c = column_number(mv, d);
    const dd = d - 1;

    if ((r === 0 || r === dd) && (c === 0 || c === dd)) return true;
    return false;
}

export function on_wall(mv, d) {
    const r = row_number(mv, d);
    const c = column_number(mv, d);
    const dd = d - 1;
    // top and bottom
    if ((r === 0 || r === dd) && c !== 0 && c !== dd) return true;
    // left and right
    if ((c === 0 || c === dd) && r !== 0 && r !== dd) return true;
    return false;
}

export function on_inside(mv, d) {
    const r = row_number(mv, d);
    const c = column_number(mv, d);
    const dd = d - 1;
    if (r !== 0 && r !== dd && c !== 0 && c !== dd) return true;
    return false;
}

// return the longest potential made by player in line
export function check_line_for_best_potential(line, plyr, sqrs) {
    let i, mv, c = 0, r = [], max = 0, ret = [];
    for (i = 0; i < line.length; i++) { // don't use map() inside for-loop
        mv = line[i];
        if (sqrs[mv] === plyr) {
            c++;
            if (c > max) {
                max = c;
                Array.prototype.push.apply(r, [mv]);
                ret = r.slice();
            }
        } else { // favor the last found one
            c = 0;
            max = 0;
            r = [];
        }
    }

    if (ret.length > 0) return ret;

    return null;
}

// if no moves of play, every one is a good move
export function moves_around_play_in_line(play, line, wl) {
    // invalid
    const l = line.length;
    if (wl > l) return null;

    // no play all, return null
    const c = number_of_consecutive_token_in_line(play, line);
    if (c === 0) return null;

    // // no play and no null, return null
    // const c = number_of_consecutive_token_in_line(play, line);
    // const n = number_of_consecutive_token_in_line(null, line);
    // if (c === 0 && n === 0) return null;

    // there is at least one move of play, put them into array t
    const t = [];
    let i;
    for (i = 0; i < l; i++) {
        if (line[i] === play) {
            t.push(i);
        }
    }

    // find the moves adjacent to the play
    const a = [];
    for (i = 0; i < t.length; i++) {
        // the move before
        const u = t[i] - 1;
        if (u > -1) {
            // if u is not in a and is valid, add it
            if (!a.includes(u) && line[u] === null) a.push(u);
        }

        // the move after
        const v = t[i] + 1;
        if (v < l) {
            // if v is not in a and is valid, add it
            if (!a.includes(v) && line[v] === null) a.push(v);
        }
    }

    if (a.length > 0) {
        return a;
    } else {
        return null;
    }
}

export function number_of_consecutive_token_in_line(tkn, line) {
    let i, c = 0, rc = 0;
    for (i = 0; i < line.length; i++) {
        if (line[i] === tkn) {
            c++;
            rc = c;
        } else {
            c = 0;
        }
    }
    return rc;
}

export function line_plausible_moves(line, plyr, sqrs, wl) {
    const l = line.length;
    const o = ((plyr === XTOKEN) ? OTOKEN : XTOKEN);
    if (l < wl) return null;
    // if = wl and there's at lease one opponent's play, return null
    if (l === wl) {
        let i;
        for (i = 0; i < l; i++) {
            if (sqrs[line[i]] === o) return null;
        }
    } else { // l > wl
        let i, c = 0;
        for (i = 0; i < l; i++) {
            if (sqrs[line[i]] === o) {
                c++;
                if (l - c < wl) return null;
            }
        }
    }

    // check the consecutiveness of plyr and nulls
    // TODO need to stick to existing plyr moves if there are choices
    let i, c = 0, nc = 0, nca = [];
    for (i = 0; i < l; i++) {
        const li = line[i];
        const e = sqrs[li];
        if (e === plyr || e === null) {
            if (e === null) {
                nc++;
                nca.push(li);
            }
            c++;
            if (c >= wl && nc > 0) return nca;
        } else {
            c = 0;
            nc = 0;
        }
    }

    return null;
}

export function number_of_continuous_plyr_and_null(line, plyr, sqrs) {
}

// has to do with wl, it determines if the line is plausible for win or not
// the line needs to have a continuous numbef of plyr and null >= wl
export function check_line_for_good_moves(line, plyr, sqrs, wl) {
}


/**
 * return:
 *  null                            not done yet
 *  D                               draw
 *  an array like ['X', 0, 1, 2]    x wins and the sqrs 0, 1, 2 to color for winning
 */
export function winner_and_winning_line_or_draw(mv, sqrs, d, wl) {
    // x wins
    let a = player_winning_moves(XTOKEN, mv, sqrs, d, wl);
    if (a) return a;

    // o wins
    a = player_winning_moves(OTOKEN, mv, sqrs, d, wl);
    if (a) return a;

    // game continues
    let i;
    for (i = 0; i < d * d; i++) {
        if (sqrs[i] === null) return null;
    }

    // draw
    return 'D';
}

export function check_arr_for_win(arr, plyr, sqrs, wl) {
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

// check plyr's winning in each of all 4 directions centered around mv
export function player_winning_moves(plyr, mv, sqrs, d, wl) {
    let a = [], r = [], firstWin = false;

    // won in rows
    a = check_arr_for_win(row_section(mv, d, wl), plyr, sqrs, wl);
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
    a = check_arr_for_win(column_section(mv, d, wl), plyr, sqrs, wl);
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
    a = check_arr_for_win(north_east_section(mv, d, wl), plyr, sqrs, wl);
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
    a = check_arr_for_win(north_west_section(mv, d, wl), plyr, sqrs, wl);
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

export function row_number(squareNum, d) {
    return Math.floor(squareNum / d);
}

export function column_number(squareNum, d) {
    return (squareNum % d);
}

export function move_to_row_and_column(sqrN, d) {
    const r = Math.floor(sqrN / d);
    const c = (sqrN % d);
    return [r, c];
}

export function row_and_column_to_move(r, c, d) {
    return r * d + c;
}

export function west_square_number(r, c, d) {
    const t = c - 1;
    return (t < 0) ? null : row_and_column_to_move(r, t, d);
}

export function east_square_number(r, c, d) {
    const t = c + 1;
    return (t >= d) ? null : row_and_column_to_move(r, t, d);
}

export function north_square_number(r, c, d) {
    const t = r - 1;
    return (t < 0) ? null : row_and_column_to_move(t, c, d);
}

export function south_square_number(r, c, d) {
    const t = r + 1;
    return (t >= d) ? null : row_and_column_to_move(t, c, d);
}

export function nroth_west_square_number(r, c, d) {
    const s = r - 1, t = c - 1;
    return (s < 0 || t < 0) ? null : row_and_column_to_move(s, t, d);
}

export function south_west_square_number(r, c, d) {
    const s = r + 1, t = c - 1;
    return (s >= d || t < 0) ? null : row_and_column_to_move(s, t, d);
}

export function nroth_east_square_number(r, c, d) {
    const s = r - 1, t = c + 1;
    return (s < 0 || t >= d) ? null : row_and_column_to_move(s, t, d);
}

export function south_east_square_number(r, c, d) {
    const s = r + 1, t = c + 1;
    return (s >= d || t >= d) ? null : row_and_column_to_move(s, t, d);
}

// row section centered by mv extending up to wl-1 squares in both directions
export function row_section(mv, d, wl) {
    let a = [], j;
    const [r, c] = move_to_row_and_column(mv, d);
    for (j = wl - 2; j >= 0; j--) {
        const t = c - j;
        if (t >= 0) {
            const n = west_square_number(r, t, d);
            if (n != null) a.push(n);
        }
    }
    a.push(mv);
    for (j = 0; j < wl - 1; j++) {
        const t = c + j;
        if (t < d) {
            const n = east_square_number(r, t, d);
            if (n != null) a.push(n);
        }
    }
    return a;
}

export function column_section(mv, d, wl) {
    let a = [], i;
    const [r, c] = move_to_row_and_column(mv, d);
    for (i = wl - 2; i >= 0; i--) {
        const t = r - i;
        if (t >= 0) {
            const n = north_square_number(t, c, d);
            if (n != null) a.push(n);
        }
    }
    a.push(mv);
    for (i = 0; i < wl - 1; i++) {
        const t = r + i;
        if (t < d) {
            const n = south_square_number(t, c, d);
            if (n != null) a.push(n);
        }
    }
    return a;
}

export function north_east_section(mv, d, wl) {
    let a = [], i;
    const [r, c] = move_to_row_and_column(mv, d);
    for (i = wl - 2; i >= 0; i--) {
        const s = r - i;
        const t = c - i;
        if (s >= 0 && t >= 0) {
            const n = nroth_west_square_number(s, t, d);
            if (n != null) a.push(n);
        }
    }
    a.push(mv);
    for (i = 0; i < wl - 1; i++) {
        const s = r + i;
        const t = c + i;
        if (s < d && t < d) {
            const n = south_east_square_number(s, t, d);
            if (n != null) a.push(n);
        }
    }
    return a;
}

export function north_west_section(mv, d, wl) {
    let a = [], i;
    const [r, c] = move_to_row_and_column(mv, d);
    for (i = wl - 2; i >= 0; i--) {
        const s = r - i;
        const t = c + i;
        if (s >= 0 && t < d) {
            const n = nroth_east_square_number(s, t, d);
            if (n != null) a.push(n);
        }
    }
    a.push(mv);
    for (i = 0; i < wl - 1; i++) {
        const s = r + i;
        const t = c - i;
        if (s < d && t >= 0) {
            const n = south_west_square_number(s, t, d);
            if (n != null) a.push(n);
        }
    }
    return a;
}
