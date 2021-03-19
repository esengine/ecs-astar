module ai {
    /**
     * 计算路径给定的IUnweightedGraph和开始/目标位置
     */
    export class BreadthFirstPathfinder {
        public static search<T extends es.Vector2>(graph: IUnweightedGraph<T>, start: T, goal: T, cameFrom: Map<string, T> = new Map<string, T>()): boolean {
            let foundPath = false;
            let frontier = [];
            frontier.unshift(start);

            cameFrom.set(`${start.x}_${start.y}`, start);

            while (frontier.length > 0) {
                let current = frontier.shift();
                if (current.equals(goal)) {
                    foundPath = true;
                    break;
                }

                graph.getNeighbors(current).forEach(next => {
                    if (!cameFrom.has(`${start.x}_${start.y}`)) {
                        frontier.unshift(next);
                        cameFrom.set(`${start.x}_${start.y}`, current);
                    }
                });
            }

            return foundPath;
        }

        public static searchR<T extends es.Vector2>(graph: IUnweightedGraph<T>, start: T, goal: T){
            let cameFrom: Map<string, T> = new Map<string, T>();
            let foundPath = this.search(graph, start, goal, cameFrom);
            return foundPath ? AStarPathfinder.recontructPath(cameFrom, start, goal) : null;
        }
    }
}
