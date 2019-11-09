import React from 'react'
import logo from './logo.svg'
import './App.css'
import { range, replicate } from 'fp-ts/lib/Array'

enum CellState {
  Empty,
  Blocked,
}

interface BoardData {
  enemy: Enemy
  goal: Goal
  data: Array<Array<CellState>>
}

interface BoardDataWrapper {
  boardData: BoardData
}

interface Vector {
  x: number
  y: number
}
interface Goal {
  position: Vector
}
interface Enemy {
  position: Vector
}

interface CellProps extends BoardDataWrapper {
  cellX: number
  cellY: number
}

interface RowProps extends BoardDataWrapper {
  rowY: number
  len: number
}

interface BoardProps extends BoardDataWrapper {
  rows: number
  cols: number
}

const toCellId = (x: number, y: number) => `cell-${x}-${y}`
const toRowId = (y: number) => `row-${y}`
const getCellStyle = (boardData: BoardData, x: number, y: number) => {
  if (boardData.enemy.position.x === x && boardData.enemy.position.y === y)
    return 'EnemyCell'
  if (boardData.goal.position.x === x && boardData.goal.position.y === y)
    return 'GoalCell'
  else {
    switch (boardData.data[y][x]) {
      case CellState.Blocked:
        return 'WallCell'
      case CellState.Empty:
        return 'EmptyCell'
    }
  }
}

const createBoard = (x: number, y: number) =>
  range(0, y - 1).map((i) => replicate(x, CellState.Empty))

const Cell: React.FC<CellProps> = ({ cellX, cellY, boardData }) => (
  <button
    className={getCellStyle(boardData, cellX, cellY)}
    key={toCellId(cellX, cellY)}
  >
    {' '}
  </button>
)

const RowCells: React.FC<RowProps> = ({ rowY, len, boardData }) => (
  <div className="row" key={toRowId(rowY)}>
    {range(0, len - 1).map((i) => (
      <Cell cellX={i} cellY={rowY} boardData={boardData} />
    ))}
  </div>
)

const Board: React.FC<BoardProps> = ({ rows, cols, boardData }) => (
  <div className="board">
    {range(0, rows - 1).map((i) => (
      <RowCells rowY={i} len={cols} boardData={boardData} />
    ))}
  </div>
)

const pickWalls = (board: Array<Array<CellState>>, wallProbability: number) =>
  board.map((row) =>
    row.map(
      (cell) =>
        Math.random() <= wallProbability ? CellState.Blocked : CellState.Empty,
    ),
  )

const App: React.FC = () => {
  const cols = 10
  const rows = 10
  const wallProbability = 0.3

  return (
    <div className="App">
      <Board
        rows={rows}
        cols={cols}
        boardData={{
          enemy: {
            position: { y: 0, x: Math.floor(Math.random() * cols) },
          },
          goal: {
            position: { y: rows - 1, x: Math.floor(Math.random() * cols) },
          },
          data: pickWalls(createBoard(rows, cols), wallProbability),
        }}
      />
    </div>
  )
}

export default App
