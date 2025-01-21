// script.js

const startBtn = document.getElementById("start-bot");
const stopBtn = document.getElementById("stop-bot");
const currentPriceElement = document.getElementById("current-price");
const signalElement = document.getElementById("signal");

let priceHistory = [];
let interval;
let isBotRunning = false;

const API_URL = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'; // Binance API for BTC price

// Function to fetch current price of Bitcoin
async function fetchCurrentPrice() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const price = parseFloat(data.price);
    currentPriceElement.textContent = `$${price.toFixed(2)}`;
    priceHistory.push(price);

    // Keep the history length within a reasonable range (e.g., last 10 prices)
    if (priceHistory.length > 10) priceHistory.shift();

    // Generate signal based on price trend
    if (priceHistory.length > 2) {
      const trend = priceHistory[priceHistory.length - 1] - priceHistory[priceHistory.length - 2];
      if (trend > 0) {
        signalElement.textContent = "Buy Signal";
        signalElement.style.color = "green";
      } else if (trend < 0) {
        signalElement.textContent = "Sell Signal";
        signalElement.style.color = "red";
      } else {
        signalElement.textContent = "Hold Signal";
        signalElement.style.color = "gray";
      }
    }
  } catch (error) {
    console.error("Error fetching price:", error);
    currentPriceElement.textContent = "Error";
  }
}

// Function to start the bot
function startBot() {
  if (!isBotRunning) {
    isBotRunning = true;
    interval = setInterval(fetchCurrentPrice, 5000); // Fetch data every 5 seconds
    startBtn.disabled = true;
    stopBtn.disabled = false;
  }
}

// Function to stop the bot
function stopBot() {
  if (isBotRunning) {
    isBotRunning = false;
    clearInterval(interval);
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
}

// Event listeners
startBtn.addEventListener("click", startBot);
stopBtn.addEventListener("click", stopBot);