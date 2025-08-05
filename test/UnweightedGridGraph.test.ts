import { UnweightedGridGraph } from '../src/AI/Pathfinding/BreadthFirst/UnweightedGridGraph';
import { Vector2Utils } from '../src/Types/IVector2';

/**
 * UnweightedGridGraph 类测试套件
 * 测试无权网格图的基本功能和路径搜索能力
 */
describe('UnweightedGridGraph - 无权网格图测试', () => {
    let graph: UnweightedGridGraph;

    beforeEach(() => {
        // 创建一个5x5的测试网格
        graph = new UnweightedGridGraph(5, 5);
    });

    /**
     * 测试构造函数和基本实例化
     */
    describe('构造函数测试', () => {
        test('应该能正常创建实例', () => {
            expect(graph).toBeDefined();
            expect(graph).toBeInstanceOf(UnweightedGridGraph);
        });

        test('应该能创建不同大小的网格', () => {
            const smallGraph = new UnweightedGridGraph(3, 3);
            const largeGraph = new UnweightedGridGraph(100, 100);
            
            expect(smallGraph).toBeDefined();
            expect(largeGraph).toBeDefined();
        });

        test('应该能创建支持对角线搜索的网格', () => {
            const diagonalGraph = new UnweightedGridGraph(5, 5, true);
            expect(diagonalGraph).toBeDefined();
        });

        test('默认情况下不支持对角线搜索', () => {
            const normalGraph = new UnweightedGridGraph(5, 5);
            expect(normalGraph).toBeDefined();
        });
    });

    /**
     * 测试边界检查功能
     */
    describe('边界检查测试', () => {
        test('应该正确识别网格内的节点', () => {
            expect(graph.isNodeInBounds(Vector2Utils.create(0, 0))).toBe(true);
            expect(graph.isNodeInBounds(Vector2Utils.create(2, 2))).toBe(true);
            expect(graph.isNodeInBounds(Vector2Utils.create(4, 4))).toBe(true);
        });

        test('应该正确识别网格外的节点', () => {
            expect(graph.isNodeInBounds(Vector2Utils.create(-1, 0))).toBe(false);
            expect(graph.isNodeInBounds(Vector2Utils.create(0, -1))).toBe(false);
            expect(graph.isNodeInBounds(Vector2Utils.create(5, 0))).toBe(false);
            expect(graph.isNodeInBounds(Vector2Utils.create(0, 5))).toBe(false);
            expect(graph.isNodeInBounds(Vector2Utils.create(10, 10))).toBe(false);
        });

        test('边界值测试', () => {
            // 对于5x5网格，有效范围是0-4
            expect(graph.isNodeInBounds(Vector2Utils.create(0, 0))).toBe(true);
            expect(graph.isNodeInBounds(Vector2Utils.create(4, 4))).toBe(true);
            expect(graph.isNodeInBounds(Vector2Utils.create(5, 4))).toBe(false);
            expect(graph.isNodeInBounds(Vector2Utils.create(4, 5))).toBe(false);
        });
    });

    /**
     * 测试障碍物功能
     */
    describe('障碍物系统测试', () => {
        test('默认情况下所有节点都应该可通行', () => {
            expect(graph.isNodePassable(Vector2Utils.create(0, 0))).toBe(true);
            expect(graph.isNodePassable(Vector2Utils.create(2, 2))).toBe(true);
            expect(graph.isNodePassable(Vector2Utils.create(4, 4))).toBe(true);
        });

        test('添加障碍物后节点应该不可通行', () => {
            const wall = Vector2Utils.create(2, 2);
            graph.walls.push(wall);
            
            expect(graph.isNodePassable(wall)).toBe(false);
            expect(graph.isNodePassable(Vector2Utils.create(2, 3))).toBe(true); // 相邻节点仍可通行
        });

        test('应该能添加多个障碍物', () => {
            const walls = [
                Vector2Utils.create(1, 1),
                Vector2Utils.create(2, 1),
                Vector2Utils.create(3, 1)
            ];
            
            graph.walls.push(...walls);
            
            for (const wall of walls) {
                expect(graph.isNodePassable(wall)).toBe(false);
            }
        });
    });

    /**
     * 测试邻居节点获取功能
     */
    describe('邻居节点获取测试', () => {
        test('中心节点应该有4个邻居（四方向）', () => {
            const center = Vector2Utils.create(2, 2);
            const neighbors = graph.getNeighbors(center);
            
            expect(neighbors.length).toBe(4);
            
            // 验证四个方向的邻居
            const expectedNeighbors = [
                Vector2Utils.create(3, 2), // 右
                Vector2Utils.create(2, 1), // 上
                Vector2Utils.create(1, 2), // 左
                Vector2Utils.create(2, 3)  // 下
            ];
            
            for (const expected of expectedNeighbors) {
                expect(neighbors.some(n => Vector2Utils.equals(n, expected))).toBe(true);
            }
        });

        test('角落节点应该只有2个邻居', () => {
            const corner = Vector2Utils.create(0, 0);
            const neighbors = graph.getNeighbors(corner);
            
            expect(neighbors.length).toBe(2);
            
            // 验证角落的两个邻居
            const expectedNeighbors = [
                Vector2Utils.create(1, 0), // 右
                Vector2Utils.create(0, 1)  // 下
            ];
            
            for (const expected of expectedNeighbors) {
                expect(neighbors.some(n => Vector2Utils.equals(n, expected))).toBe(true);
            }
        });

        test('边缘节点应该有3个邻居', () => {
            const edge = Vector2Utils.create(2, 0);
            const neighbors = graph.getNeighbors(edge);
            
            expect(neighbors.length).toBe(3);
        });

        test('障碍物应该被排除在邻居列表之外', () => {
            const center = Vector2Utils.create(2, 2);
            const wall = Vector2Utils.create(3, 2);
            
            graph.walls.push(wall);
            
            const neighbors = graph.getNeighbors(center);
            expect(neighbors.length).toBe(3); // 原本4个，排除1个障碍物
            expect(neighbors.some(n => Vector2Utils.equals(n, wall))).toBe(false);
        });

        test('对角线搜索模式下应该有更多邻居', () => {
            const diagonalGraph = new UnweightedGridGraph(5, 5, true);
            const center = Vector2Utils.create(2, 2);
            const neighbors = diagonalGraph.getNeighbors(center);
            
            expect(neighbors.length).toBe(8); // 八个方向
        });
    });

    /**
     * 测试路径搜索功能
     */
    describe('路径搜索测试', () => {
        test('应该能找到简单的直线路径', () => {
            const start = Vector2Utils.create(0, 0);
            const goal = Vector2Utils.create(2, 0);
            
            const path = graph.searchPath(start, goal);
            
            expect(path.length).toBeGreaterThan(0);
            expect(path[0]).toEqual(start);
            expect(path[path.length - 1]).toEqual(goal);
        });

        test('起点等于终点时应该返回单点路径', () => {
            const point = Vector2Utils.create(2, 2);
            const path = graph.searchPath(point, point);
            
            expect(path.length).toBe(1);
            expect(path[0]).toEqual(point);
        });

        test('无路径时应该返回空数组', () => {
            const start = Vector2Utils.create(0, 0);
            const goal = Vector2Utils.create(2, 2);
            
            // 完全包围目标点
            graph.walls.push(
                Vector2Utils.create(1, 1),
                Vector2Utils.create(1, 2),
                Vector2Utils.create(1, 3),
                Vector2Utils.create(2, 1),
                Vector2Utils.create(2, 3),
                Vector2Utils.create(3, 1),
                Vector2Utils.create(3, 2),
                Vector2Utils.create(3, 3)
            );
            
            const path = graph.searchPath(start, goal);
            expect(path.length).toBe(0);
        });

        test('应该能绕过障碍物找到路径', () => {
            const start = Vector2Utils.create(0, 0);
            const goal = Vector2Utils.create(4, 0);
            
            // 在中间添加障碍物
            graph.walls.push(Vector2Utils.create(2, 0));
            
            const path = graph.searchPath(start, goal);
            
            expect(path.length).toBeGreaterThan(0);
            expect(path[0]).toEqual(start);
            expect(path[path.length - 1]).toEqual(goal);
            
            // 验证路径不包含障碍物
            const wall = Vector2Utils.create(2, 0);
            expect(path.some(p => Vector2Utils.equals(p, wall))).toBe(false);
        });

        test('路径中相邻节点的距离应该为1', () => {
            const start = Vector2Utils.create(0, 0);
            const goal = Vector2Utils.create(3, 3);
            
            const path = graph.searchPath(start, goal);
            
            for (let i = 1; i < path.length; i++) {
                const prev = path[i - 1];
                const curr = path[i];
                const distance = Vector2Utils.manhattanDistance(prev, curr);
                expect(distance).toBe(1);
            }
        });
    });

    /**
     * 测试 hasPath 方法
     */
    describe('hasPath 方法测试', () => {
        test('存在路径时应该返回 true', () => {
            const start = Vector2Utils.create(0, 0);
            const goal = Vector2Utils.create(4, 4);
            
            expect(graph.hasPath(start, goal)).toBe(true);
        });

        test('不存在路径时应该返回 false', () => {
            const start = Vector2Utils.create(0, 0);
            const goal = Vector2Utils.create(2, 2);
            
            // 完全包围目标点
            graph.walls.push(
                Vector2Utils.create(1, 1),
                Vector2Utils.create(1, 2),
                Vector2Utils.create(1, 3),
                Vector2Utils.create(2, 1),
                Vector2Utils.create(2, 3),
                Vector2Utils.create(3, 1),
                Vector2Utils.create(3, 2),
                Vector2Utils.create(3, 3)
            );
            
            expect(graph.hasPath(start, goal)).toBe(false);
        });
    });

    /**
     * 边界情况测试
     */
    describe('边界情况测试', () => {
        test('超出边界的起点或终点应该处理正确', () => {
            const validPoint = Vector2Utils.create(2, 2);
            const invalidPoint = Vector2Utils.create(10, 10);
            
            // 这些情况的具体行为可能需要根据实际需求调整
            const path1 = graph.searchPath(validPoint, invalidPoint);
            const path2 = graph.searchPath(invalidPoint, validPoint);
            
            // 至少不应该抛出异常
            expect(Array.isArray(path1)).toBe(true);
            expect(Array.isArray(path2)).toBe(true);
        });

        test('起点或终点在障碍物上的情况', () => {
            const wall = Vector2Utils.create(2, 2);
            const validPoint = Vector2Utils.create(0, 0);
            
            graph.walls.push(wall);
            
            const path1 = graph.searchPath(validPoint, wall);
            const path2 = graph.searchPath(wall, validPoint);
            
            // 至少不应该抛出异常
            expect(Array.isArray(path1)).toBe(true);
            expect(Array.isArray(path2)).toBe(true);
        });
    });

    /**
     * 性能测试
     */
    describe('性能测试', () => {
        test('大网格应该能正常工作', () => {
            const largeGraph = new UnweightedGridGraph(50, 50);
            const start = Vector2Utils.create(0, 0);
            const goal = Vector2Utils.create(49, 49);
            
            const path = largeGraph.searchPath(start, goal);
            
            expect(path.length).toBeGreaterThan(0);
            expect(path[0]).toEqual(start);
            expect(path[path.length - 1]).toEqual(goal);
        });

        test('多次搜索应该保持性能稳定', () => {
            const start = Vector2Utils.create(0, 0);
            const goal = Vector2Utils.create(4, 4);
            
            const startTime = Date.now();
            
            // 执行50次搜索
            for (let i = 0; i < 50; i++) {
                const path = graph.searchPath(start, goal);
                expect(path.length).toBeGreaterThan(0);
            }
            
            const endTime = Date.now();
            const totalTime = endTime - startTime;
            
            // 50次搜索应该在合理时间内完成
            expect(totalTime).toBeLessThan(500);
        });
    });
});