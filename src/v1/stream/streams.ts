import { createReadStream, createWriteStream } from "fs";
import { dirname, join } from "path";
import { Duplex, Readable, Transform, Writable } from "stream";
import { fileURLToPath } from "url";
import { randomBytes } from "crypto";

const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);

const filePath = join(__dirname, "file.txt");

// 1. Readable Stream (from file)
// Reads a file and logs chunk sizes and stream events. Demonstrates basic readable stream usage.
function exampleReadableStream() {
    const readStream = createReadStream(filePath);
    readStream.on("data", (chunk) => {
        console.log(`ReadStream received ${chunk.length} bytes.`);
    });
    readStream.on("end", () => {
        console.log("Finished reading file.");
    });
    readStream.on("close", () => {
        console.log("ReadStream closed.");
    });
    readStream.on("error", (err) => {
        console.error("Error reading file:", err);
    });
}

// 2. Transform Stream (uppercase)
// Reads a file, transforms its content to uppercase, and writes to a new file. Shows how to use a transform stream for data processing.
function exampleTransformStream() {
    const readStream = createReadStream(filePath);
    const transformStream = new Transform({
        transform(chunk, encoding, callback) {
            this.push(chunk.toString().toUpperCase());
            callback();
        }
    });
    const writeStream = createWriteStream(join(__dirname, "output.txt"));
    readStream.pipe(transformStream).pipe(writeStream).on("finish", () => {
        console.log("Transformed file written to output.txt");
    });
}

// 3. Writable Stream (collect result)
// Demonstrates piping a readable through a transform and collecting the result in a writable. Collects transformed data into a string.
function exampleWritableStream() {
    const readableStream = Readable.from([
        "Hello, ",
        "this ",
        "is ",
        "a ",
        "readable ",
        "stream.\n"
    ]);
    const transformStream = new Transform({
        transform(chunk, encoding, callback) {
            this.push(chunk.toString().toUpperCase());
            callback();
        }
    });
    let result = "";
    const writeStream = new Writable({
        write(chunk, encoding, callback) {
            result += chunk.toString();
            callback();
        }
    });
    readableStream.pipe(transformStream).pipe(writeStream).on("finish", () => {
        console.log("Transformed Result:", result);
    });
}

// 4. Duplex Stream (echo)
// Custom duplex stream: writes are stored, reads return stored data in order. Duplex streams are both readable and writable.
function exampleDuplexStream() {
    class MyDuplex extends Duplex {
        private data: string[];
        constructor() {
            super();
            this.data = [];
        }
        _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
            console.log("Writing:", chunk.toString());
            this.data.push(chunk.toString());
            callback();
        }
        _read(size: number): void {
            if (this.data.length === 0) {
                this.push(null); // No more data
            } else {
                const chunk = this.data.shift();
                this.push(chunk);
            }
        }
    }
    const myDuplex = new MyDuplex();
    myDuplex.on("data", (chunk) => {
        console.log("Read:", chunk.toString());
    });
    myDuplex.write("Hello, ");
    myDuplex.write("this is a duplex stream.\n");
    myDuplex.end();
}

// 5. Custom Readable and Writable Streams
// Shows how to implement and use custom Readable and Writable streams. CustomReadable emits predefined strings, CustomWritable logs them.
function exampleCustomStreams() {
    class CustomReadable extends Readable {
        private data: string[];
        constructor(data: string[]) {
            super();
            this.data = data;
        }
        _read(): void {
            if (this.data.length === 0) {
                this.push(null);
            } else {
                this.push(this.data.shift());
            }
        }
    }
    class CustomWritable extends Writable {
        _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
            console.log("CustomWritable received:", chunk.toString(), "\n");
            callback();
        }
    }
    const customReadable = new CustomReadable([
        "Hello ",
        "from ",
        "Custom ",
        "Readable!\n"
    ]);
    const customWritable = new CustomWritable();
    customReadable.pipe(customWritable).on("finish", () => {
        console.log("Finished writing to CustomWritable");
    });
}

// 6. Error and stderr example
// Demonstrates writing an error message to stderr using a stream. Useful for separating error output from normal output.
function exampleErrorStream() {
    const errorStream = Readable.from(["[ERROR] File not found!\n"]);
    errorStream.pipe(process.stderr);
}

// 7. Manual backpressure with drain
// Writes many chunks to a file, using the 'drain' event to handle backpressure manually. Shows how to avoid memory overload when writing lots of data.
function exampleBackpressure() {
    const bigWriteStream = createWriteStream(join(__dirname, "big-output.txt"));
    let i = 0;
    const total = 1e5; // 100,000 writes
    function writeMany() {
        let ok = true;
        while (i < total && ok) {
            const chunk = randomBytes(1024); // 1KB chunk
            ok = bigWriteStream.write(chunk);
            i++;
        }
        if (i < total) {
            bigWriteStream.once("drain", writeMany);
        } else {
            bigWriteStream.end();
            console.log("All data written with manual backpressure handling.");
        }
    }
    writeMany();
}

// --- Run all examples ---
exampleReadableStream();
exampleTransformStream();
exampleWritableStream();
exampleDuplexStream();
exampleCustomStreams();
exampleErrorStream();
exampleBackpressure();