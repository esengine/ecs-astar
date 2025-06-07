export { IVector2, IComparableVector2, Vector2Utils } from './Types/IVector2';
export { PriorityQueue, IPriorityQueueNode } from './Utils/PriorityQueue';
export { IAstarGraph } from './AI/Pathfinding/AStar/IAstarGraph';
export { AStarPathfinder } from './AI/Pathfinding/AStar/AStarPathfinder';
export { AstarGridGraph } from './AI/Pathfinding/AStar/AstarGridGraph';
export { IUnweightedGraph } from './AI/Pathfinding/BreadthFirst/IUnweightedGraph';
export { BreadthFirstPathfinder } from './AI/Pathfinding/BreadthFirst/BreadthFirstPathfinder';
export { UnweightedGraph } from './AI/Pathfinding/BreadthFirst/UnweightedGraph';
export { UnweightedGridGraph } from './AI/Pathfinding/BreadthFirst/UnweightedGridGraph';

export interface IVector2 {
    x: number;
    y: number;
}
export interface IComparableVector2 extends IVector2 {
    equals?(other: IVector2): boolean;
}
export declare class Vector2Utils {
    private static readonly HASH_MULTIPLIER;
    private static readonly MAX_COORD;
    static equals(a: IVector2, b: IVector2): boolean;
    static create(x: number, y: number): IVector2;
    static clone(vector: IVector2): IVector2;
    static add(a: IVector2, b: IVector2): IVector2;
    static manhattanDistance(a: IVector2, b: IVector2): number;
    static distance(a: IVector2, b: IVector2): number;
    static toHash(vector: IVector2): number;
    static toKey(vector: IVector2): string;
    static fromHash(hash: number): IVector2;
}

export interface IPriorityQueueNode {
    priority: number;
}
export declare class PriorityQueue<T extends IPriorityQueueNode> {
    private _heap;
    private _size;
    get size(): number;
    get isEmpty(): boolean;
    clear(): void;
    enqueue(item: T): void;
    dequeue(): T | undefined;
    peek(): T | undefined;
    private _bubbleUp;
    private _bubbleDown;
    private _swap;
}

import { IVector2 } from '../../../Types/IVector2';
import { IAstarGraph } from './IAstarGraph';
import { IPriorityQueueNode } from '../../../Utils/PriorityQueue';
declare class AStarNode implements IPriorityQueueNode {
    node: IVector2;
    priority: number;
    gCost: number;
    hCost: number;
    parent: AStarNode | null;
    hash: number;
    constructor(node: IVector2, gCost?: number, hCost?: number, parent?: AStarNode | null);
    updateCosts(gCost: number, hCost: number, parent?: AStarNode | null): void;
    updateNode(node: IVector2, gCost?: number, hCost?: number, parent?: AStarNode | null): void;
    reset(): void;
}
export declare class AStarPathfinder {
    private static _nodePool;
    private static _tempPath;
    private static _getNode;
    private static _recycleNode;
    static search<T extends IVector2>(graph: IAstarGraph<T>, start: T, goal: T): {
        found: boolean;
        goalNode?: AStarNode;
    };
    static searchPath<T extends IVector2>(graph: IAstarGraph<T>, start: T, goal: T): T[];
    private static reconstructPathFromNode;
    static hasPath<T extends IVector2>(graph: IAstarGraph<T>, start: T, goal: T): boolean;
    static clearPool(): void;
    static getPoolStats(): {
        poolSize: number;
        maxPoolSize: number;
    };
}
export {};

import { IVector2 } from '../../../Types/IVector2';
import { IAstarGraph } from './IAstarGraph';
export declare class AstarGridGraph implements IAstarGraph<IVector2> {
    dirs: IVector2[];
    walls: IVector2[];
    weightedNodes: IVector2[];
    defaultWeight: number;
    weightedNodeWeight: number;
    private _width;
    private _height;
    private _neighbors;
    private _wallsSet;
    private _weightedNodesSet;
    private _wallsDirty;
    private _weightedNodesDirty;
    constructor(width: number, height: number);
    addWall(wall: IVector2): void;
    addWalls(walls: IVector2[]): void;
    clearWalls(): void;
    addWeightedNode(node: IVector2): void;
    addWeightedNodes(nodes: IVector2[]): void;
    clearWeightedNodes(): void;
    private _updateHashSets;
    isNodeInBounds(node: IVector2): boolean;
    isNodePassable(node: IVector2): boolean;
    search(start: IVector2, goal: IVector2): boolean;
    searchPath(start: IVector2, goal: IVector2): IVector2[];
    getNeighbors(node: IVector2): IVector2[];
    cost(from: IVector2, to: IVector2): number;
    heuristic(node: IVector2, goal: IVector2): number;
    getStats(): {
        walls: number;
        weightedNodes: number;
        gridSize: string;
        wallsSetSize: number;
        weightedNodesSetSize: number;
    };
}

import { IVector2 } from '../../../Types/IVector2';
export interface IAstarGraph<T extends IVector2> {
    getNeighbors(node: T): T[];
    cost(from: T, to: T): number;
    heuristic(node: T, goal: T): number;
}

import { IVector2 } from '../../../Types/IVector2';
import { IUnweightedGraph } from './IUnweightedGraph';
export declare class BreadthFirstPathfinder {
    static search<T extends IVector2>(graph: IUnweightedGraph<T>, start: T, goal: T, cameFrom?: Map<number, T>): boolean;
    static searchPath<T extends IVector2>(graph: IUnweightedGraph<T>, start: T, goal: T): T[];
    static reconstructPath<T extends IVector2>(cameFrom: Map<number, T>, start: T, goal: T): T[];
}

import { IVector2 } from '../../../Types/IVector2';
export interface IUnweightedGraph<T extends IVector2> {
    getNeighbors(node: T): T[];
}

import { IVector2 } from '../../../Types/IVector2';
import { IUnweightedGraph } from './IUnweightedGraph';
export declare class UnweightedGraph<T extends IVector2> implements IUnweightedGraph<T> {
    edges: Map<T, T[]>;
    addEdgesForNode(node: T, neighbors: T[]): this;
    getNeighbors(node: T): T[];
}

import { IVector2 } from '../../../Types/IVector2';
import { IUnweightedGraph } from './IUnweightedGraph';
export declare class UnweightedGridGraph implements IUnweightedGraph<IVector2> {
    private static readonly CARDINAL_DIRS;
    private static readonly COMPASS_DIRS;
    walls: IVector2[];
    private _width;
    private _height;
    private _dirs;
    private _neighbors;
    constructor(width: number, height: number, allowDiagonalSearch?: boolean);
    isNodeInBounds(node: IVector2): boolean;
    isNodePassable(node: IVector2): boolean;
    getNeighbors(node: IVector2): IVector2[];
    searchPath(start: IVector2, goal: IVector2): IVector2[];
    hasPath(start: IVector2, goal: IVector2): boolean;
}
