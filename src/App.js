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
  const squares = chunk(params.squares, params.colNum);
  const squareRow = squares.map((i, row) => (
    <div className="board-row" key={`board${row}`}>
      {i.map((j, col) => {
        const key = row * params.colNum + col;
        return (
          <Square
            value={j}
            num={key}
            key={key.toString()}
            onClick={() => params.onClick(key, row + 1, col + 1)}
          />
        );
      })}
    </div>
  ));
  return (
    <div>
      <div className="status">{params.status}</div>
      {squareRow}
    </div>
  );
}

function Moves({ onClick, history, stepNumber }) {
  const li = history.map((step, move) => {
    const desc = `Go to move #${move + 1} row: ${step.row} col: ${step.col}`;
    const className = stepNumber - 1 === move ? 'active' : '';
    return (
      <li className={className} key={move.toString()}>
        <button onClick={() => onClick(step.history, move + 1)}>{desc}</button>
      </li>
    );
  });
  return <ol>{li}</ol>;
}

function App() {
  const rowNum = 10;
  const colNum = 10;
  const size = rowNum * colNum;
  const [squares, setSquares] = useState(Array(size).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([]);
  const [stepNumber, setStepNumber] = useState(0);

  let status;
  const winner = calculateWinner(history[stepNumber - 1], colNum, 5);
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  function handleClick(key, row, col) {
    let newSquares = [...squares];
    if (winner || newSquares[key]) return;
    setSquares(() => {
      newSquares[key] = xIsNext ? 'X' : 'O';
      return newSquares;
    });
    setXIsNext(!xIsNext);
    setStepNumber(stepNumber + 1);
    setHistory([
      ...history.slice(0, stepNumber),
      { history: newSquares, row, col }
    ]);
  }

  function resetSquares() {
    setXIsNext(true);
    setSquares(Array(size).fill(null));
    setHistory([]);
    setStepNumber(0);
  }

  function jumpTo(step, move) {
    setSquares(step);
    setXIsNext(move % 2 === 0);
    setStepNumber(move);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={squares}
          colNum={colNum}
          onClick={(key, row, col) => handleClick(key, row, col)}
        />
        <button onClick={() => resetSquares()}>reset</button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <Moves
          history={history}
          stepNumber={stepNumber}
          onClick={(step, move) => jumpTo(step, move)}
        />
      </div>
    </div>
  );
}

function calculateWinner(history, colNum, winNum) {
  if (!history) return;
  const arr = chunk(history.history, colNum);
  const { row, col } = history;
  const params = {
    value: arr[row - 1][col - 1],
    arr,
    row: row - 1,
    col: col - 1,
    winNum
  };
  return checkCol(params) ||
    checkRow(params) ||
    checkLeft(params) ||
    checkRight(params)
    ? params.value
    : false;
}

function checkCol({ value, arr, row, col, winNum }) {
  let colWin = [];
  let upwrong = false;
  let downWrong = false;
  for (let i = 1; i < winNum; i++) {
    if (downWrong && upwrong) break;
    if (arr[row - i] && arr[row - i][col] === value && !upwrong) {
      colWin.push(arr[row - i][col]);
    } else {
      upwrong = true;
    }
    if (arr[row + i] && arr[row + i][col] === value && !upwrong) {
      colWin.push(arr[row + i][col]);
    } else {
      downWrong = true;
    }
  }
  return colWin.length >= winNum - 1;
}

function checkRow({ value, arr, row, col, winNum }) {
  let rowWin = [];
  let upwrong = false;
  let downWrong = false;
  for (let i = 1; i < winNum; i++) {
    if (downWrong && upwrong) break;
    if (arr[row] && arr[row][col - i] === value && !upwrong) {
      rowWin.push(arr[row][col - i]);
    } else {
      upwrong = true;
    }
    if (arr[row] && arr[row][col + i] === value && !downWrong) {
      rowWin.push(arr[row][col + i]);
    } else {
      downWrong = true;
    }
  }
  return rowWin.length >= winNum - 1;
}

function checkLeft({ value, arr, row, col, winNum }) {
  let leftWin = [];
  let upwrong = false;
  let downWrong = false;
  for (let i = 1; i < winNum; i++) {
    if (downWrong && upwrong) break;
    if (arr[row - i] && arr[row - i][col - i] === value && !upwrong) {
      leftWin.push(arr[row - i][col - i]);
    } else {
      upwrong = true;
    }
    if (arr[row + i] && arr[row + i][col + i] === value && !downWrong) {
      leftWin.push(arr[row + i][col + i]);
    } else {
      downWrong = true;
    }
  }
  return leftWin.length >= winNum - 1;
}

function checkRight({ value, arr, row, col, winNum }) {
  let rightWin = [];
  let upwrong = false;
  let downWrong = false;
  for (let i = 1; i < winNum; i++) {
    if (downWrong && upwrong) break;
    if (arr[row + i] && arr[row + i][col - i] === value && !upwrong) {
      rightWin.push(arr[row + i][col - i]);
    } else {
      upwrong = true;
    }
    if (arr[row - i] && arr[row - i][col + i] === value && !downWrong) {
      rightWin.push(arr[row - i][col + i]);
    } else {
      downWrong = true;
    }
  }
  return rightWin.length >= winNum - 1;
}

const chunk = (arr, size) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
};

export default App;
