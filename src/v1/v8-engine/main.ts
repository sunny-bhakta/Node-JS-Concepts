import { MemoryMonitor } from "./memory-monitor.ts";

const monitor = new MemoryMonitor(75); // Alert if memory usage exceeds 75%

monitor.on("memoryStats", ({ stats }) => {
    console.log(
        `[MemoryStats] Used: ${stats.usedMB.toFixed(2)}MB / Limit: ${stats.limitMB.toFixed(2)}MB (${stats.usedPercent.toFixed(1)}%)`
    );
});

monitor.on("highMemoryUsage", ({ stats }) => {
    console.warn(
        `🚨 High memory usage detected! Used ${stats.usedPercent.toFixed(1)}% of heap limit (${stats.usedMB.toFixed(2)}MB). Consider restarting or investigating.`
    );
    // Could add email alerts, auto-restart logic, etc
});

console.log("[MemoryMonitor] Monitoring started");

const leak: any[] = [];

// Simulate a memory leak for demonstration
setInterval(() => {
    for (let i = 0; i < 10000; i++) {
        leak.push({ time: Date.now(), data: new Array(100).fill('leak') });
    }
    console.log(`[Simulated]  leak growth: ${leak.length} items.`);
}, 10000); // Log every 10 seconds
