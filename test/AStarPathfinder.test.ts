import { AStarPathfinder } from '../src/AI/Pathfinding/AStar/AStarPathfinder';
import { AstarGridGraph } from '../src/AI/Pathfinding/AStar/AstarGridGraph';
import { Vector2Utils } from '../src/Types/IVector2';

/**
 * A*路径查找算法测试套件
 *
 * 主要测试A*算法的节点回收机制，确保在路径重构过程中不会出现
 * 节点被过早回收导致的路径错误问题。
 */
describe('A*路径查找算法 - 节点回收机制测试', () => {
    let graph: AstarGridGraph;

    beforeEach(() => {
        // 创建一个5x5的测试网格
        graph = new AstarGridGraph(5, 5);
        // 清理对象池，确保每次测试都从干净状态开始
        AStarPathfinder.clearPool();
    });

    afterEach(() => {
        // 测试完成后清理对象池，避免测试间相互影响
        AStarPathfinder.clearPool();
    });

    /**
     * 测试节点回收时机修复
     *
     * 验证修复后的search方法不会在路径重构前过早回收openSet中的节点。
     * 这个测试确保可以正确地从目标节点回溯到起始节点，重构完整路径。
     */
    test('验证节点回收时机修复 - 路径重构应该成功', () => {
        const start = Vector2Utils.create(0, 0);
        const goal = Vector2Utils.create(3, 0);

        // 直接调用search方法获取搜索结果
        const result = AStarPathfinder.search(graph, start, goal);

        // 验证搜索成功
        expect(result.found).toBe(true);
        expect(result.goalNode).toBeDefined();

        if (result.goalNode) {
            // 手动重构路径，验证节点链的完整性
            let current: any = result.goalNode;
            const reconstructedPath: any[] = [];
            let safetyCounter = 0;

            // 沿着父节点链回溯，重构完整路径
            while (current && safetyCounter < 10) {
                // 验证节点没有被过早回收（node属性不应该为null）
                if (current.node === null) {
                    throw new Error(`第${safetyCounter}步的节点已被回收 (node为null)！这表明节点回收时机有问题。`);
                }

                reconstructedPath.unshift(current.node);
                current = current.parent;
                safetyCounter++;
            }

            // 验证重构的路径是正确的
            expect(reconstructedPath.length).toBeGreaterThan(0);
            expect(reconstructedPath[0]).toEqual(start);
            expect(reconstructedPath[reconstructedPath.length - 1]).toEqual(goal);

            // 测试完成后手动回收所有节点
            if (result.openSetNodes) {
                for (const node of result.openSetNodes) {
                    AStarPathfinder['_recycleNode'](node);
                }
            }
        }
    });

    /**
     * 测试searchPath方法的完整性
     *
     * 验证searchPath方法能够正确处理复杂场景，包括障碍物绕行、
     * 路径连续性检查和节点回收管理。这个测试确保修复后的算法
     * 在实际使用场景中能够稳定工作。
     */
    test('searchPath方法应该正确处理复杂路径规划', () => {
        // 设置起点和终点，创建一个需要绕行的复杂场景
        const start = Vector2Utils.create(0, 0);
        const goal = Vector2Utils.create(4, 4);

        // 添加障碍物，强制算法进行绕行规划
        graph.addWalls([
            Vector2Utils.create(1, 1),  // 阻挡直线路径
            Vector2Utils.create(2, 1),
            Vector2Utils.create(3, 1),
            Vector2Utils.create(1, 2),  // 形成L型障碍
            Vector2Utils.create(1, 3)
        ]);

        // 记录搜索前的对象池状态
        const poolStatsBeforeSearch = AStarPathfinder.getPoolStats();
        expect(poolStatsBeforeSearch.poolSize).toBe(0);

        // 执行路径搜索
        const path = graph.searchPath(start, goal);

        // 验证找到了有效路径
        expect(path.length).toBeGreaterThan(0);
        if (path.length > 0) {
            expect(path[0]).toEqual(start);
            expect(path[path.length - 1]).toEqual(goal);
        }

        // 验证路径的连续性 - 相邻步骤之间应该是相邻的格子
        for (let i = 1; i < path.length; i++) {
            const prev = path[i - 1];
            const curr = path[i];
            const distance = Vector2Utils.manhattanDistance(prev, curr);
            expect(distance).toBe(1); // 相邻节点的曼哈顿距离应该为1
        }

        // 验证路径上的所有点都是合法且可通行的
        for (const point of path) {
            expect(graph.isNodeInBounds(point)).toBe(true);
            expect(graph.isNodePassable(point)).toBe(true);
        }

        // 验证对象池的状态正常
        const poolStatsAfterSearch = AStarPathfinder.getPoolStats();
        expect(poolStatsAfterSearch.poolSize).toBeGreaterThanOrEqual(0);
        expect(poolStatsAfterSearch.poolSize).toBeLessThanOrEqual(poolStatsAfterSearch.maxPoolSize);
    });

    /**
     * 测试search方法返回的目标节点完整性
     *
     * 验证直接调用search方法后，返回的goalNode及其父节点链
     * 保持完整，可以用于路径重构。这个测试确保低级API的可靠性。
     */
    test('search方法应该返回完整可用的目标节点', () => {
        const start = Vector2Utils.create(0, 0);
        const goal = Vector2Utils.create(2, 2);

        // 执行底层搜索
        const result = AStarPathfinder.search(graph, start, goal);

        // 验证搜索成功
        expect(result.found).toBe(true);
        expect(result.goalNode).toBeDefined();

        if (result.goalNode) {
            // 验证目标节点的基本属性完整
            expect(result.goalNode.node).toEqual(goal);
            expect(result.goalNode.parent).toBeDefined(); // 应该有父节点（除非起点等于终点）

            // 验证可以通过父节点链重构完整路径
            let current: any = result.goalNode;
            const pathNodes: any[] = [];
            let iterations = 0;
            const maxIterations = 100; // 防止无限循环的安全措施

            while (current && iterations < maxIterations) {
                pathNodes.push(current.node);
                current = current.parent;
                iterations++;
            }

            // 验证路径重构的正确性
            expect(iterations).toBeLessThan(maxIterations); // 确保没有无限循环
            expect(pathNodes.length).toBeGreaterThan(0);
            expect(pathNodes[0]).toEqual(goal); // 路径应该从目标开始（逆序构建）

            // 手动清理：回收搜索过程中创建的所有节点
            if (result.openSetNodes) {
                for (const node of result.openSetNodes) {
                    AStarPathfinder['_recycleNode'](node);
                }
            }
        }
    });

    /**
     * 测试复杂场景下的对象池稳定性
     *
     * 在大型网格和复杂障碍物环境下进行多次路径搜索，
     * 验证对象池的回收机制能够正确工作，不会出现内存泄漏
     * 或节点状态污染问题。
     */
    test('复杂场景下的对象池应该保持稳定', () => {
        // 创建更大的测试网格（10x10）
        const largeGraph = new AstarGridGraph(10, 10);

        // 构建复杂的障碍物布局，形成需要绕行的迷宫结构
        const walls: any[] = [];
        // 创建水平障碍墙
        for (let x = 2; x < 8; x++) {
            walls.push(Vector2Utils.create(x, 5));
        }
        // 创建垂直障碍墙
        for (let y = 1; y < 5; y++) {
            walls.push(Vector2Utils.create(5, y));
        }
        largeGraph.addWalls(walls);

        const start = Vector2Utils.create(0, 0);
        const goal = Vector2Utils.create(9, 9);

        // 执行多次搜索，测试对象池的稳定性和一致性
        for (let i = 0; i < 5; i++) {
            const path = largeGraph.searchPath(start, goal);

            // 验证每次都能找到有效路径
            expect(path.length).toBeGreaterThan(0);

            // 验证路径的起点和终点正确
            expect(path[0]).toEqual(start);
            expect(path[path.length - 1]).toEqual(goal);
        }

        // 验证对象池状态正常，没有内存泄漏
        const finalPoolStats = AStarPathfinder.getPoolStats();
        expect(finalPoolStats.poolSize).toBeLessThanOrEqual(finalPoolStats.maxPoolSize);
    });

    /**
     * 测试无路径场景下的节点回收
     */
    test('无路径场景下应该正确回收节点', () => {
        const start = Vector2Utils.create(0, 0);
        const goal = Vector2Utils.create(2, 2);

        // 用障碍物完全包围目标点
        graph.addWalls([
            Vector2Utils.create(1, 1), Vector2Utils.create(1, 2), Vector2Utils.create(1, 3),
            Vector2Utils.create(2, 1), Vector2Utils.create(2, 3),
            Vector2Utils.create(3, 1), Vector2Utils.create(3, 2), Vector2Utils.create(3, 3)
        ]);

        const poolStatsBefore = AStarPathfinder.getPoolStats();
        const path = graph.searchPath(start, goal);

        expect(path.length).toBe(0);

        const poolStatsAfter = AStarPathfinder.getPoolStats();
        expect(poolStatsAfter.poolSize).toBeGreaterThanOrEqual(poolStatsBefore.poolSize);
    });

    /**
     * 边界情况测试
     */
    test('起点等于终点时应该返回单点路径', () => {
        const point = Vector2Utils.create(2, 2);
        const path = graph.searchPath(point, point);

        expect(path.length).toBe(1);
        expect(path[0]).toEqual(point);
    });

    test('起点或终点超出边界时应该返回空路径', () => {
        const validPoint = Vector2Utils.create(2, 2);
        const invalidPoint = Vector2Utils.create(10, 10); // 超出5x5网格

        const path1 = graph.searchPath(validPoint, invalidPoint);
        const path2 = graph.searchPath(invalidPoint, validPoint);

        expect(path1.length).toBe(0);
        expect(path2.length).toBe(0);
    });

    test('起点或终点在障碍物上时应该返回空路径', () => {
        const wall = Vector2Utils.create(2, 2);
        const validPoint = Vector2Utils.create(0, 0);

        graph.addWall(wall);

        // 验证wall确实是障碍物
        expect(graph.isNodePassable(wall)).toBe(false);
        expect(graph.isNodePassable(validPoint)).toBe(true);

        const path1 = graph.searchPath(validPoint, wall);
        const path2 = graph.searchPath(wall, validPoint);

        expect(path1.length).toBe(0);
        expect(path2.length).toBe(0);
    });

    /**
     * hasPath方法测试
     */
    test('hasPath方法应该正确判断路径存在性', () => {
        const start = Vector2Utils.create(0, 0);
        const reachableGoal = Vector2Utils.create(4, 4);
        const unreachableGoal = Vector2Utils.create(2, 2);

        // 包围unreachableGoal
        graph.addWalls([
            Vector2Utils.create(1, 1), Vector2Utils.create(1, 2), Vector2Utils.create(1, 3),
            Vector2Utils.create(2, 1), Vector2Utils.create(2, 3),
            Vector2Utils.create(3, 1), Vector2Utils.create(3, 2), Vector2Utils.create(3, 3)
        ]);

        expect(AStarPathfinder.hasPath(graph, start, reachableGoal)).toBe(true);
        expect(AStarPathfinder.hasPath(graph, start, unreachableGoal)).toBe(false);
    });

    /**
     * 对象池管理测试
     */
    test('对象池应该正确限制大小', () => {
        // 清空对象池
        AStarPathfinder.clearPool();
        expect(AStarPathfinder.getPoolStats().poolSize).toBe(0);

        // 执行多次搜索
        for (let i = 0; i < 10; i++) {
            graph.searchPath(Vector2Utils.create(0, 0), Vector2Utils.create(4, 4));
        }

        const stats = AStarPathfinder.getPoolStats();
        expect(stats.poolSize).toBeLessThanOrEqual(stats.maxPoolSize);
    });

    /**
     * 路径质量测试
     */
    test('返回的路径应该是最短路径', () => {
        // 在空网格中，从(0,0)到(2,2)的最短路径长度应该是5
        const path = graph.searchPath(Vector2Utils.create(0, 0), Vector2Utils.create(2, 2));
        expect(path.length).toBe(5); // (0,0) -> (1,0) -> (2,0) -> (2,1) -> (2,2)
    });

    test('路径中的每一步都应该是相邻的', () => {
        const path = graph.searchPath(Vector2Utils.create(0, 0), Vector2Utils.create(3, 3));

        for (let i = 1; i < path.length; i++) {
            const prev = path[i - 1];
            const curr = path[i];
            const distance = Vector2Utils.manhattanDistance(prev, curr);
            expect(distance).toBe(1);
        }
    });

    /**
     * 大规模网格测试
     */
    test('大网格应该能正常工作', () => {
        const largeGraph = new AstarGridGraph(50, 50);
        const start = Vector2Utils.create(0, 0);
        const goal = Vector2Utils.create(49, 49);

        const path = largeGraph.searchPath(start, goal);

        expect(path.length).toBeGreaterThan(0);
        expect(path[0]).toEqual(start);
        expect(path[path.length - 1]).toEqual(goal);
    });

    /**
     * 性能测试
     */
    test('多次搜索应该保持稳定性能', () => {
        const start = Vector2Utils.create(0, 0);
        const goal = Vector2Utils.create(4, 4);

        const startTime = Date.now();

        // 执行100次搜索
        for (let i = 0; i < 100; i++) {
            const path = graph.searchPath(start, goal);
            expect(path.length).toBeGreaterThan(0);
        }

        const endTime = Date.now();
        const totalTime = endTime - startTime;

        // 100次搜索应该在合理时间内完成（比如1秒）
        expect(totalTime).toBeLessThan(1000);
    });
});