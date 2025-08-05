import { IVector2, Vector2Utils } from '../../../Types/IVector2';
import { IAstarGraph } from './IAstarGraph';
import { PriorityQueue, IPriorityQueueNode } from '../../../Utils/PriorityQueue';

/**
 * A*算法节点类
 */
class AStarNode implements IPriorityQueueNode {
    public node: IVector2;
    public priority: number = 0;
    public gCost: number = 0;
    public hCost: number = 0;
    public parent: AStarNode | null = null;
    public hash: number = 0;

    constructor(node: IVector2, gCost: number = 0, hCost: number = 0, parent: AStarNode | null = null) {
        this.node = node;
        this.gCost = gCost;
        this.hCost = hCost;
        this.priority = gCost + hCost;
        this.parent = parent;
        this.hash = Vector2Utils.toHash(node);
    }

    updateCosts(gCost: number, hCost: number, parent: AStarNode | null = null): void {
        this.gCost = gCost;
        this.hCost = hCost;
        this.priority = gCost + hCost;
        this.parent = parent;
    }

    updateNode(node: IVector2, gCost: number = 0, hCost: number = 0, parent: AStarNode | null = null): void {
        this.node = node;
        this.gCost = gCost;
        this.hCost = hCost;
        this.priority = gCost + hCost;
        this.parent = parent;
        this.hash = Vector2Utils.toHash(node);
    }

    reset(): void {
        this.node = null as any;
        this.priority = 0;
        this.gCost = 0;
        this.hCost = 0;
        this.parent = null;
        this.hash = 0;
    }
}

/**
 * A*路径查找算法实现
 */
export class AStarPathfinder {
    private static _nodePool: AStarNode[] = [];
    private static _tempPath: IVector2[] = [];

    /**
     * 从对象池获取节点
     */
    private static _getNode(node: IVector2, gCost: number = 0, hCost: number = 0, parent: AStarNode | null = null): AStarNode {
        let astarNode = this._nodePool.pop();
        if (!astarNode) {
            astarNode = new AStarNode(node, gCost, hCost, parent);
        } else {
            astarNode.updateNode(node, gCost, hCost, parent);
        }
        return astarNode;
    }

    /**
     * 回收节点到对象池
     */
    private static _recycleNode(node: AStarNode): void {
        if (this._nodePool.length < 1000) {
            node.reset();
            this._nodePool.push(node);
        }
    }

    /**
     * 使用A*算法搜索路径
     * @param graph 图对象
     * @param start 起始节点
     * @param goal 目标节点
     * @returns 搜索结果，包含目标节点和需要回收的节点
     */
    static search<T extends IVector2>(
        graph: IAstarGraph<T>,
        start: T,
        goal: T
    ): { found: boolean; goalNode?: AStarNode; openSetNodes?: AStarNode[] } {
        const openSet = new PriorityQueue<AStarNode>();
        const closedSet = new Set<number>(); // 使用数值哈希
        const openSetMap = new Map<number, AStarNode>(); // 使用数值哈希

        const startHash = Vector2Utils.toHash(start);
        const goalHash = Vector2Utils.toHash(goal);

        if (startHash === goalHash) {
            return { found: true, goalNode: this._getNode(start, 0, 0) };
        }

        // 检查起点和终点是否可通行
        if (!graph.isNodePassable(start)) {
            return { found: false, openSetNodes: [] };
        }
        
        const startNode = this._getNode(start, 0, graph.heuristic(start, goal));
        openSet.enqueue(startNode);
        openSetMap.set(startHash, startNode);

        let goalNode: AStarNode | undefined;
        const processedNodes: AStarNode[] = []; // 收集已处理的节点，稍后统一回收

        while (!openSet.isEmpty) {
            const current = openSet.dequeue()!;
            const currentHash = current.hash;

            openSetMap.delete(currentHash);

            if (currentHash === goalHash) {
                goalNode = current;
                break;
            }

            closedSet.add(currentHash);
            for (const neighbor of graph.getNeighbors(current.node as T)) {
                const neighborHash = Vector2Utils.toHash(neighbor);

                if (closedSet.has(neighborHash)) {
                    continue;
                }

                const tentativeGScore = current.gCost + graph.cost(current.node as T, neighbor);
                const existingNode = openSetMap.get(neighborHash);
                
                if (existingNode) {
                    if (tentativeGScore < existingNode.gCost) {
                        const hCost = existingNode.hCost;
                        existingNode.updateCosts(tentativeGScore, hCost, current);
                    }
                } else {
                    const hCost = graph.heuristic(neighbor, goal);
                    const neighborNode = this._getNode(neighbor, tentativeGScore, hCost, current);
                    openSet.enqueue(neighborNode);
                    openSetMap.set(neighborHash, neighborNode);
                }
            }

            // 不要立即回收当前节点，因为它可能是路径上的父节点
            // 将其添加到已处理节点列表中，稍后统一处理
            processedNodes.push(current);
        }

        // 收集 openSet 中剩余的节点，但不立即回收
        // 这些节点可能是路径重构所需的父节点
        const remainingNodes: AStarNode[] = [];
        while (!openSet.isEmpty) {
            remainingNodes.push(openSet.dequeue()!);
        }

        // 合并已处理的节点和剩余的openSet节点
        const allNodesToRecycle = [...processedNodes, ...remainingNodes];

        return { found: !!goalNode, goalNode, openSetNodes: allNodesToRecycle };
    }

    /**
     * 搜索并返回完整路径
     * @param graph 图对象
     * @param start 起始节点
     * @param goal 目标节点
     * @returns 路径数组，如果没找到则返回空数组
     */
    static searchPath<T extends IVector2>(
        graph: IAstarGraph<T>,
        start: T,
        goal: T
    ): T[] {
        const result = this.search(graph, start, goal);

        if (!result.found || !result.goalNode) {
            // 如果没有找到路径，回收所有剩余节点
            if (result.openSetNodes) {
                for (const node of result.openSetNodes) {
                    this._recycleNode(node);
                }
            }
            return [];
        }

        // 重构路径
        const path = this.reconstructPathFromNode(result.goalNode) as T[];

        // 路径重构完成后，回收所有节点（包括路径上的节点）
        if (result.openSetNodes) {
            for (const node of result.openSetNodes) {
                this._recycleNode(node);
            }
        }

        return path;
    }

    /**
     * 从目标节点重构路径
     */
    private static reconstructPathFromNode<T extends IVector2>(
        goalNode: AStarNode
    ): T[] {
        this._tempPath.length = 0;
        
        let current: AStarNode | null = goalNode;

        while (current) {
            this._tempPath.unshift(current.node as T);
            current = current.parent;
        }
        return [...this._tempPath] as T[];
    }

    /**
     * 检查路径是否存在
     * @param graph 图对象
     * @param start 起始节点
     * @param goal 目标节点
     * @returns 是否存在路径
     */
    static hasPath<T extends IVector2>(
        graph: IAstarGraph<T>,
        start: T,
        goal: T
    ): boolean {
        const result = this.search(graph, start, goal);

        // 回收目标节点（如果存在）
        if (result.goalNode) {
            this._recycleNode(result.goalNode);
        }

        // 回收openSet中剩余的节点
        if (result.openSetNodes) {
            for (const node of result.openSetNodes) {
                if (node !== result.goalNode) {
                    this._recycleNode(node);
                }
            }
        }

        return result.found;
    }

    /**
     * 清理对象池
     */
    static clearPool(): void {
        this._nodePool.length = 0;
        this._tempPath.length = 0;
    }

    /**
     * 获取对象池统计信息
     */
    static getPoolStats(): { poolSize: number; maxPoolSize: number } {
        return {
            poolSize: this._nodePool.length,
            maxPoolSize: 1000
        };
    }
} 