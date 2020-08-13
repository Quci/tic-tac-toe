import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

// class Square extends React.Component {
//     render() {
//         return (
//             <button className="square"  onClick={() => this.props.ff()}>
//                 {this.props.value}
//             </button>
//         );
//     }
// }

const width = 3;
const height = 3;

function Square(props) {
    return (
        <button className='square' onClick={() => props.onClick()}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square value={this.props.squares[i]} key={i}
                       onClick={() => this.props.onClick(i)}/>;
    }

    render() {
        let boardRows = [];
        for (let i = 0; i < height; i++) {
            let row = [];
            for (let j = 0; j < width; j++) {
                row.push(this.renderSquare(i * width + j))
            }
            boardRows.push(row);
        }

        return (
            <div>
                {
                    boardRows.map((row, index) =>
                        <div className="board-row" key={index}>
                            {row}
                        </div>)
                }
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastCoord: [],
                recordStep: 0,
            }],
            stepNumber: 0,
            xIsNext: true,
            sort: 'asc',  // 'asc' , 'desc'
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        const coordX = Math.floor(i / width)
        const coordY = i % width;
        this.setState({
            history: history.concat([{
                squares: squares,
                lastCoord: [coordX, coordY],
                recordStep: history.length,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(move) {
        this.setState({
            stepNumber: move,
            xIsNext: move % 2 === 0,
        })
    }

    handleSortClick() {
        this.setState({
            sort: this.state.sort === 'asc'? 'desc' : 'asc',
        })
    }

    render() {
        const history = this.state.history.slice();
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        if(this.state.sort === 'desc') {
            history.reverse();
        }

        const moves = history.map((step, index) => {
            let move = step.recordStep;
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return (
                <li key={move} className={this.state.stepNumber === move ? 'font-bold' : ''}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    <span>coord: {step.lastCoord.map(item => item + 1).join()}---{step.recordStep}</span>
                </li>
            );
        })

        const sort = <button onClick={() => this.handleSortClick()}>{this.state.sort}</button>

        let status;
        if (winner) {
            status = 'winner: ' + winner
        } else {
            status = 'next player is: ' + (winner === 'X' ? 'O' : 'X');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>{sort}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

