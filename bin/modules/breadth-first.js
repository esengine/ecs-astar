// 广度优先搜索算法模块 v1.0.1
export { Vector2Utils } from './Types/IVector2';
export { PriorityQueue } from './Utils/PriorityQueue';
export { AStarPathfinder } from './AI/Pathfinding/AStar/AStarPathfinder';
export { AstarGridGraph } from './AI/Pathfinding/AStar/AstarGridGraph';
export { BreadthFirstPathfinder } from './AI/Pathfinding/BreadthFirst/BreadthFirstPathfinder';
export { UnweightedGraph } from './AI/Pathfinding/BreadthFirst/UnweightedGraph';
export { UnweightedGridGraph } from './AI/Pathfinding/BreadthFirst/UnweightedGridGraph';

var Vector2Utils = (function () {
    function Vector2Utils() {
    }
    Vector2Utils.equals = function (a, b) {
        if (a.equals) {
            return a.equals(b);
        }
        return a.x === b.x && a.y === b.y;
    };
    Vector2Utils.create = function (x, y) {
        return { x: x, y: y };
    };
    Vector2Utils.clone = function (vector) {
        return { x: vector.x, y: vector.y };
    };
    Vector2Utils.add = function (a, b) {
        return { x: a.x + b.x, y: a.y + b.y };
    };
    Vector2Utils.manhattanDistance = function (a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    };
    Vector2Utils.distance = function (a, b) {
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    Vector2Utils.toHash = function (vector) {
        var x = (vector.x + this.MAX_COORD) | 0;
        var y = (vector.y + this.MAX_COORD) | 0;
        return (x << 16) | y;
    };
    Vector2Utils.toKey = function (vector) {
        return "".concat(vector.x, ",").concat(vector.y);
    };
    Vector2Utils.fromHash = function (hash) {
        var x = (hash >> 16) - this.MAX_COORD;
        var y = (hash & 0xFFFF) - this.MAX_COORD;
        return { x: x, y: y };
    };
    Vector2Utils.HASH_MULTIPLIER = 73856093;
    Vector2Utils.MAX_COORD = 32767;
    return Vector2Utils;
}());
export { Vector2Utils };

var PriorityQueue = (function () {
    function PriorityQueue() {
        this._heap = [];
        this._size = 0;
    }
    Object.defineProperty(PriorityQueue.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PriorityQueue.prototype, "isEmpty", {
        get: function () {
            return this._size === 0;
        },
        enumerable: false,
        configurable: true
    });
    PriorityQueue.prototype.clear = function () {
        this._heap.length = 0;
        this._size = 0;
    };
    PriorityQueue.prototype.enqueue = function (item) {
        this._heap[this._size] = item;
        this._bubbleUp(this._size);
        this._size++;
    };
    PriorityQueue.prototype.dequeue = function () {
        if (this._size === 0) {
            return undefined;
        }
        var result = this._heap[0];
        this._size--;
        if (this._size > 0) {
            this._heap[0] = this._heap[this._size];
            this._bubbleDown(0);
        }
        return result;
    };
    PriorityQueue.prototype.peek = function () {
        return this._size > 0 ? this._heap[0] : undefined;
    };
    PriorityQueue.prototype._bubbleUp = function (index) {
        while (index > 0) {
            var parentIndex = Math.floor((index - 1) / 2);
            if (this._heap[index].priority >= this._heap[parentIndex].priority) {
                break;
            }
            this._swap(index, parentIndex);
            index = parentIndex;
        }
    };
    PriorityQueue.prototype._bubbleDown = function (index) {
        while (true) {
            var minIndex = index;
            var leftChild = 2 * index + 1;
            var rightChild = 2 * index + 2;
            if (leftChild < this._size &&
                this._heap[leftChild].priority < this._heap[minIndex].priority) {
                minIndex = leftChild;
            }
            if (rightChild < this._size &&
                this._heap[rightChild].priority < this._heap[minIndex].priority) {
                minIndex = rightChild;
            }
            if (minIndex === index) {
                break;
            }
            this._swap(index, minIndex);
            index = minIndex;
        }
    };
    PriorityQueue.prototype._swap = function (i, j) {
        var temp = this._heap[i];
        this._heap[i] = this._heap[j];
        this._heap[j] = temp;
    };
    return PriorityQueue;
}());
export { PriorityQueue };

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { Vector2Utils } from '../../../Types/IVector2';
import { PriorityQueue } from '../../../Utils/PriorityQueue';
var AStarNode = (function () {
    function AStarNode(node, gCost, hCost, parent) {
        if (gCost === void 0) { gCost = 0; }
        if (hCost === void 0) { hCost = 0; }
        if (parent === void 0) { parent = null; }
        this.priority = 0;
        this.gCost = 0;
        this.hCost = 0;
        this.parent = null;
        this.hash = 0;
        this.node = node;
        this.gCost = gCost;
        this.hCost = hCost;
        this.priority = gCost + hCost;
        this.parent = parent;
        this.hash = Vector2Utils.toHash(node);
    }
    AStarNode.prototype.updateCosts = function (gCost, hCost, parent) {
        if (parent === void 0) { parent = null; }
        this.gCost = gCost;
        this.hCost = hCost;
        this.priority = gCost + hCost;
        this.parent = parent;
    };
    AStarNode.prototype.updateNode = function (node, gCost, hCost, parent) {
        if (gCost === void 0) { gCost = 0; }
        if (hCost === void 0) { hCost = 0; }
        if (parent === void 0) { parent = null; }
        this.node = node;
        this.gCost = gCost;
        this.hCost = hCost;
        this.priority = gCost + hCost;
        this.parent = parent;
        this.hash = Vector2Utils.toHash(node);
    };
    AStarNode.prototype.reset = function () {
        this.node = null;
        this.priority = 0;
        this.gCost = 0;
        this.hCost = 0;
        this.parent = null;
        this.hash = 0;
    };
    return AStarNode;
}());
var AStarPathfinder = (function () {
    function AStarPathfinder() {
    }
    AStarPathfinder._getNode = function (node, gCost, hCost, parent) {
        if (gCost === void 0) { gCost = 0; }
        if (hCost === void 0) { hCost = 0; }
        if (parent === void 0) { parent = null; }
        var astarNode = this._nodePool.pop();
        if (!astarNode) {
            astarNode = new AStarNode(node, gCost, hCost, parent);
        }
        else {
            astarNode.updateNode(node, gCost, hCost, parent);
        }
        return astarNode;
    };
    AStarPathfinder._recycleNode = function (node) {
        if (this._nodePool.length < 1000) {
            node.reset();
            this._nodePool.push(node);
        }
    };
    AStarPathfinder.search = function (graph, start, goal) {
        var openSet = new PriorityQueue();
        var closedSet = new Set();
        var openSetMap = new Map();
        var startHash = Vector2Utils.toHash(start);
        var goalHash = Vector2Utils.toHash(goal);
        if (startHash === goalHash) {
            return { found: true, goalNode: this._getNode(start, 0, 0) };
        }
        var startNode = this._getNode(start, 0, graph.heuristic(start, goal));
        openSet.enqueue(startNode);
        openSetMap.set(startHash, startNode);
        var goalNode;
        while (!openSet.isEmpty) {
            var current = openSet.dequeue();
            var currentHash = current.hash;
            openSetMap.delete(currentHash);
            if (currentHash === goalHash) {
                goalNode = current;
                break;
            }
            closedSet.add(currentHash);
            for (var _i = 0, _a = graph.getNeighbors(current.node); _i < _a.length; _i++) {
                var neighbor = _a[_i];
                var neighborHash = Vector2Utils.toHash(neighbor);
                if (closedSet.has(neighborHash)) {
                    continue;
                }
                var tentativeGScore = current.gCost + graph.cost(current.node, neighbor);
                var existingNode = openSetMap.get(neighborHash);
                if (existingNode) {
                    if (tentativeGScore < existingNode.gCost) {
                        var hCost = existingNode.hCost;
                        existingNode.updateCosts(tentativeGScore, hCost, current);
                    }
                }
                else {
                    var hCost = graph.heuristic(neighbor, goal);
                    var neighborNode = this._getNode(neighbor, tentativeGScore, hCost, current);
                    openSet.enqueue(neighborNode);
                    openSetMap.set(neighborHash, neighborNode);
                }
            }
            if (current !== goalNode) {
                this._recycleNode(current);
            }
        }
        while (!openSet.isEmpty) {
            var node = openSet.dequeue();
            if (node !== goalNode) {
                this._recycleNode(node);
            }
        }
        return { found: !!goalNode, goalNode: goalNode };
    };
    AStarPathfinder.searchPath = function (graph, start, goal) {
        var result = this.search(graph, start, goal);
        if (!result.found || !result.goalNode) {
            return [];
        }
        return this.reconstructPathFromNode(result.goalNode, start);
    };
    AStarPathfinder.reconstructPathFromNode = function (goalNode, start) {
        this._tempPath.length = 0;
        var current = goalNode;
        var startHash = Vector2Utils.toHash(start);
        while (current) {
            this._tempPath.unshift(current.node);
            var currentHash = current.hash;
            var parent_1 = current.parent;
            if (currentHash !== startHash) {
                this._recycleNode(current);
            }
            current = parent_1;
        }
        return __spreadArray([], this._tempPath, true);
    };
    AStarPathfinder.hasPath = function (graph, start, goal) {
        var result = this.search(graph, start, goal);
        if (result.goalNode) {
            this._recycleNode(result.goalNode);
        }
        return result.found;
    };
    AStarPathfinder.clearPool = function () {
        this._nodePool.length = 0;
        this._tempPath.length = 0;
    };
    AStarPathfinder.getPoolStats = function () {
        return {
            poolSize: this._nodePool.length,
            maxPoolSize: 1000
        };
    };
    AStarPathfinder._nodePool = [];
    AStarPathfinder._tempPath = [];
    return AStarPathfinder;
}());
export { AStarPathfinder };

import { Vector2Utils } from '../../../Types/IVector2';
import { AStarPathfinder } from './AStarPathfinder';
var AstarGridGraph = (function () {
    function AstarGridGraph(width, height) {
        this.dirs = [
            Vector2Utils.create(1, 0),
            Vector2Utils.create(0, -1),
            Vector2Utils.create(-1, 0),
            Vector2Utils.create(0, 1)
        ];
        this.walls = [];
        this.weightedNodes = [];
        this.defaultWeight = 1;
        this.weightedNodeWeight = 5;
        this._neighbors = new Array(4);
        this._wallsSet = new Set();
        this._weightedNodesSet = new Set();
        this._wallsDirty = true;
        this._weightedNodesDirty = true;
        this._width = width;
        this._height = height;
    }
    AstarGridGraph.prototype.addWall = function (wall) {
        this.walls.push(wall);
        this._wallsDirty = true;
    };
    AstarGridGraph.prototype.addWalls = function (walls) {
        var _a;
        (_a = this.walls).push.apply(_a, walls);
        this._wallsDirty = true;
    };
    AstarGridGraph.prototype.clearWalls = function () {
        this.walls.length = 0;
        this._wallsSet.clear();
        this._wallsDirty = false;
    };
    AstarGridGraph.prototype.addWeightedNode = function (node) {
        this.weightedNodes.push(node);
        this._weightedNodesDirty = true;
    };
    AstarGridGraph.prototype.addWeightedNodes = function (nodes) {
        var _a;
        (_a = this.weightedNodes).push.apply(_a, nodes);
        this._weightedNodesDirty = true;
    };
    AstarGridGraph.prototype.clearWeightedNodes = function () {
        this.weightedNodes.length = 0;
        this._weightedNodesSet.clear();
        this._weightedNodesDirty = false;
    };
    AstarGridGraph.prototype._updateHashSets = function () {
        if (this._wallsDirty) {
            this._wallsSet.clear();
            for (var _i = 0, _a = this.walls; _i < _a.length; _i++) {
                var wall = _a[_i];
                this._wallsSet.add(Vector2Utils.toHash(wall));
            }
            this._wallsDirty = false;
        }
        if (this._weightedNodesDirty) {
            this._weightedNodesSet.clear();
            for (var _b = 0, _c = this.weightedNodes; _b < _c.length; _b++) {
                var node = _c[_b];
                this._weightedNodesSet.add(Vector2Utils.toHash(node));
            }
            this._weightedNodesDirty = false;
        }
    };
    AstarGridGraph.prototype.isNodeInBounds = function (node) {
        return 0 <= node.x && node.x < this._width && 0 <= node.y && node.y < this._height;
    };
    AstarGridGraph.prototype.isNodePassable = function (node) {
        this._updateHashSets();
        return !this._wallsSet.has(Vector2Utils.toHash(node));
    };
    AstarGridGraph.prototype.search = function (start, goal) {
        return AStarPathfinder.hasPath(this, start, goal);
    };
    AstarGridGraph.prototype.searchPath = function (start, goal) {
        return AStarPathfinder.searchPath(this, start, goal);
    };
    AstarGridGraph.prototype.getNeighbors = function (node) {
        this._neighbors.length = 0;
        for (var _i = 0, _a = this.dirs; _i < _a.length; _i++) {
            var dir = _a[_i];
            var next = Vector2Utils.add(node, dir);
            if (this.isNodeInBounds(next) && this.isNodePassable(next)) {
                this._neighbors.push(next);
            }
        }
        return this._neighbors;
    };
    AstarGridGraph.prototype.cost = function (from, to) {
        this._updateHashSets();
        return this._weightedNodesSet.has(Vector2Utils.toHash(to)) ? this.weightedNodeWeight : this.defaultWeight;
    };
    AstarGridGraph.prototype.heuristic = function (node, goal) {
        return Vector2Utils.manhattanDistance(node, goal);
    };
    AstarGridGraph.prototype.getStats = function () {
        this._updateHashSets();
        return {
            walls: this.walls.length,
            weightedNodes: this.weightedNodes.length,
            gridSize: "".concat(this._width, "x").concat(this._height),
            wallsSetSize: this._wallsSet.size,
            weightedNodesSetSize: this._weightedNodesSet.size
        };
    };
    return AstarGridGraph;
}());
export { AstarGridGraph };

export {};

import { Vector2Utils } from '../../../Types/IVector2';
var BreadthFirstPathfinder = (function () {
    function BreadthFirstPathfinder() {
    }
    BreadthFirstPathfinder.search = function (graph, start, goal, cameFrom) {
        var frontier = [];
        var visited = new Set();
        var pathMap = cameFrom || new Map();
        var startHash = Vector2Utils.toHash(start);
        var goalHash = Vector2Utils.toHash(goal);
        if (startHash === goalHash) {
            return true;
        }
        frontier.push(start);
        visited.add(startHash);
        while (frontier.length > 0) {
            var current = frontier.shift();
            var currentHash = Vector2Utils.toHash(current);
            if (currentHash === goalHash) {
                return true;
            }
            for (var _i = 0, _a = graph.getNeighbors(current); _i < _a.length; _i++) {
                var neighbor = _a[_i];
                var neighborHash = Vector2Utils.toHash(neighbor);
                if (visited.has(neighborHash)) {
                    continue;
                }
                visited.add(neighborHash);
                pathMap.set(neighborHash, current);
                frontier.push(neighbor);
            }
        }
        return false;
    };
    BreadthFirstPathfinder.searchPath = function (graph, start, goal) {
        var cameFrom = new Map();
        if (this.search(graph, start, goal, cameFrom)) {
            return this.reconstructPath(cameFrom, start, goal);
        }
        return [];
    };
    BreadthFirstPathfinder.reconstructPath = function (cameFrom, start, goal) {
        var path = [];
        var current = goal;
        var startHash = Vector2Utils.toHash(start);
        while (Vector2Utils.toHash(current) !== startHash) {
            path.unshift(current);
            var currentHash = Vector2Utils.toHash(current);
            var parent_1 = cameFrom.get(currentHash);
            if (!parent_1)
                break;
            current = parent_1;
        }
        path.unshift(start);
        return path;
    };
    return BreadthFirstPathfinder;
}());
export { BreadthFirstPathfinder };

export {};

var UnweightedGraph = (function () {
    function UnweightedGraph() {
        this.edges = new Map();
    }
    UnweightedGraph.prototype.addEdgesForNode = function (node, neighbors) {
        this.edges.set(node, neighbors);
        return this;
    };
    UnweightedGraph.prototype.getNeighbors = function (node) {
        return this.edges.get(node) || [];
    };
    return UnweightedGraph;
}());
export { UnweightedGraph };

import { Vector2Utils } from '../../../Types/IVector2';
import { BreadthFirstPathfinder } from './BreadthFirstPathfinder';
var UnweightedGridGraph = (function () {
    function UnweightedGridGraph(width, height, allowDiagonalSearch) {
        if (allowDiagonalSearch === void 0) { allowDiagonalSearch = false; }
        this.walls = [];
        this._neighbors = [];
        this._width = width;
        this._height = height;
        this._dirs = allowDiagonalSearch ? UnweightedGridGraph.COMPASS_DIRS : UnweightedGridGraph.CARDINAL_DIRS;
    }
    UnweightedGridGraph.prototype.isNodeInBounds = function (node) {
        return 0 <= node.x && node.x < this._width && 0 <= node.y && node.y < this._height;
    };
    UnweightedGridGraph.prototype.isNodePassable = function (node) {
        return !this.walls.find(function (wall) { return Vector2Utils.equals(wall, node); });
    };
    UnweightedGridGraph.prototype.getNeighbors = function (node) {
        this._neighbors.length = 0;
        for (var _i = 0, _a = this._dirs; _i < _a.length; _i++) {
            var dir = _a[_i];
            var next = Vector2Utils.add(node, dir);
            if (this.isNodeInBounds(next) && this.isNodePassable(next)) {
                this._neighbors.push(next);
            }
        }
        return this._neighbors;
    };
    UnweightedGridGraph.prototype.searchPath = function (start, goal) {
        return BreadthFirstPathfinder.searchPath(this, start, goal);
    };
    UnweightedGridGraph.prototype.hasPath = function (start, goal) {
        return BreadthFirstPathfinder.search(this, start, goal);
    };
    UnweightedGridGraph.CARDINAL_DIRS = [
        Vector2Utils.create(1, 0),
        Vector2Utils.create(0, -1),
        Vector2Utils.create(-1, 0),
        Vector2Utils.create(0, 1)
    ];
    UnweightedGridGraph.COMPASS_DIRS = [
        Vector2Utils.create(1, 0),
        Vector2Utils.create(1, -1),
        Vector2Utils.create(0, -1),
        Vector2Utils.create(-1, -1),
        Vector2Utils.create(-1, 0),
        Vector2Utils.create(-1, 1),
        Vector2Utils.create(0, 1),
        Vector2Utils.create(1, 1),
    ];
    return UnweightedGridGraph;
}());
export { UnweightedGridGraph };
