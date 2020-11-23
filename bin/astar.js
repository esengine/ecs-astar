var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ai;
(function (ai) {
    var PriorityQueueNode = (function () {
        function PriorityQueueNode() {
            this.priority = 0;
            this.insertionIndex = 0;
            this.queueIndex = 0;
        }
        return PriorityQueueNode;
    }());
    ai.PriorityQueueNode = PriorityQueueNode;
})(ai || (ai = {}));
var ai;
(function (ai) {
    var AStarPathfinder = (function () {
        function AStarPathfinder() {
        }
        AStarPathfinder.search = function (graph, start, goal) {
            var _this = this;
            var foundPath = false;
            var cameFrom = new Map();
            cameFrom.set(start, start);
            var costSoFar = new Map();
            var frontier = new ai.PriorityQueue(1000);
            frontier.enqueue(new AStarNode(start), 0);
            costSoFar.set(start, 0);
            var _loop_1 = function () {
                var current = frontier.dequeue();
                if (current.data instanceof es.Vector2 && goal instanceof es.Vector2 && current.data.equals(goal)) {
                    foundPath = true;
                    return "break";
                }
                else if (current.data == goal) {
                    foundPath = true;
                    return "break";
                }
                graph.getNeighbors(current.data).forEach(function (next) {
                    var newCost = costSoFar.get(current.data) + graph.cost(current.data, next);
                    if (!_this.hasKey(costSoFar, next) || newCost < costSoFar.get(next)) {
                        costSoFar.set(next, newCost);
                        var priority = newCost + graph.heuristic(next, goal);
                        frontier.enqueue(new AStarNode(next), priority);
                        cameFrom.set(next, current.data);
                    }
                });
            };
            while (frontier.count > 0) {
                var state_1 = _loop_1();
                if (state_1 === "break")
                    break;
            }
            return foundPath ? this.recontructPath(cameFrom, start, goal) : null;
        };
        AStarPathfinder.recontructPath = function (cameFrom, start, goal) {
            var path = [];
            var current = goal;
            path.push(goal);
            while (current != start) {
                current = this.getKey(cameFrom, current);
                path.push(current);
            }
            path.reverse();
            return path;
        };
        AStarPathfinder.hasKey = function (map, compareKey) {
            var iterator = map.keys();
            var r;
            while (r = iterator.next(), !r.done) {
                if (r.value instanceof es.Vector2 && compareKey instanceof es.Vector2 && r.value.equals(compareKey))
                    return true;
                else if (r.value == compareKey)
                    return true;
            }
            return false;
        };
        AStarPathfinder.getKey = function (map, compareKey) {
            var iterator = map.keys();
            var valueIterator = map.values();
            var r;
            var v;
            while (r = iterator.next(), v = valueIterator.next(), !r.done) {
                if (r.value instanceof es.Vector2 && compareKey instanceof es.Vector2 && r.value.equals(compareKey))
                    return v.value;
                else if (r.value == compareKey)
                    return v.value;
            }
            return null;
        };
        return AStarPathfinder;
    }());
    ai.AStarPathfinder = AStarPathfinder;
    var AStarNode = (function (_super) {
        __extends(AStarNode, _super);
        function AStarNode(data) {
            var _this = _super.call(this) || this;
            _this.data = data;
            return _this;
        }
        return AStarNode;
    }(ai.PriorityQueueNode));
})(ai || (ai = {}));
var ai;
(function (ai) {
    var AstarGridGraph = (function () {
        function AstarGridGraph(width, height) {
            this.dirs = [
                new es.Vector2(1, 0),
                new es.Vector2(0, -1),
                new es.Vector2(-1, 0),
                new es.Vector2(0, 1)
            ];
            this.walls = [];
            this.weightedNodes = [];
            this.defaultWeight = 1;
            this.weightedNodeWeight = 5;
            this._neighbors = new Array(4);
            this._width = width;
            this._height = height;
        }
        AstarGridGraph.prototype.isNodeInBounds = function (node) {
            return 0 <= node.x && node.x < this._width && 0 <= node.y && node.y < this._height;
        };
        AstarGridGraph.prototype.isNodePassable = function (node) {
            return !this.walls.firstOrDefault(function (wall) { return wall.equals(node); });
        };
        AstarGridGraph.prototype.search = function (start, goal) {
            return ai.AStarPathfinder.search(this, start, goal);
        };
        AstarGridGraph.prototype.getNeighbors = function (node) {
            var _this = this;
            this._neighbors.length = 0;
            this.dirs.forEach(function (dir) {
                var next = new es.Vector2(node.x + dir.x, node.y + dir.y);
                if (_this.isNodeInBounds(next) && _this.isNodePassable(next))
                    _this._neighbors.push(next);
            });
            return this._neighbors;
        };
        AstarGridGraph.prototype.cost = function (from, to) {
            return this.weightedNodes.find(function (p) { return p.equals(to); }) ? this.weightedNodeWeight : this.defaultWeight;
        };
        AstarGridGraph.prototype.heuristic = function (node, goal) {
            return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
        };
        return AstarGridGraph;
    }());
    ai.AstarGridGraph = AstarGridGraph;
})(ai || (ai = {}));
var ai;
(function (ai) {
    var PriorityQueue = (function () {
        function PriorityQueue(maxNodes) {
            this._numNodes = 0;
            this._nodes = new Array(maxNodes + 1);
            this._numNodesEverEnqueued = 0;
        }
        Object.defineProperty(PriorityQueue.prototype, "count", {
            get: function () {
                return this._numNodes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PriorityQueue.prototype, "maxSize", {
            get: function () {
                return this._nodes.length - 1;
            },
            enumerable: true,
            configurable: true
        });
        PriorityQueue.prototype.clear = function () {
            this._nodes.splice(1, this._numNodes);
            this._numNodes = 0;
        };
        PriorityQueue.prototype.contains = function (node) {
            if (!node) {
                console.error("node cannot be null");
                return false;
            }
            if (node.queueIndex < 0 || node.queueIndex >= this._nodes.length) {
                console.error("node.QueueIndex has been corrupted. Did you change it manually? Or add this node to another queue?");
                return false;
            }
            return (this._nodes[node.queueIndex] == node);
        };
        PriorityQueue.prototype.enqueue = function (node, priority) {
            node.priority = priority;
            this._numNodes++;
            this._nodes[this._numNodes] = node;
            node.queueIndex = this._numNodes;
            node.insertionIndex = this._numNodesEverEnqueued++;
            this.cascadeUp(this._nodes[this._numNodes]);
        };
        PriorityQueue.prototype.dequeue = function () {
            var returnMe = this._nodes[1];
            this.remove(returnMe);
            return returnMe;
        };
        PriorityQueue.prototype.remove = function (node) {
            if (node.queueIndex == this._numNodes) {
                this._nodes[this._numNodes] = null;
                this._numNodes--;
                return;
            }
            var formerLastNode = this._nodes[this._numNodes];
            this.swap(node, formerLastNode);
            delete this._nodes[this._numNodes];
            this._numNodes--;
            this.onNodeUpdated(formerLastNode);
        };
        PriorityQueue.prototype.isValidQueue = function () {
            for (var i = 1; i < this._nodes.length; i++) {
                if (this._nodes[i]) {
                    var childLeftIndex = 2 * i;
                    if (childLeftIndex < this._nodes.length && this._nodes[childLeftIndex] &&
                        this.hasHigherPriority(this._nodes[childLeftIndex], this._nodes[i]))
                        return false;
                    var childRightIndex = childLeftIndex + 1;
                    if (childRightIndex < this._nodes.length && this._nodes[childRightIndex] &&
                        this.hasHigherPriority(this._nodes[childRightIndex], this._nodes[i]))
                        return false;
                }
            }
            return true;
        };
        PriorityQueue.prototype.onNodeUpdated = function (node) {
            var parentIndex = Math.floor(node.queueIndex / 2);
            var parentNode = this._nodes[parentIndex];
            if (parentIndex > 0 && this.hasHigherPriority(node, parentNode)) {
                this.cascadeUp(node);
            }
            else {
                this.cascadeDown(node);
            }
        };
        PriorityQueue.prototype.cascadeDown = function (node) {
            var newParent;
            var finalQueueIndex = node.queueIndex;
            while (true) {
                newParent = node;
                var childLeftIndex = 2 * finalQueueIndex;
                if (childLeftIndex > this._numNodes) {
                    node.queueIndex = finalQueueIndex;
                    this._nodes[finalQueueIndex] = node;
                    break;
                }
                var childLeft = this._nodes[childLeftIndex];
                if (this.hasHigherPriority(childLeft, newParent)) {
                    newParent = childLeft;
                }
                var childRightIndex = childLeftIndex + 1;
                if (childRightIndex <= this._numNodes) {
                    var childRight = this._nodes[childRightIndex];
                    if (this.hasHigherPriority(childRight, newParent)) {
                        newParent = childRight;
                    }
                }
                if (newParent != node) {
                    this._nodes[finalQueueIndex] = newParent;
                    var temp = newParent.queueIndex;
                    newParent.queueIndex = finalQueueIndex;
                    finalQueueIndex = temp;
                }
                else {
                    node.queueIndex = finalQueueIndex;
                    this._nodes[finalQueueIndex] = node;
                    break;
                }
            }
        };
        PriorityQueue.prototype.cascadeUp = function (node) {
            var parent = Math.floor(node.queueIndex / 2);
            while (parent >= 1) {
                var parentNode = this._nodes[parent];
                if (this.hasHigherPriority(parentNode, node))
                    break;
                this.swap(node, parentNode);
                parent = Math.floor(node.queueIndex / 2);
            }
        };
        PriorityQueue.prototype.swap = function (node1, node2) {
            this._nodes[node1.queueIndex] = node2;
            this._nodes[node2.queueIndex] = node1;
            var temp = node1.queueIndex;
            node1.queueIndex = node2.queueIndex;
            node2.queueIndex = temp;
        };
        PriorityQueue.prototype.hasHigherPriority = function (higher, lower) {
            return (higher.priority < lower.priority ||
                (higher.priority == lower.priority && higher.insertionIndex < lower.insertionIndex));
        };
        return PriorityQueue;
    }());
    ai.PriorityQueue = PriorityQueue;
})(ai || (ai = {}));
var ai;
(function (ai) {
    var BreadthFirstPathfinder = (function () {
        function BreadthFirstPathfinder() {
        }
        BreadthFirstPathfinder.search = function (graph, start, goal) {
            var _this = this;
            var foundPath = false;
            var frontier = [];
            frontier.unshift(start);
            var cameFrom = new Map();
            cameFrom.set(start, start);
            var _loop_2 = function () {
                var current = frontier.shift();
                if (JSON.stringify(current) == JSON.stringify(goal)) {
                    foundPath = true;
                    return "break";
                }
                graph.getNeighbors(current).forEach(function (next) {
                    if (!_this.hasKey(cameFrom, next)) {
                        frontier.unshift(next);
                        cameFrom.set(next, current);
                    }
                });
            };
            while (frontier.length > 0) {
                var state_2 = _loop_2();
                if (state_2 === "break")
                    break;
            }
            return foundPath ? ai.AStarPathfinder.recontructPath(cameFrom, start, goal) : null;
        };
        BreadthFirstPathfinder.hasKey = function (map, compareKey) {
            var iterator = map.keys();
            var r;
            while (r = iterator.next(), !r.done) {
                if (JSON.stringify(r.value) == JSON.stringify(compareKey))
                    return true;
            }
            return false;
        };
        return BreadthFirstPathfinder;
    }());
    ai.BreadthFirstPathfinder = BreadthFirstPathfinder;
})(ai || (ai = {}));
var ai;
(function (ai) {
    var UnweightedGraph = (function () {
        function UnweightedGraph() {
            this.edges = new Map();
        }
        UnweightedGraph.prototype.addEdgesForNode = function (node, edges) {
            this.edges.set(node, edges);
            return this;
        };
        UnweightedGraph.prototype.getNeighbors = function (node) {
            return this.edges.get(node);
        };
        return UnweightedGraph;
    }());
    ai.UnweightedGraph = UnweightedGraph;
})(ai || (ai = {}));
var ai;
(function (ai) {
    var UnweightedGridGraph = (function () {
        function UnweightedGridGraph(width, height, allowDiagonalSearch) {
            if (allowDiagonalSearch === void 0) { allowDiagonalSearch = false; }
            this.walls = [];
            this._neighbors = new Array(4);
            this._width = width;
            this._hegiht = height;
            this._dirs = allowDiagonalSearch ? UnweightedGridGraph.COMPASS_DIRS : UnweightedGridGraph.CARDINAL_DIRS;
        }
        UnweightedGridGraph.prototype.isNodeInBounds = function (node) {
            return 0 <= node.x && node.x < this._width && 0 <= node.y && node.y < this._hegiht;
        };
        UnweightedGridGraph.prototype.isNodePassable = function (node) {
            return !this.walls.firstOrDefault(function (wall) { return JSON.stringify(wall) == JSON.stringify(node); });
        };
        UnweightedGridGraph.prototype.getNeighbors = function (node) {
            var _this = this;
            this._neighbors.length = 0;
            this._dirs.forEach(function (dir) {
                var next = new es.Vector2(node.x + dir.x, node.y + dir.y);
                if (_this.isNodeInBounds(next) && _this.isNodePassable(next))
                    _this._neighbors.push(next);
            });
            return this._neighbors;
        };
        UnweightedGridGraph.prototype.search = function (start, goal) {
            return ai.BreadthFirstPathfinder.search(this, start, goal);
        };
        UnweightedGridGraph.CARDINAL_DIRS = [
            new es.Vector2(1, 0),
            new es.Vector2(0, -1),
            new es.Vector2(-1, 0),
            new es.Vector2(0, -1)
        ];
        UnweightedGridGraph.COMPASS_DIRS = [
            new es.Vector2(1, 0),
            new es.Vector2(1, -1),
            new es.Vector2(0, -1),
            new es.Vector2(-1, -1),
            new es.Vector2(-1, 0),
            new es.Vector2(-1, 1),
            new es.Vector2(0, 1),
            new es.Vector2(1, 1),
        ];
        return UnweightedGridGraph;
    }());
    ai.UnweightedGridGraph = UnweightedGridGraph;
})(ai || (ai = {}));
var ai;
(function (ai) {
    var WeightedGridGraph = (function () {
        function WeightedGridGraph(width, height, allowDiagonalSearch) {
            if (allowDiagonalSearch === void 0) { allowDiagonalSearch = false; }
            this.walls = [];
            this.weightedNodes = [];
            this.defaultWeight = 1;
            this.weightedNodeWeight = 5;
            this._neighbors = new Array(4);
            this._width = width;
            this._height = height;
            this._dirs = allowDiagonalSearch ? WeightedGridGraph.COMPASS_DIRS : WeightedGridGraph.CARDINAL_DIRS;
        }
        WeightedGridGraph.prototype.isNodeInBounds = function (node) {
            return 0 <= node.x && node.x < this._width && 0 <= node.y && node.y < this._height;
        };
        WeightedGridGraph.prototype.isNodePassable = function (node) {
            return !this.walls.firstOrDefault(function (wall) { return JSON.stringify(wall) == JSON.stringify(node); });
        };
        WeightedGridGraph.prototype.search = function (start, goal) {
            return ai.WeightedPathfinder.search(this, start, goal);
        };
        WeightedGridGraph.prototype.getNeighbors = function (node) {
            var _this = this;
            this._neighbors.length = 0;
            this._dirs.forEach(function (dir) {
                var next = new es.Vector2(node.x + dir.x, node.y + dir.y);
                if (_this.isNodeInBounds(next) && _this.isNodePassable(next))
                    _this._neighbors.push(next);
            });
            return this._neighbors;
        };
        WeightedGridGraph.prototype.cost = function (from, to) {
            return this.weightedNodes.find(function (t) { return JSON.stringify(t) == JSON.stringify(to); }) ? this.weightedNodeWeight : this.defaultWeight;
        };
        WeightedGridGraph.CARDINAL_DIRS = [
            new es.Vector2(1, 0),
            new es.Vector2(0, -1),
            new es.Vector2(-1, 0),
            new es.Vector2(0, 1)
        ];
        WeightedGridGraph.COMPASS_DIRS = [
            new es.Vector2(1, 0),
            new es.Vector2(1, -1),
            new es.Vector2(0, -1),
            new es.Vector2(-1, -1),
            new es.Vector2(-1, 0),
            new es.Vector2(-1, 1),
            new es.Vector2(0, 1),
            new es.Vector2(1, 1),
        ];
        return WeightedGridGraph;
    }());
    ai.WeightedGridGraph = WeightedGridGraph;
})(ai || (ai = {}));
var ai;
(function (ai) {
    var WeightedNode = (function (_super) {
        __extends(WeightedNode, _super);
        function WeightedNode(data) {
            var _this = _super.call(this) || this;
            _this.data = data;
            return _this;
        }
        return WeightedNode;
    }(ai.PriorityQueueNode));
    ai.WeightedNode = WeightedNode;
    var WeightedPathfinder = (function () {
        function WeightedPathfinder() {
        }
        WeightedPathfinder.search = function (graph, start, goal) {
            var _this = this;
            var foundPath = false;
            var cameFrom = new Map();
            cameFrom.set(start, start);
            var costSoFar = new Map();
            var frontier = new ai.PriorityQueue(1000);
            frontier.enqueue(new WeightedNode(start), 0);
            costSoFar.set(start, 0);
            var _loop_3 = function () {
                var current = frontier.dequeue();
                if (JSON.stringify(current.data) == JSON.stringify(goal)) {
                    foundPath = true;
                    return "break";
                }
                graph.getNeighbors(current.data).forEach(function (next) {
                    var newCost = costSoFar.get(current.data) + graph.cost(current.data, next);
                    if (!_this.hasKey(costSoFar, next) || newCost < costSoFar.get(next)) {
                        costSoFar.set(next, newCost);
                        var priprity = newCost;
                        frontier.enqueue(new WeightedNode(next), priprity);
                        cameFrom.set(next, current.data);
                    }
                });
            };
            while (frontier.count > 0) {
                var state_3 = _loop_3();
                if (state_3 === "break")
                    break;
            }
            return foundPath ? this.recontructPath(cameFrom, start, goal) : null;
        };
        WeightedPathfinder.recontructPath = function (cameFrom, start, goal) {
            var path = [];
            var current = goal;
            path.push(goal);
            while (current != start) {
                current = this.getKey(cameFrom, current);
                path.push(current);
            }
            path.reverse();
            return path;
        };
        WeightedPathfinder.hasKey = function (map, compareKey) {
            var iterator = map.keys();
            var r;
            while (r = iterator.next(), !r.done) {
                if (JSON.stringify(r.value) == JSON.stringify(compareKey))
                    return true;
            }
            return false;
        };
        WeightedPathfinder.getKey = function (map, compareKey) {
            var iterator = map.keys();
            var valueIterator = map.values();
            var r;
            var v;
            while (r = iterator.next(), v = valueIterator.next(), !r.done) {
                if (JSON.stringify(r.value) == JSON.stringify(compareKey))
                    return v.value;
            }
            return null;
        };
        return WeightedPathfinder;
    }());
    ai.WeightedPathfinder = WeightedPathfinder;
})(ai || (ai = {}));
var ai;
(function (ai) {
    var AStarStorage = (function () {
        function AStarStorage() {
            this._opened = new Array(AStarStorage.MAX_NODES);
            this._closed = new Array(AStarStorage.MAX_NODES);
        }
        AStarStorage.prototype.clear = function () {
            for (var i = 0; i < this._numOpened; i++) {
                es.Pool.free(this._opened[i]);
                this._opened[i] = null;
            }
            for (var i = 0; i < this._numClosed; i++) {
                es.Pool.free(this._closed[i]);
                this._closed[i] = null;
            }
            this._numOpened = this._numClosed = 0;
            this._lastFoundClosed = this._lastFoundOpened = 0;
        };
        AStarStorage.prototype.findOpened = function (node) {
            for (var i = 0; i < this._numOpened; i++) {
                var care = node.worldState.dontCare ^ -1;
                if ((node.worldState.values & care) == (this._opened[i].worldState.values & care)) {
                    this._lastFoundClosed = i;
                    return this._closed[i];
                }
            }
            return null;
        };
        AStarStorage.prototype.findClosed = function (node) {
            for (var i = 0; i < this._numClosed; i++) {
                var care = node.worldState.dontCare ^ -1;
                if ((node.worldState.values & care) == (this._closed[i].worldState.values & care)) {
                    this._lastFoundClosed = i;
                    return this._closed[i];
                }
            }
            return null;
        };
        AStarStorage.prototype.hasOpened = function () {
            return this._numOpened > 0;
        };
        AStarStorage.prototype.removeOpened = function (node) {
            if (this._numOpened > 0)
                this._opened[this._lastFoundOpened] = this._opened[this._numOpened - 1];
            this._numOpened--;
        };
        AStarStorage.prototype.removeClosed = function (node) {
            if (this._numClosed > 0)
                this._closed[this._lastFoundClosed] = this._closed[this._numClosed - 1];
            this._numClosed--;
        };
        AStarStorage.prototype.isOpen = function (node) {
            return this._opened.indexOf(node) > -1;
        };
        AStarStorage.prototype.isClosed = function (node) {
            return this._closed.indexOf(node) > -1;
        };
        AStarStorage.prototype.addToOpenList = function (node) {
            this._opened[this._numOpened++] = node;
        };
        AStarStorage.prototype.addToClosedList = function (node) {
            this._closed[this._numClosed++] = node;
        };
        AStarStorage.prototype.removeCheapestOpenNode = function () {
            var lowestVal = Number.MAX_VALUE;
            this._lastFoundOpened = -1;
            for (var i = 0; i < this._numOpened; i++) {
                if (this._opened[i].costSoFarAndHeuristicCost < lowestVal) {
                    lowestVal = this._opened[i].costSoFarAndHeuristicCost;
                    this._lastFoundOpened = i;
                }
            }
            var val = this._opened[this._lastFoundOpened];
            this.removeOpened(val);
            return val;
        };
        AStarStorage.MAX_NODES = 128;
        return AStarStorage;
    }());
    ai.AStarStorage = AStarStorage;
})(ai || (ai = {}));
var ai;
(function (ai) {
    var AStarNode = (function () {
        function AStarNode() {
        }
        AStarNode.prototype.equals = function (other) {
            var care = this.worldState.dontCare ^ -1;
            return (this.worldState.values & care) == (other.worldState.values & care);
        };
        AStarNode.prototype.compareTo = function (other) {
            return this.costSoFarAndHeuristicCost - other.costSoFarAndHeuristicCost;
        };
        AStarNode.prototype.reset = function () {
            this.action = null;
            this.parent = null;
        };
        AStarNode.prototype.clone = function () {
            var node = new AStarNode();
            node.action = this.action;
            node.costSoFar = this.costSoFar;
            node.depth = this.depth;
            node.parent = this.parent;
            node.parentWorldState = this.parentWorldState;
            node.heuristicCost = this.heuristicCost;
            node.worldState = this.worldState;
            return node;
        };
        AStarNode.prototype.toString = function () {
            return "[cost: " + this.costSoFar + " | heuristic: " + this.heuristicCost + "]: " + this.action;
        };
        return AStarNode;
    }());
    ai.AStarNode = AStarNode;
    var AStar = (function () {
        function AStar() {
        }
        AStar.plan = function (ap, start, goal, selectedNodes) {
            if (selectedNodes === void 0) { selectedNodes = null; }
            this.storage.clear();
            var currentNode = es.Pool.obtain(AStarNode);
            currentNode.worldState = start;
            currentNode.parentWorldState = start;
            currentNode.costSoFar = 0;
            currentNode.heuristicCost = this.calculateHeuristic(start, goal);
            currentNode.costSoFarAndHeuristicCost = currentNode.costSoFar + currentNode.heuristicCost;
            currentNode.depth = 1;
            this.storage.addToOpenList(currentNode);
            while (true) {
                if (!this.storage.hasOpened()) {
                    this.storage.clear();
                    return null;
                }
                currentNode = this.storage.removeCheapestOpenNode();
                this.storage.addToClosedList(currentNode);
                if (goal.equals(currentNode.worldState)) {
                    var plan = this.reconstructPlan(currentNode, selectedNodes);
                    this.storage.clear();
                    return plan;
                }
                var neighbors = ap.getPossibleTransitions(currentNode.worldState);
                for (var i = 0; i < neighbors.length; i++) {
                    var cur = neighbors[i];
                    var opened = this.storage.findOpened(cur);
                    var closed_1 = this.storage.findClosed(cur);
                    var cost = currentNode.costSoFar + cur.costSoFar;
                    if (opened != null && cost < opened.costSoFar) {
                        this.storage.removeOpened(opened);
                        opened = null;
                    }
                    if (closed_1 != null && cost < closed_1.costSoFar) {
                        this.storage.removeClosed(closed_1);
                    }
                    if (opened == null && closed_1 == null) {
                        var nb = es.Pool.obtain(AStarNode);
                        nb.worldState = cur.worldState;
                        nb.costSoFar = cost;
                        nb.heuristicCost = this.calculateHeuristic(cur.worldState, goal);
                        nb.costSoFarAndHeuristicCost = nb.costSoFar + nb.heuristicCost;
                        nb.action = cur.action;
                        nb.parentWorldState = currentNode.worldState;
                        nb.parent = currentNode;
                        nb.depth = currentNode.depth + 1;
                        this.storage.addToOpenList(nb);
                    }
                }
                es.ListPool.free(neighbors);
            }
        };
        AStar.reconstructPlan = function (goalNode, selectedNodes) {
            var totalActionsInPlan = goalNode.depth - 1;
            var plan = new Array(totalActionsInPlan);
            var curnode = goalNode;
            for (var i = 0; i <= totalActionsInPlan - 1; i++) {
                if (selectedNodes != null)
                    selectedNodes.push(curnode.clone());
                plan.push(curnode.action);
                curnode = curnode.parent;
            }
            if (selectedNodes != null)
                selectedNodes.reverse();
            return plan;
        };
        AStar.calculateHeuristic = function (fr, to) {
            var care = (to.dontCare ^ -1);
            var diff = (fr.values & care) ^ (to.values & care);
            var dist = 0;
            for (var i = 0; i < ai.ActionPlanner.MAX_CONDITIONS; ++i)
                if ((diff & (1 << i)) != 0)
                    dist++;
            return dist;
        };
        AStar.storage = new ai.AStarStorage();
        return AStar;
    }());
    ai.AStar = AStar;
})(ai || (ai = {}));
var ai;
(function (ai) {
    var Action = (function () {
        function Action(name, cost) {
            if (cost === void 0) { cost = 1; }
            this.cost = 1;
            this._preConditions = new Set();
            this._postConditions = new Set();
            this.name = name;
            this.cost = cost;
        }
        Action.prototype.setPrecondition = function (conditionName, value) {
            this._preConditions.add([conditionName, value]);
        };
        Action.prototype.setPostcondition = function (conditionName, value) {
            this._preConditions.add([conditionName, value]);
        };
        Action.prototype.validate = function () {
            return true;
        };
        Action.prototype.toString = function () {
            return "[Action] " + this.name + " - cost: " + this.cost;
        };
        return Action;
    }());
    ai.Action = Action;
})(ai || (ai = {}));
var ai;
(function (ai) {
    var ActionPlanner = (function () {
        function ActionPlanner() {
            this.conditionNames = new Array(ActionPlanner.MAX_CONDITIONS);
            this._actions = [];
            this._viableActions = [];
            this._preConditions = new Array(ActionPlanner.MAX_CONDITIONS);
            this._postConditions = new Array(ActionPlanner.MAX_CONDITIONS);
            this._numConditionNames = 0;
            for (var i = 0; i < ActionPlanner.MAX_CONDITIONS; ++i) {
                this.conditionNames[i] = null;
                this._preConditions[i] = ai.WorldState.create(this);
                this._postConditions[i] = ai.WorldState.create(this);
            }
        }
        ActionPlanner.prototype.createWorldState = function () {
            return ai.WorldState.create(this);
        };
        ActionPlanner.prototype.addAction = function (action) {
            var _this = this;
            var actionId = this.findActionIndex(action);
            if (actionId == -1)
                throw new Error("无法找到或创建行动");
            action._preConditions.forEach(function (preCondition) {
                var conditionId = _this.findConditionNameIndex(preCondition[0]);
                if (conditionId == -1)
                    throw new Error("无法找到或创建条件名称");
                _this._preConditions[actionId].set(conditionId, preCondition[1]);
            });
            action._postConditions.forEach(function (postCondition) {
                var conditionId = _this.findConditionNameIndex(postCondition[0]);
                if (conditionId == -1)
                    throw new Error("找不到条件名称");
                _this._postConditions[actionId].set(conditionId, postCondition[1]);
            });
        };
        ActionPlanner.prototype.plan = function (startState, goalState, selectedNode) {
            if (selectedNode === void 0) { selectedNode = null; }
            this._viableActions.length = 0;
            for (var i = 0; i < this._actions.length; i++) {
                if (this._actions[i].validate())
                    this._viableActions.push(this._actions[i]);
            }
            return ai.AStar.plan(this, startState, goalState, selectedNode);
        };
        ActionPlanner.prototype.getPossibleTransitions = function (fr) {
            var result = es.ListPool.obtain();
            for (var i = 0; i < this._viableActions.length; ++i) {
                var pre = this._preConditions[i];
                var care = (pre.dontCare ^ -1);
                var met = ((pre.values & care) == (fr.values & care));
                if (met) {
                    var node = es.Pool.obtain(ai.AStarNode);
                    node.action = this._viableActions[i];
                    node.costSoFar = this._viableActions[i].cost;
                    node.worldState = this.applyPostConditions(this, i, fr);
                    result.push(node);
                }
            }
            return result;
        };
        ActionPlanner.prototype.applyPostConditions = function (ap, actionnr, fr) {
            var pst = ap._postConditions[actionnr];
            var unaffected = pst.dontCare;
            var affected = (unaffected ^ -1);
            fr.values = (fr.values & unaffected) | (pst.values & affected);
            fr.dontCare &= pst.dontCare;
            return fr;
        };
        ActionPlanner.prototype.findConditionNameIndex = function (conditionName) {
            var idx;
            for (idx = 0; idx < this._numConditionNames; ++idx) {
                if (this.conditionNames[idx] == conditionName)
                    return idx;
            }
            if (idx < ActionPlanner.MAX_CONDITIONS - 1) {
                this.conditionNames[idx] = conditionName;
                this._numConditionNames++;
                return idx;
            }
            return -1;
        };
        ActionPlanner.prototype.findActionIndex = function (action) {
            var idx = this._actions.indexOf(action);
            if (idx > -1)
                return idx;
            this._actions.push(action);
            return this._actions.length - 1;
        };
        ActionPlanner.MAX_CONDITIONS = 64;
        return ActionPlanner;
    }());
    ai.ActionPlanner = ActionPlanner;
})(ai || (ai = {}));
var ai;
(function (ai) {
    var Agent = (function () {
        function Agent() {
            this._planner = new ai.ActionPlanner();
        }
        Agent.prototype.plan = function (debugPlan) {
            if (debugPlan === void 0) { debugPlan = false; }
            var nodes = null;
            if (debugPlan)
                nodes = [];
            this.actions = this._planner.plan(this.getWorldState(), this.getGoalState(), nodes);
            if (nodes != null && nodes.length > 0) {
                console.log("---- ActionPlanner plan ----");
                console.log("plan cost = " + nodes[nodes.length - 1].costSoFar);
                console.log("               start" + "\t" + this.getWorldState().describe(this._planner));
                for (var i = 0; i < nodes.length; i++) {
                    console.log(i + ": " + nodes[i].action.name + "\t" + nodes[i].worldState.describe(this._planner));
                    es.Pool.free(nodes[i]);
                }
            }
            return this.hasActionPlan();
        };
        Agent.prototype.hasActionPlan = function () {
            return this.actions != null && this.actions.length > 0;
        };
        return Agent;
    }());
    ai.Agent = Agent;
})(ai || (ai = {}));
var ai;
(function (ai) {
    var WorldState = (function () {
        function WorldState(planner, values, dontcare) {
            this.planner = planner;
            this.values = values;
            this.dontCare = dontcare;
        }
        WorldState.create = function (planner) {
            return new WorldState(planner, 0, -1);
        };
        WorldState.prototype.set = function (conditionId, value) {
            if (typeof conditionId == "string") {
                return this.set(this.planner.findConditionNameIndex(conditionId), value);
            }
            this.values = value ? (this.values | (1 << conditionId)) : (this.values & ~(1 << conditionId));
            this.dontCare ^= (1 << conditionId);
            return true;
        };
        WorldState.prototype.equals = function (other) {
            var care = this.dontCare ^ -1;
            return (this.values & care) == (other.values & care);
        };
        WorldState.prototype.describe = function (planner) {
            var s = "";
            for (var i = 0; i < ai.ActionPlanner.MAX_CONDITIONS; i++) {
                if ((this.dontCare & (1 << i)) == 0) {
                    var val = planner.conditionNames[i];
                    if (val == null)
                        continue;
                    var set = ((this.values & (1 << i)) != 0);
                    if (s.length > 0)
                        s += ", ";
                    s += (set ? val.toUpperCase() : val);
                }
            }
            return s;
        };
        return WorldState;
    }());
    ai.WorldState = WorldState;
})(ai || (ai = {}));
