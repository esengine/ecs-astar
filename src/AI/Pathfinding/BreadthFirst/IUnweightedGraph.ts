import { IVector2 } from '../../../Types/IVector2';

/**
 * 无权图接口，用于广度优先搜索
 * @template T 节点类型，通常是实现了IVector2的类型
 */
export interface IUnweightedGraph<T extends IVector2> {
    /**
     * 获取指定节点的邻居节点
     * @param node 当前节点
     * @returns 邻居节点数组
     */
    getNeighbors(node: T): T[];
}
