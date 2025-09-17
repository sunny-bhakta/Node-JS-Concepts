// Import required modules
import { fork, spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

// Generate an array of 10 objects with random values
function generateBigData(count: number) {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        value: Math.random() * 100,
    }));
}

// Fork a child process to run parser.ts as a separate Node.js process
function forkChildProcess(scriptPath: string) {
    return fork(scriptPath);
}

// Send a message to the child process to start parsing
function sendDataToChild(child: any, data: any) {
    child.send({
        action: "parse",
        payload: data,
    });
}

// Listen for messages from the child process
function handleChildMessages(child: any) {
    child.on("message", (msg: any) => {
        if (msg?.status === "done") {
            // Log the result if parsing was successful
            console.log("[ Main ]: Received from child:", msg);
        } else if (msg?.status === "error") {
            // Log the error if parsing failed
            console.error("[ Main ]: Error from child:", msg.error);
        }
    });
}

// Listen for the child process exit event
function handleChildExit(child: any) {
    child.on("exit", (code: any) => {
        console.log("[ Main ]: Child process exited with code:", code);
    });
}

// Main feature: run parser child process and handle communication
function forkDemo() {
    console.log("[ Main ]: Child Process");
    const fileName = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(fileName);
    console.log("[ Main ]: Forking child process to run:", fileName);

    const bigData = generateBigData(10);
    const child = forkChildProcess(path.join(__dirname, "parser.ts"));
    sendDataToChild(child, bigData);
    handleChildMessages(child);
    handleChildExit(child);
}

/**
 * Spawns a child process to list files in a directory using the system shell.
 * Uses 'dir' on Windows and 'ls -lh' on Unix-like systems.
 * Logs stdout and stderr from the child process.
 */
function spawnDemo(dir: string) {
    // Choose the command and arguments based on the OS
    const isWin = os.platform() === "win32";
    const command = isWin ? "cmd" : "ls";
    const args: any = isWin ? ["/c", "dir", dir] : ["-lh", dir];
    const child = spawn(command, args);

    console.log(`[ Main ]: Listing files in directory: ${dir}`);

    // Listen for stdout data from the child process
    child.stdout.on("data", (data) => {
        console.log(`[ Main ]: stdout: ${data.toString()}`);
    });

    // Listen for stderr data from the child process
    child.stderr.on("data", (data) => {
        console.error(`[ Main ]: stderr: ${data.toString()}`);
    });

    // Listen for the child process to exit
    child.on("close", (code) => {
        console.log(`[ Main ]: Child process exited with code ${code}`);
    });

    // Listen for errors starting the child process
    child.on("error", (err) => {
        console.error("[ Main ]: Failed to start child process.", err);
    });
}

function processDemo() {
    // Basic Process Information
    console.log("Process ID:", process.pid);
    console.log("Node.js Version:", process.version);
    console.log("Platform:", process.platform);
    console.log("Current Working Directory:", process.cwd());
    console.log("Uptime (seconds):", process.uptime());

    // Memory usage details
    console.log("Memory Usage:", process.memoryUsage());

    // Contains environment variables
    console.log("Environment Variables:", process.env.OS);

    // Graceful Shutdown
    // SIGINT is sent when you press ( Ctrl+C ) in the terminal to interrupt a process.
    process.on("SIGINT", () => {
        console.log("Received SIGINT. Exiting gracefully...");
        process.exit(0);
    });

    // SIGTERM is sent by the OS or process managers (like Docker, Kubernetes, PM2) to request a process to terminate gracefully
    process.on("SIGTERM", () => {
        console.log("Received SIGTERM. Exiting gracefully...");
        process.exit(0);
    });

    // Uncaught Exception Handler
    process.on("uncaughtException", (err) => {
        console.error("Uncaught Exception:", err);
        process.exit(1); // Exit with failure
    });

    // Unhandled Promise Rejection Handler
    process.on("unhandledRejection", (reason, promise) => {
        console.error("Unhandled Rejection at:", promise, "reason:", reason);
        process.exit(1); // Exit with failure
    });

    // Access command-line arguments
    // const readArgs = process.argv;

    // process.exit(0); // Exit the process after logging info
    // process.exit(1); // Exit with failure
    // process.exitCode = 0; // Set exit code without exiting immediately
    // process.exitCode = 1; // Set exit code to indicate failure
}


// ================= output: ======================

// Run the spawn demo: lists files in the current directory using a child process
// spawnDemo(".");

// Run the fork demo: forks a child process to parse data and handle communication
// forkDemo();

// Run the process demo: logs various process information and sets up signal handlers
processDemo();
