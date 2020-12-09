///<reference path="./PriorityQueueNode.ts" />
module ai {
    /**
     * 计算路径给定的IAstarGraph和开始/目标位置
     */
    export class AStarPathfinder {
        /**
         * 尽可能从开始到目标找到一条路径。如果没有找到路径，则返回null。
         * @param graph
         * @param start
         * @param goal
         */
        public static search<T>(graph: IAstarGraph<T>, start: T, goal: T, cameFrom: Map<T, T> = new Map<T, T>()) {
            let foundPath = false;
            cameFrom.set(start, start);

            let costSoFar = new Map<T, number>();
            let frontier = new PriorityQueue<AStarNode<T>>(1000);
            frontier.enqueue(new AStarNode<T>(start), 0);

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
                        let priority = newCost + graph.heuristic(next, goal);
                        frontier.enqueue(new AStarNode<T>(next), priority);
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
        public static searchR<T>(graph: IAstarGraph<T>, start: T, goal: T) {
            let cameFrom: Map<T, T> = new Map<T, T>();
            let foundPath = this.search(graph, start, goal, cameFrom);

            return foundPath ? this.recontructPath(cameFrom, start, goal) : null;
        }

        /**
         * 从cameFrom字典重新构造路径
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

    /**
     * 使用PriorityQueue需要的额外字段将原始数据封装在一个小类中
     */
    class AStarNode<T> extends PriorityQueueNode {
        public data: T;

        constructor(data: T) {
            super();
            this.data = data;
        }
    }
}
