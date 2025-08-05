/**
 * 优先队列实现
 * 使用二叉堆数据结构，时间复杂度：插入O(log n)，删除O(log n)
 */
export interface IPriorityQueueNode {
    priority: number;
}

export class PriorityQueue<T extends IPriorityQueueNode> {
    private _heap: T[] = [];
    private _size = 0;

    /**
     * 队列中元素的数量
     */
    get size(): number {
        return this._size;
    }

    /**
     * 队列是否为空
     */
    get isEmpty(): boolean {
        return this._size === 0;
    }

    /**
     * 清空队列
     */
    clear(): void {
        this._heap.length = 0;
        this._size = 0;
    }

    /**
     * 入队
     * @param item 要插入的元素
     */
    enqueue(item: T): void {
        this._heap[this._size] = item;
        this._bubbleUp(this._size);
        this._size++;
    }

    /**
     * 出队，返回优先级最高（值最小）的元素
     */
    dequeue(): T | undefined {
        if (this._size === 0) {
            return undefined;
        }

        const result = this._heap[0];
        this._size--;
        
        if (this._size > 0) {
            this._heap[0] = this._heap[this._size];
            this._bubbleDown(0);
        }

        return result;
    }

    /**
     * 查看队首元素但不移除
     */
    peek(): T | undefined {
        return this._size > 0 ? this._heap[0] : undefined;
    }

    /**
     * 向上冒泡
     */
    private _bubbleUp(index: number): void {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this._heap[index].priority >= this._heap[parentIndex].priority) {
                break;
            }
            this._swap(index, parentIndex);
            index = parentIndex;
        }
    }

    /**
     * 向下冒泡
     */
    private _bubbleDown(index: number): void {
        while (true) {
            let minIndex = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

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
    }

    /**
     * 交换两个元素
     */
    private _swap(i: number, j: number): void {
        const temp = this._heap[i];
        this._heap[i] = this._heap[j];
        this._heap[j] = temp;
    }
} 