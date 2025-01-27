require("dotenv").config();

const http = require("http");
const app = require("./src/app"); // Import the Express app

const PORT = process.env.PORT || 3000;

// Create a server and listen on the specified port
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
