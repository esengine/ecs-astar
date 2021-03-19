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
        public static search<T extends es.Vector2>(graph: IAstarGraph<T>, start: T, goal: T, cameFrom: Map<string, T> = new Map<string, T>()) {
            let foundPath = false;
            const startKey = `${start.x}_${start.y}`;
            cameFrom.set(startKey, start);

            let costSoFar = new Map<string, number>();
            let frontier = new PriorityQueue<AStarNode<T>>(1000);
            frontier.enqueue(new AStarNode<T>(start), 0);

            costSoFar.set(startKey, 0);

            while (frontier.count > 0) {
                let current = frontier.dequeue();

                if (current.data.equals(goal)) {
                    foundPath = true;
                    break;
                }

                graph.getNeighbors(current.data).forEach(next => {
                    let newCost = costSoFar.get(`${current.data.x}_${current.data.y}`) + graph.cost(current.data, next);
                    const nextKey = `${next.x}_${next.y}`;
                    if (!costSoFar.has(nextKey) || newCost < costSoFar.get(nextKey)) {
                        costSoFar.set(nextKey, newCost);
                        let priority = newCost + graph.heuristic(next, goal);
                        frontier.enqueue(new AStarNode<T>(next), priority);
                        cameFrom.set(`${next.x}_${next.y}`, current.data);
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
        public static searchR<T extends es.Vector2>(graph: IAstarGraph<T>, start: T, goal: T) {
            let cameFrom: Map<string, T> = new Map<string, T>();
            let foundPath = this.search(graph, start, goal, cameFrom);

            return foundPath ? this.recontructPath(cameFrom, start, goal) : null;
        }

        /**
         * 从cameFrom字典重新构造路径
         * @param cameFrom
         * @param start
         * @param goal
         */
        public static recontructPath<T extends es.Vector2>(cameFrom: Map<string, T>, start: T, goal: T): T[] {
            let path = [];
            let current = goal.clone();
            path.push(goal);

            while (current && !current.equals(start)) {
                current = cameFrom.get(`${current.x}_${current.y}`);
                path.push(current);
            }

            path.reverse();

            return path;
        }
    }

    /**
     * 使用PriorityQueue需要的额外字段将原始数据封装在一个小类中
     */
    class AStarNode<T extends es.Vector2> extends PriorityQueueNode {
        public data: T;

        constructor(data: T) {
            super();
            this.data = data;
        }
    }
}
