import { IVector2 } from '../../../Types/IVector2';
import { IUnweightedGraph } from './IUnweightedGraph';

/**
 * 一个未加权图的基本实现。所有的边都被缓存。这种类型的图最适合于非基于网格的图。
 * 作为边添加的任何节点都必须在边字典中有一个条目作为键。
 */
export class UnweightedGraph<T extends IVector2> implements IUnweightedGraph<T> {
    public edges: Map<T, T[]> = new Map<T, T[]>();

    /**
     * 为指定节点添加边
     * @param node 节点
     * @param neighbors 邻居节点数组
     */
    addEdgesForNode(node: T, neighbors: T[]): this {
        this.edges.set(node, neighbors);
        return this;
    }

    /**
     * 获取指定节点的邻居节点
     * @param node 节点
     * @returns 邻居节点数组
     */
    getNeighbors(node: T): T[] {
        return this.edges.get(node) || [];
    }
}
