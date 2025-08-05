import { IVector2, Vector2Utils } from '../../../Types/IVector2';
import { IAstarGraph } from './IAstarGraph';
import { AStarPathfinder } from './AStarPathfinder';

/**
 * 基本静态网格图与A*一起使用
 * 将walls添加到walls数组，并将加权节点添加到weightedNodes数组
 */
export class AstarGridGraph implements IAstarGraph<IVector2> {
    public dirs: IVector2[] = [
        Vector2Utils.create(1, 0),
        Vector2Utils.create(0, -1),
        Vector2Utils.create(-1, 0),
        Vector2Utils.create(0, 1)
    ];

    public walls: IVector2[] = [];
    public weightedNodes: IVector2[] = [];
    public defaultWeight: number = 1;
    public weightedNodeWeight = 5;

    private _width: number;
    private _height: number;
    private _neighbors: IVector2[] = new Array(4);
    
    private _wallsSet: Set<number> = new Set();
    private _weightedNodesSet: Set<number> = new Set();
    private _wallsDirty: boolean = true;
    private _weightedNodesDirty: boolean = true;

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
    }

    /**
     * 添加障碍物
     */
    addWall(wall: IVector2): void {
        this.walls.push(wall);
        this._wallsDirty = true;
    }

    /**
     * 批量添加障碍物
     */
    addWalls(walls: IVector2[]): void {
        this.walls.push(...walls);
        this._wallsDirty = true;
    }

    /**
     * 清空障碍物
     */
    clearWalls(): void {
        this.walls.length = 0;
        this._wallsSet.clear();
        this._wallsDirty = false;
    }

    /**
     * 添加加权节点
     */
    addWeightedNode(node: IVector2): void {
        this.weightedNodes.push(node);
        this._weightedNodesDirty = true;
    }

    /**
     * 批量添加加权节点
     */
    addWeightedNodes(nodes: IVector2[]): void {
        this.weightedNodes.push(...nodes);
        this._weightedNodesDirty = true;
    }

    /**
     * 清空加权节点
     */
    clearWeightedNodes(): void {
        this.weightedNodes.length = 0;
        this._weightedNodesSet.clear();
        this._weightedNodesDirty = false;
    }

    /**
     * 更新内部哈希集合
     */
    private _updateHashSets(): void {
        if (this._wallsDirty) {
            this._wallsSet.clear();
            for (const wall of this.walls) {
                this._wallsSet.add(Vector2Utils.toHash(wall));
            }
            this._wallsDirty = false;
        }

        if (this._weightedNodesDirty) {
            this._weightedNodesSet.clear();
            for (const node of this.weightedNodes) {
                this._weightedNodesSet.add(Vector2Utils.toHash(node));
            }
            this._weightedNodesDirty = false;
        }
    }

    /**
     * 确保节点在网格图的边界内
     * @param node
     */
    public isNodeInBounds(node: IVector2): boolean {
        return 0 <= node.x && node.x < this._width && 0 <= node.y && node.y < this._height;
    }

    /**
     * 检查节点是否可以通过。walls是不可逾越的。
     * @param node
     */
    public isNodePassable(node: IVector2): boolean {
        this._updateHashSets();
        return !this._wallsSet.has(Vector2Utils.toHash(node));
    }

    /**
     * 检查是否存在路径
     * @param start 起始位置
     * @param goal 目标位置
     */
    public search(start: IVector2, goal: IVector2): boolean {
        return AStarPathfinder.hasPath(this, start, goal);
    }

    /**
     * 搜索并返回完整路径
     * @param start 起始位置
     * @param goal 目标位置
     */
    public searchPath(start: IVector2, goal: IVector2): IVector2[] {
        return AStarPathfinder.searchPath(this, start, goal);
    }

    public getNeighbors(node: IVector2): IVector2[] {
        this._neighbors.length = 0;

        for (const dir of this.dirs) {
            const next = Vector2Utils.add(node, dir);
            if (this.isNodeInBounds(next) && this.isNodePassable(next)) {
                this._neighbors.push(next);
            }
        }

        return this._neighbors;
    }

    public cost(from: IVector2, to: IVector2): number {
        this._updateHashSets();
        return this._weightedNodesSet.has(Vector2Utils.toHash(to)) ? this.weightedNodeWeight : this.defaultWeight;
    }

    public heuristic(node: IVector2, goal: IVector2): number {
        return Vector2Utils.manhattanDistance(node, goal);
    }

    /**
     * 获取统计信息
     */
    public getStats(): { 
        walls: number; 
        weightedNodes: number; 
        gridSize: string;
        wallsSetSize: number;
        weightedNodesSetSize: number;
    } {
        this._updateHashSets();
        return {
            walls: this.walls.length,
            weightedNodes: this.weightedNodes.length,
            gridSize: `${this._width}x${this._height}`,
            wallsSetSize: this._wallsSet.size,
            weightedNodesSetSize: this._weightedNodesSet.size
        };
    }
}
