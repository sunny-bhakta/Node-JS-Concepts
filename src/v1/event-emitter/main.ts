import { uploadFile } from "./file-processor.ts";
import "./listeners.ts";

// Simulate file uploads
uploadFile("example.txt", "user123");
uploadFile("data.csv", "user456");

/*
Use Case:
You’re building a file processing system. Each time a file is uploaded or processed, different parts of your application need to respond:

- Log the event
- Update the database
- Notify the user

This is a perfect scenario for an EventEmitter — allowing decoupled components to listen and react to events.
*/
