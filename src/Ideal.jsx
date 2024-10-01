// App.jsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const GridCell = ({ index, color, onClick, isGuessPhase }) => {
  const [isMarked, setIsMarked] = useState(false);

  const handleClick = () => {
    if (isGuessPhase) {
      setIsMarked(!isMarked);
      onClick(index);
    }
  };

  return (
    <div
      className={`w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-md cursor-pointer transform transition-all duration-300 ${
        isGuessPhase
          ? isMarked
            ? 'bg-blue-500'
            : 'bg-gray-200 hover:bg-gray-300'
          : color
      }`}
      onClick={handleClick}
    ></div>
  );
};

export default function App() {
  const [gridSize, setGridSize] = useState({ n: 5, m: 5 });
  const [colorsToShow, setColorsToShow] = useState(2);
  const [visibleTime, setVisibleTime] = useState(5);
  const [grid, setGrid] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGuessPhase, setIsGuessPhase] = useState(false);
  const [markedCells, setMarkedCells] = useState([]);
  const [result, setResult] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      generateGrid();
      setCountdown(visibleTime);
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIsGuessPhase(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdownInterval);
    }
  }, [isPlaying]);

  const generateGrid = () => {
    let newGrid = [];
    const totalCells = gridSize.n * gridSize.m;
    const whiteCellsCount = Math.floor(totalCells / colorsToShow);
    const whiteCellsIndices = new Set();
    while (whiteCellsIndices.size < whiteCellsCount) {
      whiteCellsIndices.add(Math.floor(Math.random() * totalCells));
    }
    for (let i = 0; i < totalCells; i++) {
      if (whiteCellsIndices.has(i)) {
        newGrid.push('bg-white');
      } else {
        const colorOptions = [
          'bg-red-400',
          'bg-yellow-400',
          'bg-green-400',
          'bg-blue-400',
          'bg-purple-400',
          'bg-pink-400',
        ];
        newGrid.push(colorOptions[i % colorOptions.length]);
      }
    }
    setGrid(newGrid);
  };

  const handleCellClick = (index) => {
    if (markedCells.includes(index)) {
      setMarkedCells(markedCells.filter((i) => i !== index));
    } else {
      setMarkedCells([...markedCells, index]);
    }
  };

  const handleSubmit = () => {
    const totalWhiteCells = grid.reduce(
      (acc, color, index) => (color === 'bg-white' ? [...acc, index] : acc),
      []
    );
    const correct = markedCells.filter((index) => totalWhiteCells.includes(index)).length;
    const missed = totalWhiteCells.length - correct;
    setResult({ correct, missed });
    setIsPlaying(false);
    setIsGuessPhase(false);
  };

  const startGame = () => {
    setIsPlaying(true);
    setResult(null);
    setMarkedCells([]);
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-teal-400 to-green-500 flex flex-col items-center justify-center p-4">
      <style>
        {`
          @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.5); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
      <h1 className="text-4xl font-extrabold text-white mb-6">Color Memory Game</h1>
      {!isPlaying && !result && (
        <Button
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
          onClick={() => setShowSettings(true)}
        >
          Play
        </Button>
      )}
      {result && (
        <div className="text-center mt-4">
          {result.missed === 0 ? (
            <p className="text-white font-bold text-2xl">You won! Perfect memory!</p>
          ) : (
            <p className="text-white">
              Correct: {result.correct}, Missed: {result.missed}
            </p>
          )}
          <Button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
            onClick={() => setShowSettings(true)}
          >
            Play Again
          </Button>
        </div>
      )}
      {isPlaying && (
        <div className="p-4">
          {isPlaying && !isGuessPhase && (
            <div className="text-center text-white font-bold text-xl mb-4">
              Memorize the colors! Time left: {countdown}s
            </div>
          )}
          {isPlaying && (
            <div className="flex justify-center">
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${gridSize.n}, minmax(0, 1fr))`,
                }}
              >
                {grid.map((color, index) => (
                  <GridCell
                    key={index}
                    index={index}
                    color={color}
                    isGuessPhase={isGuessPhase}
                    onClick={handleCellClick}
                  />
                ))}
              </div>
            </div>
          )}
          {isGuessPhase && (
            <Button
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          )}
        </div>
      )}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent
          className="bg-gradient-to-br from-blue-500 via-teal-400 to-green-500 text-white rounded-lg shadow-lg"
        >
          <DialogTitle className="text-2xl font-bold mb-4">Game Settings</DialogTitle>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Grid Width: {gridSize.n}</Label>
              <Slider
                value={[gridSize.n]}
                onValueChange={(v) => setGridSize({ ...gridSize, n: v[0] })}
                max={7}
                min={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-white">Grid Height: {gridSize.m}</Label>
              <Slider
                value={[gridSize.m]}
                onValueChange={(v) => setGridSize({ ...gridSize, m: v[0] })}
                max={7}
                min={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-white">Number of Colors: {colorsToShow}</Label>
              <Slider
                value={[colorsToShow]}
                onValueChange={(v) => setColorsToShow(v[0])}
                max={7}
                min={2}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-white">Visibility Time (s): {visibleTime}</Label>
              <Slider
                value={[visibleTime]}
                onValueChange={(v) => setVisibleTime(v[0])}
                max={10}
                min={1}
                className="mt-2"
              />
            </div>
            <Button
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
              onClick={startGame}
            >
              Start Game
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
