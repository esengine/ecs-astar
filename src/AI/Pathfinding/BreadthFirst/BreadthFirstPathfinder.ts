import { IVector2, Vector2Utils } from '../../../Types/IVector2';
import { IUnweightedGraph } from './IUnweightedGraph';

/**
 * 广度优先搜索算法实现
 * 适用于无权图，保证找到最短路径（步数最少）
 */
export class BreadthFirstPathfinder {
    /**
     * 使用广度优先搜索算法搜索路径
     * @param graph 图对象
     * @param start 起始节点
     * @param goal 目标节点
     * @param cameFrom 可选的路径记录Map
     * @returns 是否找到路径
     */
    static search<T extends IVector2>(
        graph: IUnweightedGraph<T>, 
        start: T, 
        goal: T, 
        cameFrom?: Map<number, T>
    ): boolean {
        const frontier: T[] = [];
        const visited = new Set<number>();
        const pathMap = cameFrom || new Map<number, T>();

        const startHash = Vector2Utils.toHash(start);
        const goalHash = Vector2Utils.toHash(goal);

        if (startHash === goalHash) {
            return true;
        }

        frontier.push(start);
        visited.add(startHash);

        while (frontier.length > 0) {
            const current = frontier.shift()!;
            const currentHash = Vector2Utils.toHash(current);

            if (currentHash === goalHash) {
                return true;
            }

            for (const neighbor of graph.getNeighbors(current)) {
                const neighborHash = Vector2Utils.toHash(neighbor);

                if (visited.has(neighborHash)) {
                    continue;
                }

                visited.add(neighborHash);
                pathMap.set(neighborHash, current);
                frontier.push(neighbor);
            }
        }

        return false;
    }

    /**
     * 搜索并返回完整路径
     * @param graph 图对象
     * @param start 起始节点
     * @param goal 目标节点
     * @returns 路径数组，如果没找到则返回空数组
     */
    static searchPath<T extends IVector2>(
        graph: IUnweightedGraph<T>, 
        start: T, 
        goal: T
    ): T[] {
        const cameFrom = new Map<number, T>();
        
        if (this.search(graph, start, goal, cameFrom)) {
            return this.reconstructPath(cameFrom, start, goal);
        }
        
        return [];
    }

    /**
     * 重构路径
     * @param cameFrom 路径记录Map
     * @param start 起始节点
     * @param goal 目标节点
     * @returns 完整路径
     */
    static reconstructPath<T extends IVector2>(
        cameFrom: Map<number, T>, 
        start: T, 
        goal: T
    ): T[] {
        const path: T[] = [];
        let current = goal;
        const startHash = Vector2Utils.toHash(start);

        while (Vector2Utils.toHash(current) !== startHash) {
            path.unshift(current);
            const currentHash = Vector2Utils.toHash(current);
            const parent = cameFrom.get(currentHash);
            if (!parent) break;
            current = parent;
        }
        
        path.unshift(start);
        return path;
    }
}
