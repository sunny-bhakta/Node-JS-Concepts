import { EventEmitter } from "events";
import * as v8 from "v8";

export class MemoryMonitor extends EventEmitter {
    private intervalId: NodeJS.Timeout | null = null;
    private thresholdPercentage: number;

    constructor(thresholdPercentage: number = 80) {
        super();
        this.thresholdPercentage = thresholdPercentage;
    }

    private getMemoryStats() {
        const status = v8.getHeapStatistics();
        const usedHeap = status.used_heap_size;
        const totalHeap = status.total_heap_size;
        const usedPercentage = (usedHeap / totalHeap) * 100;
        return { usedHeap, totalHeap, usedPercentage };
    }

    start(intervalMs: number = 5000) {
        if (this.intervalId) return; // Already running

        this.intervalId = setInterval(() => {
            const stats = this.getMemoryStats();
            this.emit("memoryStats", stats);
            if (stats.usedPercentage > this.thresholdPercentage) {
                this.emit("highMemoryUsage", stats);
            }
        }, intervalMs);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}