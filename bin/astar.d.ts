declare module ai {
    class PriorityQueueNode {
        priority: number;
        insertionIndex: number;
        queueIndex: number;
    }
}
declare module ai {
    class AStarPathfinder {
        static search<T extends es.Vector2>(graph: IAstarGraph<T>, start: T, goal: T, cameFrom?: Map<string, T>): boolean;
        static searchR<T extends es.Vector2>(graph: IAstarGraph<T>, start: T, goal: T): T[];
        static recontructPath<T extends es.Vector2>(cameFrom: Map<string, T>, start: T, goal: T): T[];
    }
}
declare module ai {
    class AstarGridGraph implements IAstarGraph<es.Vector2> {
        dirs: es.Vector2[];
        walls: es.Vector2[];
        weightedNodes: es.Vector2[];
        defaultWeight: number;
        weightedNodeWeight: number;
        private _width;
        private _height;
        private _neighbors;
        constructor(width: number, height: number);
        isNodeInBounds(node: es.Vector2): boolean;
        isNodePassable(node: es.Vector2): boolean;
        search(start: es.Vector2, goal: es.Vector2): boolean;
        getNeighbors(node: es.Vector2): es.Vector2[];
        cost(from: es.Vector2, to: es.Vector2): number;
        heuristic(node: es.Vector2, goal: es.Vector2): number;
    }
}
declare module ai {
    interface IAstarGraph<T> {
        getNeighbors(node: T): Array<T>;
        cost(from: T, to: T): number;
        heuristic(node: T, goal: T): any;
    }
}
declare module ai {
    class PriorityQueue<T extends PriorityQueueNode> {
        private _numNodes;
        private _nodes;
        private _numNodesEverEnqueued;
        constructor(maxNodes: number);
        readonly count: number;
        readonly maxSize: number;
        clear(): void;
        contains(node: T): boolean;
        enqueue(node: T, priority: number): void;
        dequeue(): T;
        remove(node: T): void;
        isValidQueue(): boolean;
        private onNodeUpdated;
        private cascadeDown;
        private cascadeUp;
        private swap;
        private hasHigherPriority;
    }
}
declare module ai {
    class BreadthFirstPathfinder {
        static search<T extends es.Vector2>(graph: IUnweightedGraph<T>, start: T, goal: T, cameFrom?: Map<string, T>): boolean;
        static searchR<T extends es.Vector2>(graph: IUnweightedGraph<T>, start: T, goal: T): T[];
    }
}
declare module ai {
    interface IUnweightedGraph<T> {
        getNeighbors(node: T): T[];
    }
}
declare module ai {
    class UnweightedGraph<T> implements IUnweightedGraph<T> {
        edges: Map<T, T[]>;
        addEdgesForNode(node: T, edges: T[]): this;
        getNeighbors(node: T): T[];
    }
}
declare module ai {
    class UnweightedGridGraph implements IUnweightedGraph<es.Vector2> {
        private static readonly CARDINAL_DIRS;
        private static readonly COMPASS_DIRS;
        walls: es.Vector2[];
        private _width;
        private _hegiht;
        private _dirs;
        private _neighbors;
        constructor(width: number, height: number, allowDiagonalSearch?: boolean);
        isNodeInBounds(node: es.Vector2): boolean;
        isNodePassable(node: es.Vector2): boolean;
        getNeighbors(node: es.Vector2): es.Vector2[];
        search(start: es.Vector2, goal: es.Vector2): es.Vector2[];
    }
}
declare module ai {
    interface IWeightedGraph<T> {
        getNeighbors(node: T): T[];
        cost(from: T, to: T): number;
    }
}
declare module ai {
    class WeightedGridGraph implements IWeightedGraph<es.Vector2> {
        static readonly CARDINAL_DIRS: es.Vector2[];
        private static readonly COMPASS_DIRS;
        walls: es.Vector2[];
        weightedNodes: es.Vector2[];
        defaultWeight: number;
        weightedNodeWeight: number;
        private _width;
        private _height;
        private _dirs;
        private _neighbors;
        constructor(width: number, height: number, allowDiagonalSearch?: boolean);
        isNodeInBounds(node: es.Vector2): boolean;
        isNodePassable(node: es.Vector2): boolean;
        search(start: es.Vector2, goal: es.Vector2): boolean;
        getNeighbors(node: es.Vector2): es.Vector2[];
        cost(from: es.Vector2, to: es.Vector2): number;
    }
}
declare module ai {
    class WeightedNode<T> extends PriorityQueueNode {
        data: T;
        constructor(data: T);
    }
    class WeightedPathfinder {
        static search<T extends es.Vector2>(graph: IWeightedGraph<T>, start: T, goal: T, cameFrom?: Map<string, T>): boolean;
        static searchR<T extends es.Vector2>(graph: IWeightedGraph<T>, start: T, goal: T): T[];
        static recontructPath<T extends es.Vector2>(cameFrom: Map<string, T>, start: T, goal: T): T[];
    }
}
declare module ai {
    class AStarStorage {
        static readonly MAX_NODES: number;
        _opened: AStarNode[];
        _closed: AStarNode[];
        _numOpened: number;
        _numClosed: number;
        _lastFoundOpened: number;
        _lastFoundClosed: number;
        constructor();
        clear(): void;
        findOpened(node: AStarNode): AStarNode;
        findClosed(node: AStarNode): AStarNode;
        hasOpened(): boolean;
        removeOpened(node: AStarNode): void;
        removeClosed(node: AStarNode): void;
        isOpen(node: AStarNode): boolean;
        isClosed(node: AStarNode): boolean;
        addToOpenList(node: AStarNode): void;
        addToClosedList(node: AStarNode): void;
        removeCheapestOpenNode(): AStarNode;
    }
}
declare module ai {
    class AStarNode implements es.IEquatable<AStarNode>, es.IPoolable {
        worldState: WorldState;
        costSoFar: number;
        heuristicCost: number;
        costSoFarAndHeuristicCost: number;
        action: Action;
        parent: AStarNode;
        parentWorldState: WorldState;
        depth: number;
        equals(other: AStarNode): boolean;
        compareTo(other: AStarNode): number;
        reset(): void;
        clone(): AStarNode;
        toString(): string;
    }
    class AStar {
        static storage: AStarStorage;
        static plan(ap: ActionPlanner, start: WorldState, goal: WorldState, selectedNodes?: AStarNode[]): Action[];
        static reconstructPlan(goalNode: AStarNode, selectedNodes: AStarNode[]): Action[];
        static calculateHeuristic(fr: WorldState, to: WorldState): number;
    }
}
declare module ai {
    class Action {
        name: string;
        cost: number;
        _preConditions: Set<[string, boolean]>;
        _postConditions: Set<[string, boolean]>;
        constructor(name?: string, cost?: number);
        setPrecondition(conditionName: string, value: boolean): void;
        setPostcondition(conditionName: string, value: boolean): void;
        validate(): boolean;
        toString(): string;
    }
}
declare module ai {
    class ActionPlanner {
        static readonly MAX_CONDITIONS: number;
        conditionNames: string[];
        _actions: Action[];
        _viableActions: Action[];
        _preConditions: WorldState[];
        _postConditions: WorldState[];
        _numConditionNames: number;
        constructor();
        createWorldState(): WorldState;
        addAction(action: Action): void;
        plan(startState: WorldState, goalState: WorldState, selectedNode?: any): Action[];
        getPossibleTransitions(fr: WorldState): AStarNode[];
        applyPostConditions(ap: ActionPlanner, actionnr: number, fr: WorldState): WorldState;
        findConditionNameIndex(conditionName: string): any;
        findActionIndex(action: Action): number;
    }
}
declare module ai {
    abstract class Agent {
        actions: Action[];
        _planner: ActionPlanner;
        constructor();
        plan(debugPlan?: boolean): boolean;
        hasActionPlan(): boolean;
        abstract getWorldState(): WorldState;
        abstract getGoalState(): WorldState;
    }
}
declare module ai {
    class WorldState implements es.IEquatable<WorldState> {
        values: number;
        dontCare: number;
        planner: ActionPlanner;
        static create(planner: ActionPlanner): WorldState;
        constructor(planner: ActionPlanner, values: number, dontcare: number);
        set(conditionId: number | string, value: boolean): boolean;
        equals(other: WorldState): boolean;
        describe(planner: ActionPlanner): string;
    }
}
