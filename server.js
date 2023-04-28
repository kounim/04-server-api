const config = require('./config').development;
const express = require('express');
const http = require('http');
const app = express();
const port = config.PORT;
const cors = require('cors');

let corsOptions = {
	origin: '*',
	credential: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const autoRoute=require('./autoRoute');
autoRoute('/api', app);
const webServer = http.createServer(app);

webServer.listen(port,()=>{
    console.log(`http://localhost:${port}`);
})