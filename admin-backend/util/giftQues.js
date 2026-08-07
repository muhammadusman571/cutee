// giftQueue.js
const giftQueue = [];
let isProcessing = false;

function enqueueGift(giftData, io) {
  giftQueue.push({ ...giftData });

  if (!isProcessing) processQueue(io);
}

async function processQueue(io) {
  if (giftQueue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;

  const data = giftQueue.shift();

  // Emit the global gift event
  io.emit("globalGift", data);

  // Wait 2–3 seconds before showing the next one
  setTimeout(() => processQueue(io), 3000);
}

module.exports = { enqueueGift };
