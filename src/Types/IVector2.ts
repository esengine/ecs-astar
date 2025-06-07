/**
 * 通用Vector2接口，兼容Cocos Creator和Laya引擎的Vector2类型
 * 支持 cc.Vec2, Laya.Vector2 等
 */
export interface IVector2 {
    x: number;
    y: number;
}

/**
 * 可比较的Vector2接口，用于路径查找算法
 */
export interface IComparableVector2 extends IVector2 {
    /**
     * 判断两个向量是否相等
     */
    equals?(other: IVector2): boolean;
}

/**
 * Vector2工具类，提供通用的向量操作
 */
export class Vector2Utils {
    // 哈希计算相关常量
    private static readonly HASH_MULTIPLIER = 73856093;
    private static readonly MAX_COORD = 32767;

    /**
     * 判断两个向量是否相等
     */
    static equals(a: IVector2, b: IVector2): boolean {
        if ((a as IComparableVector2).equals) {
            return (a as IComparableVector2).equals!(b);
        }
        return a.x === b.x && a.y === b.y;
    }

    /**
     * 创建一个新的Vector2对象
     */
    static create(x: number, y: number): IVector2 {
        return { x, y };
    }

    /**
     * 复制Vector2
     */
    static clone(vector: IVector2): IVector2 {
        return { x: vector.x, y: vector.y };
    }

    /**
     * 向量加法
     */
    static add(a: IVector2, b: IVector2): IVector2 {
        return { x: a.x + b.x, y: a.y + b.y };
    }

    /**
     * 计算曼哈顿距离
     */
    static manhattanDistance(a: IVector2, b: IVector2): number {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    /**
     * 计算欧几里得距离
     */
    static distance(a: IVector2, b: IVector2): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 将Vector2转换为数值哈希键
     * 使用位运算生成哈希值，支持坐标范围：-32767 到 32767
     */
    static toHash(vector: IVector2): number {
        const x = (vector.x + this.MAX_COORD) | 0;
        const y = (vector.y + this.MAX_COORD) | 0;
        return (x << 16) | y;
    }

    /**
     * 将Vector2转换为字符串键
     * 用于需要字符串键的场景
     */
    static toKey(vector: IVector2): string {
        return `${vector.x},${vector.y}`;
    }

    /**
     * 从哈希值还原坐标
     * 主要用于调试
     */
    static fromHash(hash: number): IVector2 {
        const x = (hash >> 16) - this.MAX_COORD;
        const y = (hash & 0xFFFF) - this.MAX_COORD;
        return { x, y };
    }
} 