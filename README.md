# 寻路算法库

[![CI](https://img.shields.io/badge/CI-passing-brightgreen)](https://github.com/esengine/ecs-astar/actions)
[![npm版本](https://img.shields.io/npm/v/@esengine/pathfinding.svg)](https://www.npmjs.com/package/@esengine/pathfinding)
[![测试覆盖率](https://img.shields.io/badge/coverage-82.98%25-green)](https://github.com/esengine/ecs-astar)
[![许可证](https://img.shields.io/npm/l/@esengine/pathfinding.svg)](https://github.com/esengine/ecs-astar/blob/main/LICENSE)

适用于Cocos Creator和Laya引擎的寻路算法库，支持A*和广度优先搜索算法。

## ✨ 特性

- **多算法支持**：A*、广度优先搜索
- **引擎兼容**：支持Cocos Creator和Laya引擎
- **TypeScript**：完整的类型定义
- **高性能**：对象池优化，减少GC压力

## 安装

```bash
npm install @esengine/pathfinding
```

## 算法选择

### A*算法
- **适用场景**：大部分游戏寻路需求
- **特点**：支持权重地形，路径质量好
- **推荐用于**：RPG、策略游戏、塔防游戏

### 广度优先搜索
- **适用场景**：简单网格寻路
- **特点**：保证最短路径（步数最少）
- **推荐用于**：迷宫游戏、推箱子游戏

## 快速开始

### 基本使用

```typescript
import { AstarGridGraph, Vector2Utils } from '@esengine/pathfinding';

// 创建20x20的网格
const graph = new AstarGridGraph(20, 20);

// 添加障碍物
graph.addWall(Vector2Utils.create(10, 10));
graph.addWall(Vector2Utils.create(10, 11));

// 添加难走地形（权重节点）
graph.addWeightedNode(Vector2Utils.create(5, 5));

// 搜索路径
const start = Vector2Utils.create(0, 0);
const goal = Vector2Utils.create(19, 19);
const path = graph.searchPath(start, goal);

console.log('路径:', path);
```

### 广度优先搜索

```typescript
import { UnweightedGridGraph } from '@esengine/pathfinding';

// 创建网格，支持对角线移动
const graph = new UnweightedGridGraph(10, 10, true);

// 添加障碍物
graph.walls.push({ x: 5, y: 5 });

// 搜索路径
const path = graph.searchPath({ x: 0, y: 0 }, { x: 9, y: 9 });
```

### 按需加载

```typescript
// 只使用A*算法
import { AstarGridGraph } from '@esengine/pathfinding/modules/astar';

// 只使用广度优先算法
import { UnweightedGridGraph } from '@esengine/pathfinding/modules/breadth-first';
```

## 在游戏引擎中使用

### Cocos Creator

```typescript
import { AstarGridGraph } from '@esengine/pathfinding';

export default class PathfindingComponent extends cc.Component {
    private graph: AstarGridGraph;
    
    onLoad() {
        this.graph = new AstarGridGraph(50, 50);
        this.setupObstacles();
    }
    
    findPath(start: cc.Vec2, goal: cc.Vec2): cc.Vec2[] {
        return this.graph.searchPath(start, goal) as cc.Vec2[];
    }
    
    private setupObstacles() {
        // 添加地图障碍物
        for (let x = 10; x < 15; x++) {
            this.graph.addWall(cc.v2(x, 10));
        }
    }
}
```

### Laya引擎

```typescript
import { AstarGridGraph } from '@esengine/pathfinding';

export class PathfindingManager {
    private graph: AstarGridGraph;
    
    constructor(mapWidth: number, mapHeight: number) {
        this.graph = new AstarGridGraph(mapWidth, mapHeight);
    }
    
    findPath(start: Laya.Vector2, goal: Laya.Vector2): Laya.Vector2[] {
        return this.graph.searchPath(start, goal) as Laya.Vector2[];
    }
    
    addObstacle(pos: Laya.Vector2) {
        this.graph.addWall(pos);
    }
}
```

## API文档

### AstarGridGraph

A*算法网格图实现。

```typescript
const graph = new AstarGridGraph(width: number, height: number);

// 属性
graph.walls: IVector2[]              // 障碍物数组
graph.weightedNodes: IVector2[]      // 加权节点数组
graph.defaultWeight: number          // 默认移动成本（默认1）
graph.weightedNodeWeight: number     // 加权节点成本（默认5）

// 方法
graph.searchPath(start, goal): IVector2[]  // 搜索完整路径
graph.search(start, goal): boolean         // 检查是否存在路径
graph.addWall(wall): void                  // 添加单个障碍物
graph.addWalls(walls): void                // 批量添加障碍物
graph.clearWalls(): void                   // 清空障碍物
graph.addWeightedNode(node): void          // 添加加权节点
graph.clearWeightedNodes(): void           // 清空加权节点
```

### UnweightedGridGraph

广度优先搜索网格图实现。

```typescript
const graph = new UnweightedGridGraph(
    width: number, 
    height: number, 
    allowDiagonal?: boolean  // 是否允许对角线移动
);

// 属性
graph.walls: IVector2[]  // 障碍物数组

// 方法
graph.searchPath(start, goal): IVector2[]  // 搜索完整路径
graph.hasPath(start, goal): boolean        // 检查是否存在路径
```

### Vector2Utils

向量操作工具类。

```typescript
Vector2Utils.create(x, y)                    // 创建向量
Vector2Utils.equals(a, b)                    // 判断相等
Vector2Utils.add(a, b)                       // 向量加法
Vector2Utils.manhattanDistance(a, b)         // 曼哈顿距离
Vector2Utils.distance(a, b)                  // 欧几里得距离
```

## 游戏场景示例

### 塔防游戏

```typescript
// 敌人寻路到基地
const graph = new AstarGridGraph(mapWidth, mapHeight);
towers.forEach(tower => graph.addWall(tower.position));
const path = graph.searchPath(spawnPoint, basePosition);
```

### RPG游戏

```typescript
// 角色移动寻路，设置不同地形权重
const graph = new AstarGridGraph(mapWidth, mapHeight);
swampTiles.forEach(tile => graph.addWeightedNode(tile));
graph.weightedNodeWeight = 3; // 沼泽地移动慢
const path = graph.searchPath(playerPos, targetPos);
```

### 迷宫游戏

```typescript
// 简单迷宫寻路
const graph = new UnweightedGridGraph(mazeWidth, mazeHeight);
walls.forEach(wall => graph.walls.push(wall));
const path = graph.searchPath(startPos, exitPos);
```

## 文件结构

```
bin/
├── pathfinding.js          # 完整版本
├── pathfinding.min.js      # 完整版本（压缩）
├── pathfinding.d.ts        # TypeScript类型定义
└── modules/                # 分模块版本
    ├── astar.js           # A*算法模块
    ├── astar.min.js       # A*算法模块（压缩）
    ├── breadth-first.js   # 广度优先模块
    └── breadth-first.min.js # 广度优先模块（压缩）
```

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 清理构建目录
gulp clean
```

## 许可证

MIT License
