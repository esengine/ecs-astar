module ai {
    /**
     * 基本静态网格图与A*一起使用
     * 将walls添加到walls HashSet，并将加权节点添加到weightedNodes
     */
    export class AstarGridGraph implements IAstarGraph<es.Vector2> {
        public dirs: es.Vector2[] = [
            new es.Vector2(1, 0),
            new es.Vector2(0, -1),
            new es.Vector2(-1, 0),
            new es.Vector2(0, 1)
        ];

        public walls: es.Vector2[] = [];
        public weightedNodes: es.Vector2[] = [];
        public defaultWeight: number = 1;
        public weightedNodeWeight = 5;

        private _width;
        private _height;
        private _neighbors: es.Vector2[] = new Array(4);

        constructor(width: number, height: number) {
            this._width = width;
            this._height = height;
        }

        /**
         * 确保节点在网格图的边界内
         * @param node
         */
        public isNodeInBounds(node: es.Vector2): boolean {
            return 0 <= node.x && node.x < this._width && 0 <= node.y && node.y < this._height;
        }

        /**
         * 检查节点是否可以通过。walls是不可逾越的。
         * @param node
         */
        public isNodePassable(node: es.Vector2): boolean {
            return !new es.List(this.walls).firstOrDefault(wall => wall.equals(node));
        }

        /**
         * 调用AStarPathfinder.search的快捷方式
         * @param start
         * @param goal
         */
        public search(start: es.Vector2, goal: es.Vector2) {
            return AStarPathfinder.search(this, start, goal);
        }

        public getNeighbors(node: es.Vector2): es.Vector2[] {
            this._neighbors.length = 0;

            this.dirs.forEach(dir => {
                let next = new es.Vector2(node.x + dir.x, node.y + dir.y);
                if (this.isNodeInBounds(next) && this.isNodePassable(next))
                    this._neighbors.push(next);
            });

            return this._neighbors;
        }

        public cost(from: es.Vector2, to: es.Vector2): number {
            return this.weightedNodes.find((p) => p.equals(to)) ? this.weightedNodeWeight : this.defaultWeight;
        }

        public heuristic(node: es.Vector2, goal: es.Vector2) {
            return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
        }

    }
}
