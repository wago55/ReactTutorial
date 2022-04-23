import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
  return (
    <button className={`square ${props.highright ? "highright" : ""}`}
      onClick={() => props.onClick()} 
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, highright) {
    return(
      <Square 
        highright={highright}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
       />
    );
  }

  render() {
    return (
      <div>
        {
          Array(3).fill(0).map((row, i) => {
            return (
              <div className="board-row">
                {
                  Array(3).fill(0).map((col, j) => {
                    return (
                      this.renderSquare(i * 3 + j, this.props.line.indexOf(i * 3 + j) !== -1)
                    );
                  })
                }
              </div>
            );
          }) 
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
        position_col: Array(9).fill(null),
        position_row: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const position_col = current.position_col.slice();
    const position_row = current.position_row.slice();
    const col = i % 3;
    const row = Math.floor(i / 3);

    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    position_col[this.state.stepNumber] = col;
    position_row[this.state.stepNumber] = row;

    this.setState({
      history: history.concat([{
        squares: squares,
        position_col: position_col,
        position_row: position_row,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      isAsc: true,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleAsc() {
    this.setState({
      asc: !this.state.asc,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      const desc = move ? 
        'Go to move #' + move :
        'Go to game start';
        return (
          <li key={move}>
            <button onClick = {() => this.jumpTo(move)} className={this.state.stepNumber === move ? 'bold' : ''}>
              {desc}
            </button>
          </li>
        );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    }
    else{
      if(this.state.stepNumber === 9){
        status = 'Draw!!'
      }
      else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O');
      }
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            line={winner ? winner.line : []}
            onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div><button onClick={() => this.toggleAsc()}>asc ⇔ desc</button></div>
          <ol>{this.state.asc === true ? moves : moves.reverse()}</ol>
          <div>{current.position_col[this.state.stepNumber - 1]} {current.position_row[this.state.stepNumber - 1]}</div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
        line: [a, b, c],
      };
    }
  }
  return null;
}
