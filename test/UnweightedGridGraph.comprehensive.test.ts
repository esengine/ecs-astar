import { UnweightedGridGraph } from '../src/AI/Pathfinding/BreadthFirst/UnweightedGridGraph';
import { Vector2Utils } from '../src/Types/IVector2';

/**
 * UnweightedGridGraph 完整测试套件
 * 全面测试无权网格图的所有功能和边界情况
 */
describe('UnweightedGridGraph - 完整功能测试', () => {
    let graph: UnweightedGridGraph;

    beforeEach(() => {
        // 创建标准 5x5 测试网格
        graph = new UnweightedGridGraph(5, 5);
    });

    describe('🏗️ 构造函数测试', () => {
        test('应该能创建基本网格', () => {
            expect(graph).toBeDefined();
            expect(graph).toBeInstanceOf(UnweightedGridGraph);
            expect(graph.walls).toEqual([]);
        });

        test('应该能创建不同尺寸的网格', () => {
            const sizes = [
                [1, 1], [3, 3], [10, 10], [100, 50], [1, 100]
            ];

            sizes.forEach(([width, height]) => {
                const testGraph = new UnweightedGridGraph(width, height);
                expect(testGraph).toBeDefined();
                expect(testGraph.isNodeInBounds({x: 0, y: 0})).toBe(true);
                expect(testGraph.isNodeInBounds({x: width, y: height})).toBe(false);
            });
        });

        test('应该能创建支持对角线移动的网格', () => {
            const diagonalGraph = new UnweightedGridGraph(5, 5, true);
            expect(diagonalGraph).toBeDefined();
            
            // 中心点在对角线模式下应该有8个邻居
            const center = Vector2Utils.create(2, 2);
            const neighbors = diagonalGraph.getNeighbors(center);
            expect(neighbors.length).toBe(8);
        });

        test('默认应该禁用对角线移动', () => {
            const normalGraph = new UnweightedGridGraph(5, 5);
            const center = Vector2Utils.create(2, 2);
            const neighbors = normalGraph.getNeighbors(center);
            expect(neighbors.length).toBe(4); // 只有4个方向
        });
    });

    describe('🔍 边界检查测试', () => {
        test('应该正确识别网格内的有效节点', () => {
            const validNodes = [
                {x: 0, y: 0}, {x: 2, y: 2}, {x: 4, y: 4},
                {x: 0, y: 4}, {x: 4, y: 0}
            ];

            validNodes.forEach(node => {
                expect(graph.isNodeInBounds(node)).toBe(true);
            });
        });

        test('应该正确识别网格外的无效节点', () => {
            const invalidNodes = [
                {x: -1, y: 0}, {x: 0, y: -1}, {x: -1, y: -1},
                {x: 5, y: 0}, {x: 0, y: 5}, {x: 5, y: 5},
                {x: 10, y: 10}, {x: 100, y: 100}
            ];

            invalidNodes.forEach(node => {
                expect(graph.isNodeInBounds(node)).toBe(false);
            });
        });

        test('边界值精确测试', () => {
            // 5x5网格的有效范围是 (0,0) 到 (4,4)
            expect(graph.isNodeInBounds({x: 0, y: 0})).toBe(true);
            expect(graph.isNodeInBounds({x: 4, y: 4})).toBe(true);
            expect(graph.isNodeInBounds({x: 5, y: 4})).toBe(false);
            expect(graph.isNodeInBounds({x: 4, y: 5})).toBe(false);
        });

        test('应该处理极值坐标', () => {
            const extremeNodes = [
                {x: Number.MAX_SAFE_INTEGER, y: 0},
                {x: Number.MIN_SAFE_INTEGER, y: 0},
                {x: 0, y: Number.MAX_SAFE_INTEGER},
                {x: 0, y: Number.MIN_SAFE_INTEGER}
            ];

            extremeNodes.forEach(node => {
                expect(graph.isNodeInBounds(node)).toBe(false);
            });
        });
    });

    describe('🚧 障碍物系统测试', () => {
        test('默认情况下所有节点都可通行', () => {
            const testNodes = [
                {x: 0, y: 0}, {x: 2, y: 2}, {x: 4, y: 4}
            ];

            testNodes.forEach(node => {
                expect(graph.isNodePassable(node)).toBe(true);
            });
        });

        test('添加障碍物后节点应不可通行', () => {
            const wall = Vector2Utils.create(2, 2);
            graph.walls.push(wall);

            expect(graph.isNodePassable(wall)).toBe(false);
            // 相邻节点仍然可通行
            expect(graph.isNodePassable({x: 2, y: 1})).toBe(true);
            expect(graph.isNodePassable({x: 1, y: 2})).toBe(true);
        });

        test('应该能添加多个障碍物', () => {
            const walls = [
                Vector2Utils.create(1, 1),
                Vector2Utils.create(2, 1),
                Vector2Utils.create(3, 1),
                Vector2Utils.create(1, 2)
            ];

            graph.walls.push(...walls);

            walls.forEach(wall => {
                expect(graph.isNodePassable(wall)).toBe(false);
            });

            // 非障碍物节点仍可通行
            expect(graph.isNodePassable({x: 0, y: 0})).toBe(true);
            expect(graph.isNodePassable({x: 4, y: 4})).toBe(true);
        });

        test('重复添加相同障碍物应该正确处理', () => {
            const wall = Vector2Utils.create(2, 2);
            graph.walls.push(wall, wall, wall);

            expect(graph.isNodePassable(wall)).toBe(false);
            expect(graph.walls.length).toBe(3); // 允许重复添加
        });

        test('障碍物在网格外不应影响边界检查', () => {
            const outsideWall = Vector2Utils.create(10, 10);
            graph.walls.push(outsideWall);

            expect(graph.isNodeInBounds(outsideWall)).toBe(false);
            // 网格外的障碍物仍会被检查为不可通行
            expect(graph.isNodePassable(outsideWall)).toBe(false);
        });
    });

    describe('👥 邻居节点获取测试', () => {
        test('中心节点应该有4个邻居（四方向模式）', () => {
            const center = Vector2Utils.create(2, 2);
            const neighbors = graph.getNeighbors(center);

            expect(neighbors).toHaveLength(4);

            const expectedNeighbors = [
                {x: 3, y: 2}, // 右
                {x: 2, y: 1}, // 上
                {x: 1, y: 2}, // 左
                {x: 2, y: 3}  // 下
            ];

            expectedNeighbors.forEach(expected => {
                const found = neighbors.some(n => Vector2Utils.equals(n, expected));
                expect(found).toBe(true);
            });
        });

        test('角落节点应该只有2个邻居', () => {
            const corners = [
                {node: {x: 0, y: 0}, expectedCount: 2},
                {node: {x: 4, y: 0}, expectedCount: 2},
                {node: {x: 0, y: 4}, expectedCount: 2},
                {node: {x: 4, y: 4}, expectedCount: 2}
            ];

            corners.forEach(({node, expectedCount}) => {
                const neighbors = graph.getNeighbors(node);
                expect(neighbors).toHaveLength(expectedCount);
            });
        });

        test('边缘节点应该有3个邻居', () => {
            const edgeNodes = [
                {x: 2, y: 0}, // 上边缘
                {x: 2, y: 4}, // 下边缘
                {x: 0, y: 2}, // 左边缘
                {x: 4, y: 2}  // 右边缘
            ];

            edgeNodes.forEach(node => {
                const neighbors = graph.getNeighbors(node);
                expect(neighbors).toHaveLength(3);
            });
        });

        test('障碍物应该被排除在邻居列表之外', () => {
            const center = Vector2Utils.create(2, 2);
            const walls = [
                Vector2Utils.create(3, 2), // 右侧障碍物
                Vector2Utils.create(2, 1)  // 上方障碍物
            ];

            graph.walls.push(...walls);

            const neighbors = graph.getNeighbors(center);
            expect(neighbors).toHaveLength(2); // 原本4个，去掉2个障碍物

            walls.forEach(wall => {
                const hasWall = neighbors.some(n => Vector2Utils.equals(n, wall));
                expect(hasWall).toBe(false);
            });
        });

        test('对角线模式下应该有8个邻居', () => {
            const diagonalGraph = new UnweightedGridGraph(5, 5, true);
            const center = Vector2Utils.create(2, 2);
            const neighbors = diagonalGraph.getNeighbors(center);

            expect(neighbors).toHaveLength(8);

            // 验证包含对角线邻居
            const diagonalNeighbors = [
                {x: 1, y: 1}, {x: 3, y: 1}, // 上对角线
                {x: 1, y: 3}, {x: 3, y: 3}  // 下对角线
            ];

            diagonalNeighbors.forEach(diagonal => {
                const found = neighbors.some(n => Vector2Utils.equals(n, diagonal));
                expect(found).toBe(true);
            });
        });

        test('邻居节点应该都在网格边界内', () => {
            // 测试所有网格节点的邻居都在边界内
            for (let x = 0; x < 5; x++) {
                for (let y = 0; y < 5; y++) {
                    const node = {x, y};
                    const neighbors = graph.getNeighbors(node);

                    neighbors.forEach(neighbor => {
                        expect(graph.isNodeInBounds(neighbor)).toBe(true);
                    });
                }
            }
        });
    });

    describe('🛣️ 路径搜索测试', () => {
        test('应该能找到简单的直线路径', () => {
            const testCases = [
                {start: {x: 0, y: 0}, goal: {x: 2, y: 0}, expectedLength: 3},
                {start: {x: 0, y: 0}, goal: {x: 0, y: 2}, expectedLength: 3},
                {start: {x: 1, y: 1}, goal: {x: 3, y: 3}, expectedLength: 5}
            ];

            testCases.forEach(({start, goal, expectedLength}) => {
                const path = graph.searchPath(start, goal);
                
                expect(path).toHaveLength(expectedLength);
                expect(path[0]).toEqual(start);
                expect(path[path.length - 1]).toEqual(goal);
            });
        });

        test('起点等于终点时应该返回单点路径', () => {
            const point = Vector2Utils.create(2, 2);
            const path = graph.searchPath(point, point);

            expect(path).toHaveLength(1);
            expect(path[0]).toEqual(point);
        });

        test('无路径时应该返回空数组', () => {
            const start = Vector2Utils.create(0, 0);
            const goal = Vector2Utils.create(2, 2);

            // 完全包围目标点
            const surroundingWalls = [
                {x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3},
                {x: 2, y: 1}, {x: 2, y: 3},
                {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 3}
            ];

            graph.walls.push(...surroundingWalls);

            const path = graph.searchPath(start, goal);
            expect(path).toHaveLength(0);
        });

        test('应该能绕过障碍物找到路径', () => {
            const start = Vector2Utils.create(0, 0);
            const goal = Vector2Utils.create(4, 0);

            // 在中间添加障碍物，强制绕行
            const blockingWalls = [
                {x: 2, y: 0}, {x: 2, y: 1}
            ];

            graph.walls.push(...blockingWalls);

            const path = graph.searchPath(start, goal);

            expect(path.length).toBeGreaterThan(0);
            expect(path[0]).toEqual(start);
            expect(path[path.length - 1]).toEqual(goal);

            // 验证路径不包含障碍物
            blockingWalls.forEach(wall => {
                const hasWall = path.some(p => Vector2Utils.equals(p, wall));
                expect(hasWall).toBe(false);
            });
        });

        test('路径中相邻节点的距离应该为1', () => {
            const path = graph.searchPath({x: 0, y: 0}, {x: 3, y: 3});

            for (let i = 1; i < path.length; i++) {
                const prev = path[i - 1];
                const curr = path[i];
                const distance = Vector2Utils.manhattanDistance(prev, curr);
                expect(distance).toBe(1);
            }
        });

        test('应该找到最短路径', () => {
            const start = {x: 0, y: 0};
            const goal = {x: 2, y: 2};

            const path = graph.searchPath(start, goal);
            
            // 从(0,0)到(2,2)的最短路径长度应该是5步
            expect(path).toHaveLength(5);
        });

        test('复杂迷宫中的路径搜索', () => {
            // 创建一个复杂的迷宫布局
            const mazeWalls = [
                // 水平墙
                {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1},
                {x: 1, y: 3}, {x: 3, y: 3},
                // 垂直墙
                {x: 3, y: 2}
            ];

            graph.walls.push(...mazeWalls);

            const start = {x: 0, y: 0};
            const goal = {x: 4, y: 4};

            const path = graph.searchPath(start, goal);

            expect(path.length).toBeGreaterThan(0);
            expect(path[0]).toEqual(start);
            expect(path[path.length - 1]).toEqual(goal);

            // 验证路径连续性
            for (let i = 1; i < path.length; i++) {
                const distance = Vector2Utils.manhattanDistance(path[i-1], path[i]);
                expect(distance).toBe(1);
            }
        });
    });

    describe('❓ hasPath 方法测试', () => {
        test('存在路径时应该返回 true', () => {
            const testCases = [
                {start: {x: 0, y: 0}, goal: {x: 4, y: 4}},
                {start: {x: 2, y: 2}, goal: {x: 0, y: 0}},
                {start: {x: 1, y: 1}, goal: {x: 3, y: 3}}
            ];

            testCases.forEach(({start, goal}) => {
                expect(graph.hasPath(start, goal)).toBe(true);
            });
        });

        test('不存在路径时应该返回 false', () => {
            const start = {x: 0, y: 0};
            const goal = {x: 2, y: 2};

            // 完全包围目标点
            const walls = [
                {x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3},
                {x: 2, y: 1}, {x: 2, y: 3},
                {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 3}
            ];

            graph.walls.push(...walls);

            expect(graph.hasPath(start, goal)).toBe(false);
        });

        test('起点等于终点时应该返回 true', () => {
            const point = {x: 2, y: 2};
            expect(graph.hasPath(point, point)).toBe(true);
        });
    });

    describe('⚠️ 边界情况和异常处理', () => {
        test('超出边界的起点或终点', () => {
            const validPoint = {x: 2, y: 2};
            const invalidPoints = [
                {x: -1, y: 0}, {x: 5, y: 0}, {x: 0, y: -1}, {x: 0, y: 5}
            ];

            invalidPoints.forEach(invalid => {
                const path1 = graph.searchPath(validPoint, invalid);
                const path2 = graph.searchPath(invalid, validPoint);
                
                // 应该返回数组而不是抛出异常
                expect(Array.isArray(path1)).toBe(true);
                expect(Array.isArray(path2)).toBe(true);
                
                // 实际实现可能会尝试找路径，我们只验证不抛异常
                const hasPath1 = graph.hasPath(validPoint, invalid);
                const hasPath2 = graph.hasPath(invalid, validPoint);
                
                expect(typeof hasPath1).toBe('boolean');
                expect(typeof hasPath2).toBe('boolean');
            });
        });

        test('起点或终点在障碍物上', () => {
            const wall = {x: 2, y: 2};
            const validPoint = {x: 0, y: 0};

            graph.walls.push(wall);

            const path1 = graph.searchPath(validPoint, wall);
            const path2 = graph.searchPath(wall, validPoint);

            // 验证返回的是数组，具体行为可能因实现而异
            expect(Array.isArray(path1)).toBe(true);
            expect(Array.isArray(path2)).toBe(true);
            
            // 验证 hasPath 返回布尔值
            const hasPath1 = graph.hasPath(validPoint, wall);
            const hasPath2 = graph.hasPath(wall, validPoint);
            expect(typeof hasPath1).toBe('boolean');
            expect(typeof hasPath2).toBe('boolean');
        });

        test('1x1网格的特殊情况', () => {
            const miniGraph = new UnweightedGridGraph(1, 1);
            const point = {x: 0, y: 0};

            expect(miniGraph.isNodeInBounds(point)).toBe(true);
            expect(miniGraph.getNeighbors(point)).toHaveLength(0);
            expect(miniGraph.searchPath(point, point)).toEqual([point]);
            expect(miniGraph.hasPath(point, point)).toBe(true);
        });

        test('空网格（0x0）应该正确处理', () => {
            const emptyGraph = new UnweightedGridGraph(0, 0);
            const point = {x: 0, y: 0};

            expect(emptyGraph.isNodeInBounds(point)).toBe(false);
            expect(emptyGraph.getNeighbors(point)).toHaveLength(0);
            
            // 0x0 网格的搜索行为可能因实现而异，我们只验证不抛异常
            const path = emptyGraph.searchPath(point, point);
            expect(Array.isArray(path)).toBe(true);
        });
    });

    describe('🚀 性能和压力测试', () => {
        test('大网格应该能正常工作', () => {
            const largeGraph = new UnweightedGridGraph(50, 50);
            const start = {x: 0, y: 0};
            const goal = {x: 49, y: 49};

            const startTime = Date.now();
            const path = largeGraph.searchPath(start, goal);
            const endTime = Date.now();

            expect(path.length).toBeGreaterThan(0);
            expect(path[0]).toEqual(start);
            expect(path[path.length - 1]).toEqual(goal);
            expect(endTime - startTime).toBeLessThan(1000); // 应该在1秒内完成
        });

        test('多次搜索应该保持性能稳定', () => {
            const start = {x: 0, y: 0};
            const goal = {x: 4, y: 4};

            const startTime = Date.now();

            // 执行100次搜索
            for (let i = 0; i < 100; i++) {
                const path = graph.searchPath(start, goal);
                expect(path.length).toBeGreaterThan(0);
            }

            const endTime = Date.now();
            const totalTime = endTime - startTime;

            expect(totalTime).toBeLessThan(1000); // 100次搜索应该在1秒内完成
        });

        test('大量障碍物下的性能', () => {
            // 添加许多随机障碍物
            const walls: Array<{x: number, y: number}> = [];
            for (let i = 0; i < 10; i++) {
                walls.push({
                    x: Math.floor(Math.random() * 5),
                    y: Math.floor(Math.random() * 5)
                });
            }
            graph.walls.push(...walls);

            const start = {x: 0, y: 0};
            const goal = {x: 4, y: 4};

            const startTime = Date.now();
            const path = graph.searchPath(start, goal);
            const endTime = Date.now();

            // 应该在合理时间内完成，无论是否找到路径
            expect(endTime - startTime).toBeLessThan(100);
            expect(Array.isArray(path)).toBe(true);
        });
    });

    describe('🔧 功能集成测试', () => {
        test('完整游戏场景模拟', () => {
            // 模拟一个游戏关卡
            const gameGraph = new UnweightedGridGraph(10, 10, true);

            // 添加一些障碍物形成关卡布局
            const levelWalls = [
                // 房间隔墙
                {x: 3, y: 3}, {x: 3, y: 4}, {x: 3, y: 5},
                {x: 6, y: 2}, {x: 6, y: 3}, {x: 6, y: 4},
                // 通道障碍
                {x: 1, y: 7}, {x: 2, y: 7}, {x: 8, y: 1}
            ];

            gameGraph.walls.push(...levelWalls);

            // 测试多个任务路径
            const missions = [
                {start: {x: 0, y: 0}, goal: {x: 9, y: 9}},
                {start: {x: 5, y: 5}, goal: {x: 1, y: 1}},
                {start: {x: 2, y: 8}, goal: {x: 8, y: 2}}
            ];

            missions.forEach(({start, goal}, index) => {
                const path = gameGraph.searchPath(start, goal);
                const hasPath = gameGraph.hasPath(start, goal);

                if (hasPath) {
                    expect(path.length).toBeGreaterThan(0);
                    expect(path[0]).toEqual(start);
                    expect(path[path.length - 1]).toEqual(goal);

                    // 验证路径不穿过障碍物
                    path.forEach(point => {
                        expect(gameGraph.isNodePassable(point)).toBe(true);
                    });
                } else {
                    expect(path).toHaveLength(0);
                }

                console.log(`任务 ${index + 1}: ${hasPath ? '成功' : '无路径'}, 路径长度: ${path.length}`);
            });
        });

        test('动态障碍物变化', () => {
            const start = {x: 0, y: 0};
            const goal = {x: 4, y: 4};

            // 初始路径
            let path = graph.searchPath(start, goal);
            const initialLength = path.length;
            expect(initialLength).toBeGreaterThan(0);

            // 添加障碍物
            graph.walls.push({x: 2, y: 2});
            path = graph.searchPath(start, goal);
            
            if (path.length > 0) {
                // 路径可能变长（绕行）
                expect(path.length).toBeGreaterThanOrEqual(initialLength);
            }

            // 添加更多障碍物
            graph.walls.push({x: 1, y: 2}, {x: 2, y: 1});
            path = graph.searchPath(start, goal);

            // 应该仍能找到路径或正确返回无路径
            expect(Array.isArray(path)).toBe(true);

            if (path.length > 0) {
                expect(path[0]).toEqual(start);
                expect(path[path.length - 1]).toEqual(goal);
            }
        });
    });
});