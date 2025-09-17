import fs from 'fs';
import { fileURLToPath } from 'url';

// Read file as buffer and write to another file
const readWriteBufferToFile = () => {
    const inputFilePath = fileURLToPath(new URL('./input.txt', import.meta.url));
    const outputFilePath = fileURLToPath(new URL('./output.txt', import.meta.url));

    fs.readFile(inputFilePath, (err, data) => {
        if (err) throw err;
        console.log('File data as Buffer:', data);
        console.log('File data as String:', data.toString('utf-8'));

        fs.writeFile(outputFilePath, data, (err) => {
            if (err) throw err;
            console.log(`Data written to ${outputFilePath}`);
        });
    });
};

const concatBuffer = () => {
    // Concatenate buffers
    const buff1 = Buffer.from('Hello, ');
    const buff2 = Buffer.from('Buffer!');
    const combinedBuffer = Buffer.concat([buff1, buff2]);
    console.log(combinedBuffer.toString('utf-8'));
    console.log('Combined Buffer Length:', combinedBuffer.length);
};

// Read file as buffer and write to another file
readWriteBufferToFile();

// Concatenate buffers
concatBuffer();
