
// Import worker thread utilities from Node.js
import { isMainThread, workerData, parentPort } from "worker_threads";


// Recursive function to calculate factorial
const factorial = (n: number): number => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
};


// Ensure this script is only run as a worker, not as the main thread
if (isMainThread) {
    throw new Error(
        "[Worker Thread]: This script is meant to be run as a worker thread."
    );
}


// Log the data received from the parent thread
console.log("[Worker Thread]: Worker thread started with data:", workerData);
const result = factorial(workerData.number);


// Send the result back to the parent thread
parentPort?.postMessage({
    message: "Factorial computed for " + workerData.name,
    factorial: result,
});


// Listen for messages from the parent thread
parentPort?.on("message", (msg) => {
    console.log("[Worker Thread]: Received message from parent:", msg);

    // Optionally, send a response back to the parent
    parentPort?.postMessage({ response: "Bye Bye from worker thread!" });
});
