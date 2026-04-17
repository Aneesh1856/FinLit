const yahooFinance = require('yahoo-finance2').default;

async function test() {
  try {
    const data = await yahooFinance.historical('RELIANCE.NS', { period1: '2023-01-01' });
    console.log("Success! Extracted rows:", data.length);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

test();
