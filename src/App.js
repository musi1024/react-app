import React, { useState } from 'react';
import './App.scss';

function Square(params) {
  return (
    <button className="square" onClick={() => params.onClick()}>
      {params.value}
    </button>
  );
}

function Board(params) {
  const squareRow = params.squares.map((i, index) => (
    <Square
      value={i}
      key={index.toString()}
      onClick={() => params.onClick(index)}
    />
  ));
  return (
    <div>
      <div className="status">{params.status}</div>
      <div className="board-row">{squareRow}</div>
    </div>
  );
}

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([]);
  const [stepNumber, setStepNumber] = useState(0);

  let status;
  const winner = calculateWinner(squares);
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  function handleClick(i) {
    let newSquares = [...squares];
    if (winner || newSquares[i]) return;
    setSquares(() => {
      newSquares[i] = xIsNext ? 'X' : 'O';
      return newSquares;
    });
    setXIsNext(!xIsNext);
    setStepNumber(stepNumber + 1);
    setHistory([...history.slice(0, stepNumber), newSquares]);
  }

  function resetSquares() {
    setSquares(Array(9).fill(null));
    setHistory([]);
  }

  function jumpTo(step, move) {
    setSquares(step);
    setXIsNext(move % 2 === 0);
    setStepNumber(move);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} onClick={i => handleClick(i)} />
        <button onClick={() => resetSquares()}>reset</button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <Moves history={history} onClick={(step, move) => jumpTo(step, move)} />
      </div>
    </div>
  );
}

function Moves(params) {
  const li = params.history.map((step, move) => {
    const desc = 'Go to move #' + (move + 1);
    return (
      <li key={move.toString()}>
        <button onClick={() => params.onClick(step, move + 1)}>{desc}</button>
      </li>
    );
  });
  return <ol>{li}</ol>;
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
