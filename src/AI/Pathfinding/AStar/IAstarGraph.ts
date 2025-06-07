import { IVector2 } from '../../../Types/IVector2';

/**
 * A*算法图接口
 * @template T 节点类型，通常是实现了IVector2的类型
 */
export interface IAstarGraph<T extends IVector2> {
    /**
     * 获取指定节点的邻居节点
     * @param node 当前节点
     * @returns 邻居节点数组
     */
    getNeighbors(node: T): T[];

    /**
     * 计算从一个节点到另一个节点的移动成本
     * @param from 起始节点
     * @param to 目标节点
     * @returns 移动成本
     */
    cost(from: T, to: T): number;

    /**
     * 计算启发式函数值（估算从当前节点到目标的成本）
     * @param node 当前节点
     * @param goal 目标节点
     * @returns 启发式成本
     */
    heuristic(node: T, goal: T): number;
}
