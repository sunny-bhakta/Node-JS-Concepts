import { eventBus } from "./event-bus.ts";

// Listener for 'fileUploaded' event
eventBus.on("fileUploaded", (data) => {
  console.log(
    `[Listener] File uploaded: ${data.filename} by user ${data.userId}`
  );
});

// Listener for 'fileProcessed' event
eventBus.on("fileProcessed", (data) => {
  const { filename, success } = data;
  if (success) {
    console.log(
      `[Notifier] ✅ Your file "${filename}" was processed successfully.`
    );
  } else {
    console.log(
      `[Notifier] ❌ Processing failed for file "${filename}".`
    );
  }
});
