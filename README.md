# Crypto trading simulator · backend

Express API for a paper-trading platform: you get a demo balance, place buy and sell orders on BTC and ETH, and watch your portfolio move. Frontend in [Crypto-trading-platform-frontend](https://github.com/Yeisonfjrd/Crypto-trading-platform-frontend).

Node with ES modules, PostgreSQL (Neon) through Sequelize, Redis, `ws` for WebSockets, Clerk for auth.

```
POST /api/orders           place an order            (auth)
GET  /api/orders           your orders               (auth)
GET  /api/order-book       open orders               (auth)
GET  /api/portfolio        holdings valued at current prices
GET  /api/crypto-prices    BTC / ETH in USD, cached in Redis
GET  /api/crypto-news      market news
POST /api/auth/enable-2fa  TOTP setup with speakeasy (auth)
POST /api/auth/verify-2fa
POST /api/chatbot          questions about the market, answered by Gemini
```

## Where the numbers come from

- **Prices** come from CoinGecko's public API. Its free tier rate-limits fast, so the response is cached in Redis for an hour and every client reads the cache instead of hitting CoinGecko.
- **The live ticker** over WebSocket is simulated: a random walk around the last price, broadcast every few seconds. It's there so the charts move during a demo, not to be accurate.

## Running it

```bash
npm install
cp .env.example .env   # fill in the keys
npx sequelize-cli db:migrate
npm run dev
```

## What's unfinished

- `src/websocket/websocketServer.js` fills pending orders when the real price crosses them. It's written but not wired in yet; the app still uses the simulated ticker.
- `PricePredictor` builds a TensorFlow.js model that is never trained, and `routes/simulation.js`, the only route that uses it, isn't mounted in `app.js`. It was an experiment, treat it as such.
- Balances are updated by reading and writing the user row, outside a transaction. Two fills at once could lose one.
