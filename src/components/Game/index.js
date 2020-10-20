import classnames from 'classnames';
import React, { useState } from 'react';
import Board from './../Board';

export default function Game() {
    const [history, setHistory] = useState([
        {
          squares: Array(9).fill(null),
          location: null,
        },
    ]);
    const [xIsNext, setXIsNext] = useState(true);
    const [stepNumber, setStepNumber] = useState(0);
    const [isAscending, setIsAscending] = useState(true);
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //     history: [{
    //         squares: Array(9).fill(null),
    //     }],
    //     stepNumber: 0,
    //     xIsNext: true,
    //     isAscending: true
    //     };
    // }


    // handleClick(i) {
    //     const history = this.state.history.slice(0, this.state.stepNumber + 1);
    //     const current = history[history.length - 1];
    //     const squares = current.squares.slice();
    //     if (calculateWinner(squares).winner || squares[i]) {
    //     return;
    //     }
    //     squares[i] = this.state.xIsNext ? 'X' : 'O';
    //     this.setState({
    //     history: history.concat([{
    //         squares: squares,
    //         lastMoveSquare: i
    //     }]),
    //     stepNumber: history.length,
    //     xIsNext: !this.state.xIsNext,
    //     });
    // }

    const handleClick = (i) => {
        const newHistory = history.slice(0, stepNumber + 1);
        const current = newHistory[newHistory.length - 1];
        const squares = current.squares.slice();
        const { winner } = calculateWinner(squares);
        if (winner || squares[i]) {
            return;
        }
        squares[i] = xIsNext ? 'X' : 'O';
        setHistory([...newHistory, { squares, step: i }]);
        setStepNumber(newHistory.length);
        setXIsNext(!xIsNext);
    };

    const handleReset = () => {
        setHistory([
            {
            squares: Array(9).fill(null),
            location: null,
            },
        ]);
        setXIsNext(true);
        setStepNumber(0);
        setIsAscending(true);
    };
    

    // jumpTo(step) {
    //     this.setState({
    //     stepNumber: step,
    //     xIsNext: (step % 2) === 0,
    //     });
    // }
    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext(step % 2 === 0);
    };

    const convertToLocation = (step) => {
        const col = (step % 3) + 1;
        const row = Math.trunc(step / 3) + 1;
        return [row, col];
    };

    const handleSortToggle = () => {
        setIsAscending(!isAscending);
    };

    {
        // const history = this.state.history;
        const current = history[stepNumber];
        // const stepNumber = this.state.stepNumber;
        const winInfo = calculateWinner(current.squares);
        const winner = winInfo.winner;
        // const isAscending = this.state.isAscending;
        //const { winner, line } = calculateWinner(current.squares);

        const moves = history.map((item, index) => {
        //const lastMoveSquare = step.lastMoveSquare;
        const [row, col] = convertToLocation(item.step);
        const desc = index ?
            'Go to move #' + index + ' (' + col + ', ' + row + ')':
            'Go to game start';
        return (
            <li key={index}>
            <button
                className={classnames({ 'selected-item': stepNumber === index })}
                onClick={() => jumpTo(index)}>{desc}</button>
            </li>
        );
        });
        
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } 
        else if (winInfo.isDraw) {
            status = "Draw";
        }
        else {
            status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }

        if (!isAscending) {
            moves.reverse();
        }

        return (
        <div className="game">
            <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i) => handleClick(i)}
                winnerLine={winInfo.line}
            />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <button onClick={handleReset}>Reset</button>
                <button onClick={handleSortToggle}>
                    {isAscending ? 'Ascending' : 'Descending'}
                </button>
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
        return {
            winner: squares[a],
            line: lines[i],
            isDraw: false,
        };
        }
    }

    let isDraw = true;
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
        isDraw = false;
        break;
        }
    }
    return {
        winner: null,
        line: null,
        isDraw: isDraw,
    };
}