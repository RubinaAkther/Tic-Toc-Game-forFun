import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button
      onClick={onSquareClick}
      className="
      w-20 h-20 flex items-center justify-center
      text-3xl font-bold
      bg-gray-800 border border-gray-700
      hover:bg-gray-700
      transition duration-200
      rounded-lg
      shadow-md
      "
    >
      <span
        className={
          value === 'X' ? 'text-cyan-400' : value === 'O' ? 'text-pink-400' : ''
        }
      >
        {value}
      </span>
    </button>
  );
}

const Board = ({ xIsNext, squares, onPlay }) => {
  const winner = calculateWinner(squares);
  const isDraw = squares.every(Boolean) && !winner; // All squares filled, no winner
  let status;

  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = 'No one won. Try again!';
  } else {
    status = 'Next Player: ' + (xIsNext ? 'X' : 'O');
  }

  function handleClick(i) {
    if (squares[i] || winner || isDraw) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="text-center text-xl font-semibold mb-6 text-gray-200">
        {status}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {squares.map((sq, i) => (
          <Square key={i} value={sq} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
    </>
  );
};

export default function Game() {
  const [currentMove, setCurrentMove] = useState(0);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [xIsNext, setXIsNext] = useState(true);

  const currentSquares = history[currentMove];
  const winner = calculateWinner(currentSquares);
  const isDraw = currentSquares.every(Boolean) && !winner;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(move) {
    setCurrentMove(move);
    setXIsNext(move % 2 === 0);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setXIsNext(true);
  }

  const moves = history.map((squares, move) => {
    const isCurrent = move === currentMove;
    const player = move % 2 === 0 ? 'O' : 'X';

    return (
      <li key={move}>
        <button
          onClick={() => jumpTo(move)}
          className={`
          w-full text-left p-3 rounded-lg
          flex items-center justify-between
          transition
          ${isCurrent
            ? 'bg-gray-700 border border-gray-500'
            : 'bg-gray-800 hover:bg-gray-700'}
          `}
        >
          <span className="text-sm text-gray-200">
            {move === 0 ? 'Game Start' : `Move ${move}`}
          </span>

          {move !== 0 && (
            <span
              className={`font-bold ${
                player === 'X' ? 'text-cyan-400' : 'text-pink-400'
              }`}
            >
              {player}
            </span>
          )}
        </button>
      </li>
    );
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800 flex gap-10">
        <div>
          <h1 className="text-3xl font-bold mb-6 text-center">Tic Tac Toe</h1>

          {isDraw ? (
            <div className="text-center">
              <p className="text-xl mb-4 text-red-400 font-semibold">
                No one won. Try again!
              </p>
              <button
                onClick={resetGame}
                className="bg-cyan-500 hover:bg-cyan-400 px-4 py-2 rounded-lg font-bold"
              >
                Try Again
              </button>
            </div>
          ) : (
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          )}
        </div>

        <div className="w-48">
          <h2 className="mb-4 font-semibold text-gray-300 text-lg">
            Game Timeline
          </h2>

          <ol className="space-y-2 max-h-64 overflow-y-auto pr-1">{moves}</ol>
        </div>
      </div>
    </div>
  );
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