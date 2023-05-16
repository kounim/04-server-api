const config = require('./config')[process.env.NODE_ENV];
const express = require('express');
const http = require('http');

const app = express();
const port = config.PORT;
const cors = require('cors');

//cors
const corsOptions = {
  origin: "http://localhost:8080",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const autoRoute = require("./autoRoute");
autoRoute("/api", app);

const webServer = http.createServer(app);
webServer.listen(port, () => {
  console.log(`http://localhost:${port}`);
});