// App.jsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

const GridCell = ({ index, color, onClick, isGuessPhase }) => {
  const [isMarked, setIsMarked] = useState(false);

  const handleClick = () => {
    if (isGuessPhase) {
      setIsMarked(!isMarked);
    }
  };

  return (
    <div 
      className={`w-8 h-8 sm:w-12 sm:h-12 border border-gray-300 m-1 flex items-center justify-center ${isMarked ? 'bg-blue-500' : color === 'white' && !isGuessPhase ? 'bg-white' : 'bg-gray-200'}`} 
      onClick={handleClick}
    >
      {isMarked && '✓'}
    </div>
  );
};

export default function App() {
  const [gridSize, setGridSize] = useState({ n: 4, m: 4 });
  const [colorsToShow, setColorsToShow] = useState(2);
  const [visibleTime, setVisibleTime] = useState(3);
  const [grid, setGrid] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGuessPhase, setIsGuessPhase] = useState(false);
  const [result, setResult] = useState({ correct: 0, missed: 0 });

  useEffect(() => {
    if (isPlaying) {
      generateGrid();
      const timer = setTimeout(() => {
        setIsGuessPhase(true);
      }, visibleTime * 1000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, visibleTime]);

  const generateGrid = () => {
    let newGrid = [];
    for (let i = 0; i < gridSize.n * gridSize.m; i++) {
      let color = Math.random() < 1 / colorsToShow ? 'white' : 'gray';
      newGrid.push(color);
    }
    setGrid(newGrid);
  };

  const handleSubmit = () => {
    let correct = 0, missed = 0;
    grid.forEach((color, index) => {
      if ((document.getElementById(`cell-${index}`).classList.contains('bg-blue-500') && color === 'white') || 
          (!document.getElementById(`cell-${index}`).classList.contains('bg-blue-500') && color !== 'white')) {
        correct++;
      } else if (color === 'white') {
        missed++;
      }
    });
    setResult({ correct, missed });
    setIsPlaying(false);
    setIsGuessPhase(false);
  };

  const startGame = () => {
    setIsPlaying(true);
    setResult({ correct: 0, missed: 0 });
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Card>
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-bold">Color Memory Game</h1>
          <Slider label="Grid Width" value={[gridSize.n]} onValueChange={(v) => setGridSize({...gridSize, n: v[0]})} max={7} min={1} />
          <Slider label="Grid Height" value={[gridSize.m]} onValueChange={(v) => setGridSize({...gridSize, m: v[0]})} max={7} min={1} />
          <Slider label="Colors" value={[colorsToShow]} onValueChange={setColorsToShow} max={7} min={2} />
          <Slider label="Visibility Time (s)" value={[visibleTime]} onValueChange={setVisibleTime} max={10} min={1} />
          {!isPlaying && <Button onClick={startGame}>Start Game</Button>}
          {isPlaying && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(32px,1fr))] gap-2">
              {grid.map((color, index) => (
                <GridCell key={index} index={index} color={color} isGuessPhase={isGuessPhase} />
              ))}
            </div>
          )}
          {isGuessPhase && <Button onClick={handleSubmit}>Submit</Button>}
          {result.correct + result.missed > 0 && (
            <div>
              {result.missed === 0 ? 
                <p className="text-green-500">You won! Perfect memory!</p> : 
                <p>Correct: {result.correct}, Missed: {result.missed}</p>
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}