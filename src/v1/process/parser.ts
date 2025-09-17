
// Listen for messages from the parent process
process.on("message", (msg: any) => {
  // If the message requests a 'parse' action
  if(msg?.action === "parse" ) {
    try {
      // Process the data and send the result back
      const result = processData(msg.payload);
      process.send?.({ status: "done", result });
    }catch (error: any) {
      // If an error occurs, send an error message back
      process.send?.({ status: "error", error: error.message });
    }
  }
});

// Function to process the data: filters items with value > 50 and calculates average
function processData(data: any) {
  const filtered = data.filter((item: any) => item.value > 50);
  const avg =
    filtered.reduce((sum: number, item: any) => sum + item.value, 0) / filtered.length;

  return {
    total: data.length,           // Total number of items received
    filtered: filtered.length,    // Number of items with value > 50
    averageValue: avg.toFixed(2), // Average value of filtered items (rounded to 2 decimals)
  };
}