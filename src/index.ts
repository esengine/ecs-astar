/**
 * 寻路算法库
 */

// 导出类型定义
export { IVector2, IComparableVector2, Vector2Utils } from './Types/IVector2';

// 导出工具类
export { PriorityQueue, IPriorityQueueNode } from './Utils/PriorityQueue';

// 导出A*算法相关
export { IAstarGraph } from './AI/Pathfinding/AStar/IAstarGraph';
export { AStarPathfinder } from './AI/Pathfinding/AStar/AStarPathfinder';
export { AstarGridGraph } from './AI/Pathfinding/AStar/AstarGridGraph';

// 导出广度优先算法相关
export { IUnweightedGraph } from './AI/Pathfinding/BreadthFirst/IUnweightedGraph';
export { BreadthFirstPathfinder } from './AI/Pathfinding/BreadthFirst/BreadthFirstPathfinder';
export { UnweightedGraph } from './AI/Pathfinding/BreadthFirst/UnweightedGraph';
export { UnweightedGridGraph } from './AI/Pathfinding/BreadthFirst/UnweightedGridGraph';

// 使用示例和说明
/**
 * 使用示例：
 * 
 * // A*算法 - 适用于大部分游戏场景
 * const astarGraph = new AstarGridGraph(10, 10);
 * astarGraph.walls.push({ x: 5, y: 5 });
 * const astarPath = astarGraph.searchPath({ x: 0, y: 0 }, { x: 9, y: 9 });
 * 
 * // 广度优先算法 - 适用于简单网格，保证最短路径
 * const bfsGraph = new UnweightedGridGraph(10, 10);
 * bfsGraph.walls.push({ x: 5, y: 5 });
 * const bfsPath = bfsGraph.searchPath({ x: 0, y: 0 }, { x: 9, y: 9 });
 * 
 * // 自定义图结构
 * const customGraph = new UnweightedGraph<IVector2>();
 * customGraph.addEdgesForNode({ x: 0, y: 0 }, [{ x: 1, y: 0 }, { x: 0, y: 1 }]);
 * 
 * // 在Cocos Creator中使用
 * // const start = cc.v2(0, 0);
 * // const goal = cc.v2(9, 9);
 * // const path = astarGraph.searchPath(start, goal);
 * 
 * // 在Laya中使用
 * // const start = new Laya.Vector2(0, 0);
 * // const goal = new Laya.Vector2(9, 9);
 * // const path = astarGraph.searchPath(start, goal);
 */ 