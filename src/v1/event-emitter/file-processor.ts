import { eventBus } from "./event-bus.ts";

const uploadFile = (filename: string, userId: string) => {
    console.log(`[File] ${filename} uploaded by user ${userId}`);

    // Emit an event when a file is uploaded
    eventBus.emit('fileUploaded', { filename, userId });

    // Simulate some processing
    setTimeout(() => {
        const success = Math.random() > 0.2; // 80% chance of success
        console.log(
            `[Processor] fileName: ${filename} processed ${success ? 'successfully' : 'with errors'}.`
        );
        eventBus.emit('fileProcessed', { filename, success });
    }, 1000);
};

export { uploadFile };