
// Main thread script to demonstrate usage of Node.js worker threads with TypeScript
import { isMainThread, Worker } from "worker_threads";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


// Get current file and directory names
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the worker script (TypeScript file)
const workerPath = join(__dirname, 'worker.ts');


if (isMainThread) {
    // This block runs in the main thread
    console.log("[Main Thread]: Starting worker thread...");

    // Create a new worker thread, passing data to it
    const worker = new Worker(workerPath, {
        workerData: {
            name: "Alice",
            number: 5,
        },
    });

    // Listen for messages from the worker
    worker.on("message", (msg) => {
        console.log("[Main Thread]: Received from worker:", msg);
    });

    // Listen for errors from the worker
    worker.on("error", (err) => {
        console.error("[Main Thread]: Worker error:", err);
    });

    // Listen for worker exit event
    worker.on("exit", (code) => {
        console.log("[Main Thread]: Worker exited with code:", code);
    });

    // Send a message to the worker
    worker.postMessage("Hello from main thread!");

} else {
    // This block should never run in the worker
    console.error("This file is meant to be run as from main thread.");
}

/*
Expected output:
[Main Thread]: Starting worker thread...
[Worker Thread]: Worker thread started with data: { name: 'Alice', number: 5 }
[Worker Thread]: Received message from parent: Hello from main thread!
[Main Thread]: Received from worker: { message: 'Factorial computed for Alice', factorial: 120 }
[Main Thread]: Received from worker: { response: 'Bye Bye from worker thread!' }
*/
