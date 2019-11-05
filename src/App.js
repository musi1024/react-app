import React, { useState } from 'react';
import './App.scss';

function Square(params) {
  return (
    <button className="square" onClick={() => params.onClick()}>
      {params.value}
    </button>
  );
}

function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const squareRow = squares.map((i, index) => (
    <Square
      value={i}
      key={index.toString()}
      onClick={() => handleClick(index)}
    />
  ));
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
    console.log('**debug**', i);
    setSquares(() => {
      newSquares[i] = xIsNext ? 'X' : 'O';
      return newSquares;
    });
    setXIsNext(!xIsNext);
  }
  function resetSquares() {
    setSquares(Array(9).fill(null));
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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">{squareRow}</div>
      <button onClick={resetSquares}>reset</button>
    </div>
  );
}

function App() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <div>{/* status */}</div>
        <ol>{/* TODO */}</ol>
      </div>
    </div>
  );
}

export default App;
