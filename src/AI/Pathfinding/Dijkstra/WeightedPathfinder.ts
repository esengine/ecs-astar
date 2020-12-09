module ai {
    export class WeightedNode<T> extends PriorityQueueNode {
        public data: T;

        constructor(data: T) {
            super();
            this.data = data;
        }
    }

    export class WeightedPathfinder {
        public static search<T>(graph: IWeightedGraph<T>, start: T, goal: T, cameFrom: Map<T, T> = new Map<T, T>()) {
            let foundPath = false;

            cameFrom.set(start, start);

            let costSoFar = new Map<T, number>();
            let frontier = new PriorityQueue<WeightedNode<T>>(1000);
            frontier.enqueue(new WeightedNode<T>(start), 0);

            costSoFar.set(start, 0);

            while (frontier.count > 0) {
                let current = frontier.dequeue();

                if (current.data["equals"](goal)) {
                    foundPath = true;
                    break;
                }

                graph.getNeighbors(current.data).forEach(next => {
                    let newCost = costSoFar.get(current.data) + graph.cost(current.data, next);
                    if (!costSoFar.has(next) || newCost < costSoFar.get(next)) {
                        costSoFar.set(next, newCost);
                        let priprity = newCost;
                        frontier.enqueue(new WeightedNode<T>(next), priprity);
                        cameFrom.set(next, current.data);
                    }
                });
            }

            return foundPath;
        }

        /**
         * 获取从起点到目标的路径。如果没有找到路径，则返回null。
         * @param graph 
         * @param start 
         * @param goal 
         */
        public static searchR<T>(graph: IWeightedGraph<T>, start: T, goal: T) {
            let cameFrom: Map<T, T> = new Map<T, T>();
            let foundPath = this.search(graph, start, goal, cameFrom);

            return foundPath ? this.recontructPath(cameFrom, start, goal) : null;
        }

        /**
         * 从 cameFrom 字典中重构一个路径
         * @param cameFrom 
         * @param start 
         * @param goal 
         */
        public static recontructPath<T>(cameFrom: Map<T, T>, start: T, goal: T): T[] {
            let path = [];
            let current = goal;
            path.push(goal);

            while (!current["equals"](start)) {
                current = cameFrom.get(current);
                path.push(current);
            }

            path.reverse();

            return path;
        }
    }
}
