import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

function App() {
  const [gridSize, setGridSize] = useState({ n: 4, m: 4 });
  const [colors, setColors] = useState(2);
  const [visibilityTime, setVisibilityTime] = useState(3);
  const [gameState, setGameState] = useState('setup');
  const [grid, setGrid] = useState([]);
  const [userGrid, setUserGrid] = useState([]);
  const [showColors, setShowColors] = useState(false);

  const generateGrid = useCallback((n, m, colorCount) => {
    const colorsList = ['white', ...Array(colorCount - 1).fill(0).map((_, i) => `hsl(${i * 50}, 100%, 50%)`)];
    return Array.from({ length: n * m }, () => colorsList[Math.floor(Math.random() * colorCount)]);
  }, []);

  const startGame = () => {
    const newGrid = generateGrid(gridSize.n, gridSize.m, colors);
    setGrid(newGrid);
    setUserGrid(Array(gridSize.n * gridSize.m).fill(false));
    setShowColors(true);
    setGameState('playing');
    setTimeout(() => {
      setShowColors(false);
      setGameState('guessing');
    }, visibilityTime * 1000);
  };

  const handleSubmit = () => {
    const correct = grid.filter((color, index) => color === 'white' && userGrid[index]);
    const missed = grid.filter((color, index) => color === 'white' && !userGrid[index]);
    const message = correct.length === grid.filter(color => color === 'white').length ? 
      "You won!" : `Correct: ${correct.length}, Missed: ${missed.length}`;
    alert(message);
    setGameState('setup');
  };

  const toggleCell = (index) => {
    if (gameState === 'guessing') {
      setUserGrid(prev => prev.map((val, idx) => idx === index ? !val : val));
    }
  };

  useEffect(() => {
    if (gameState === 'setup') {
      setGrid(generateGrid(gridSize.n, gridSize.m, colors));
    }
  }, [gameState, gridSize.n, gridSize.m, colors, generateGrid]);

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Memory Color Game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Slider 
              value={[gridSize.n]} 
              onValueChange={v => setGridSize({...gridSize, n: v[0], m: v[0]})} 
              max={7} min={1} step={1} label="Grid Size"
            />
            <Slider 
              value={[colors]} 
              onValueChange={v => setColors(v[0])} 
              max={7} min={1} step={1} label="Colors"
            />
            <Slider 
              value={[visibilityTime]} 
              onValueChange={v => setVisibilityTime(v[0])} 
              max={10} min={1} step={1} label="Visibility (seconds)"
            />
          </div>
        </CardContent>
        <CardFooter>
          {gameState === 'setup' && <Button onClick={startGame}>Start Game</Button>}
          {gameState === 'guessing' && <Button onClick={handleSubmit}>Submit</Button>}
        </CardFooter>
      </Card>

      <div className="grid grid-cols-7 gap-1 sm:grid-cols-4">
        {grid.map((color, index) => (
          <div 
            key={index} 
            className={`h-8 w-8 sm:h-12 sm:w-12 rounded ${showColors ? `bg-${color === 'white' ? 'white' : 'gray-500'}` : 'bg-gray-200'} border ${userGrid[index] ? 'border-2 border-blue-500' : ''}`}
            onClick={() => toggleCell(index)}
            style={{ backgroundColor: showColors ? color : undefined }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default App;