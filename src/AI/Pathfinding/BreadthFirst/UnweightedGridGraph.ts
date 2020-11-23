module ai {
    /**
     * 基本的未加权网格图形用于BreadthFirstPathfinder
     */
    export class UnweightedGridGraph implements IUnweightedGraph<es.Vector2> {
        private static readonly CARDINAL_DIRS: es.Vector2[] = [
            new es.Vector2(1, 0),
            new es.Vector2(0, -1),
            new es.Vector2(-1, 0),
            new es.Vector2(0, -1)
        ];

        private static readonly COMPASS_DIRS = [
            new es.Vector2(1, 0),
            new es.Vector2(1, -1),
            new es.Vector2(0, -1),
            new es.Vector2(-1, -1),
            new es.Vector2(-1, 0),
            new es.Vector2(-1, 1),
            new es.Vector2(0, 1),
            new es.Vector2(1, 1),
        ];

        public walls: es.Vector2[] = [];

        private _width: number;
        private _hegiht: number;

        private _dirs: es.Vector2[];
        private _neighbors: es.Vector2[] = new Array(4);

        constructor(width: number, height: number, allowDiagonalSearch: boolean = false) {
            this._width = width;
            this._hegiht = height;
            this._dirs = allowDiagonalSearch ? UnweightedGridGraph.COMPASS_DIRS : UnweightedGridGraph.CARDINAL_DIRS;
        }

        public isNodeInBounds(node: es.Vector2): boolean {
            return 0 <= node.x && node.x < this._width && 0 <= node.y && node.y < this._hegiht;
        }

        public isNodePassable(node: es.Vector2): boolean {
            return !this.walls.firstOrDefault(wall => JSON.stringify(wall) == JSON.stringify(node));
        }

        public getNeighbors(node: es.Vector2) {
            this._neighbors.length = 0;

            this._dirs.forEach(dir => {
                let next = new es.Vector2(node.x + dir.x, node.y + dir.y);
                if (this.isNodeInBounds(next) && this.isNodePassable(next))
                    this._neighbors.push(next);
            });

            return this._neighbors;
        }

        public search(start: es.Vector2, goal: es.Vector2): es.Vector2[] {
            return BreadthFirstPathfinder.search(this, start, goal);
        }
    }
}
