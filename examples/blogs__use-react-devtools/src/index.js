import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faUndo, faRedo } from '@fortawesome/free-solid-svg-icons';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            move: 0,
            squares: Array(9).fill(null),
            squaresHistory: Array(9).fill(null),
            xIsNext: true,
        };
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        const squaresHistory = this.state.squaresHistory.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        let x = 'X';
        let o = 'O';

        let move = this.state.move;
        squaresHistory[move] = this.state.squares;
        move++;
        squares[i] = this.state.xIsNext ? x : o;

        this.setState({
            move: move,
            squares: squares,
            squaresHistory: squaresHistory,
            xIsNext: !this.state.xIsNext,
        });

        this.props.onToggleX(this.state.xIsNext);
    }

    handleUndo() {
        let move = this.state.move;

        const squaresHistory = this.state.squaresHistory.slice();
        squaresHistory[move] = this.state.squares;

        --move;
        this.setState({
            move: move,
            squares: this.state.squaresHistory[move],
            squaresHistory: squaresHistory,
            xIsNext: !this.state.xIsNext,
        });

        this.props.onToggleX(this.state.xIsNext);
    }

    handleRedo() {
        let move = this.state.move;
        move++;
        this.setState({
            move: move,
            squares: this.state.squaresHistory[move],
            xIsNext: !this.state.xIsNext,
        });

        this.props.onToggleX(this.state.xIsNext);
    }

    handleNewGame() {
        this.setState({
            move: 0,
            squares: Array(9).fill(null),
            squaresHistory: Array(9).fill(null),
            xIsNext: true,
        });

        this.props.onToggleX(this.state.xIsNext);
    }

    renderSquare(i) {
        return (
            <Square
                extraClass={this.state.xIsNext ? 'revert' : ''}
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div>
                <div className="status">{status}</div>
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
                <div className="icons">
                    <button
                        data-tip="Undo"
                        className="function-button"
                        disabled={this.state.move === 0}
                        onClick={() => this.handleUndo()}>
                        <FontAwesomeIcon icon={faUndo} size="4x" />
                    </button>
                    <ReactTooltip place="bottom" type="info" effect="float" />
                    <button
                        data-tip="Redo"
                        className="function-button"
                        disabled={this.state.squaresHistory[this.state.move + 1] === null}
                        onClick={() => this.handleRedo()}>
                        <FontAwesomeIcon icon={faRedo} size="4x" />
                    </button>
                    <ReactTooltip place="bottom" type="info" effect="float" />
                    <button
                        data-tip="New Game"
                        className="function-button"
                        onClick={() => this.handleNewGame()}>
                        <FontAwesomeIcon icon={faFile} size="4x" />
                    </button>
                    <ReactTooltip place="bottom" type="warning" effect="float" />
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: 'game',
        };
    }

    onToggleX = x => {
        this.setState({
            classes: x ? 'revert game' : 'game',
        });
    };
    render() {
        return (
            <div className={this.state.classes}>
                <div className="game-board">
                    <Board onToggleX={this.onToggleX} />
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
ReactDOM.render(<Game />, document.getElementById('root'));
