import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick} >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

function calculateWinner(sqrs) {
    const wnrs = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < wnrs.length; i++) {
        const [a, b, c] = wnrs[i];
        const v = sqrs[a];
        if (v && v === sqrs[b] && v === sqrs[c]) {
            return v;
        }
    }
    return null;
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
        };
    }

    handleClick(i) {
        const hstr = this.state.history;
        const sqrs = hstr[hstr.length - 1].squares.slice();
        if (calculateWinner(sqrs) || sqrs[i]) {
            return;
        }
        sqrs[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: hstr.concat([{
                squares: sqrs,
            }]),
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        const hstr = this.state.history;
        const sqrs = hstr[hstr.length - 1].squares;
        const w = calculateWinner(sqrs);

        // Using the map method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to “jump” to past moves.
        const moves = this.state.history.map((step, index) => {
            const dscrptn = index ? 'Go to move # ' + index : 'Go to game start';
            return (
                <li key={index}>
                    <button onClick={() => this.johnTo(index)}>{dscrptn}</button>
                </li>
            );
        });

        let stts;
        if (w) {
            stts = 'Winner is ' + w;
        } else {
            stts = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

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

// ============================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
