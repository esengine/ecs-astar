module ai {
    /**
     * 计算路径给定的IUnweightedGraph和开始/目标位置
     */
    export class BreadthFirstPathfinder {
        public static search<T>(graph: IUnweightedGraph<T>, start: T, goal: T, cameFrom: Map<T, T> = new Map<T, T>()): boolean {
            let foundPath = false;
            let frontier = [];
            frontier.unshift(start);

            cameFrom.set(start, start);

            while (frontier.length > 0) {
                let current = frontier.shift();
                if (current.equals(goal)) {
                    foundPath = true;
                    break;
                }

                graph.getNeighbors(current).forEach(next => {
                    if (!cameFrom.has(next)) {
                        frontier.unshift(next);
                        cameFrom.set(next, current);
                    }
                });
            }

            return foundPath;
        }

        public static searchR<T>(graph: IUnweightedGraph<T>, start: T, goal: T){
            let cameFrom: Map<T, T> = new Map<T, T>();
            let foundPath = this.search(graph, start, goal, cameFrom);
            return foundPath ? AStarPathfinder.recontructPath(cameFrom, start, goal) : null;
        }
    }
}
