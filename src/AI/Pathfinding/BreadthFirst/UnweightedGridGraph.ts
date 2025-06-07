import { IVector2, Vector2Utils } from '../../../Types/IVector2';
import { IUnweightedGraph } from './IUnweightedGraph';
import { BreadthFirstPathfinder } from './BreadthFirstPathfinder';

/**
 * 基本的无权网格图，用于广度优先搜索
 * 适用于简单的网格寻路，如迷宫、推箱子等游戏
 */
export class UnweightedGridGraph implements IUnweightedGraph<IVector2> {
    private static readonly CARDINAL_DIRS: IVector2[] = [
        Vector2Utils.create(1, 0),
        Vector2Utils.create(0, -1),
        Vector2Utils.create(-1, 0),
        Vector2Utils.create(0, 1)
    ];

    private static readonly COMPASS_DIRS: IVector2[] = [
        Vector2Utils.create(1, 0),
        Vector2Utils.create(1, -1),
        Vector2Utils.create(0, -1),
        Vector2Utils.create(-1, -1),
        Vector2Utils.create(-1, 0),
        Vector2Utils.create(-1, 1),
        Vector2Utils.create(0, 1),
        Vector2Utils.create(1, 1),
    ];

    public walls: IVector2[] = [];

    private _width: number;
    private _height: number;
    private _dirs: IVector2[];
    private _neighbors: IVector2[] = [];

    constructor(width: number, height: number, allowDiagonalSearch: boolean = false) {
        this._width = width;
        this._height = height;
        this._dirs = allowDiagonalSearch ? UnweightedGridGraph.COMPASS_DIRS : UnweightedGridGraph.CARDINAL_DIRS;
    }

    public isNodeInBounds(node: IVector2): boolean {
        return 0 <= node.x && node.x < this._width && 0 <= node.y && node.y < this._height;
    }

    public isNodePassable(node: IVector2): boolean {
        return !this.walls.find(wall => Vector2Utils.equals(wall, node));
    }

    public getNeighbors(node: IVector2): IVector2[] {
        this._neighbors.length = 0;

        for (const dir of this._dirs) {
            const next = Vector2Utils.add(node, dir);
            if (this.isNodeInBounds(next) && this.isNodePassable(next)) {
                this._neighbors.push(next);
            }
        }

        return this._neighbors;
    }

    /**
     * 搜索路径的便捷方法
     * @param start 起始位置
     * @param goal 目标位置
     * @returns 路径数组，如果没找到则返回空数组
     */
    public searchPath(start: IVector2, goal: IVector2): IVector2[] {
        return BreadthFirstPathfinder.searchPath(this, start, goal);
    }

    /**
     * 检查是否存在路径
     * @param start 起始位置
     * @param goal 目标位置
     * @returns 是否存在路径
     */
    public hasPath(start: IVector2, goal: IVector2): boolean {
        return BreadthFirstPathfinder.search(this, start, goal);
    }
}
