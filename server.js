const { createServer } = require('http');
const { Server } = require('socket.io');

// Create HTTP server
const httpServer = createServer();

// Create Socket.io instance with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Handle client connections
io.on('connection', (socket) => {
  console.log(`Client connected with socket ID: ${socket.id}`);

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Function to emit new incident to all clients
function emitNewIncident(incident) {
  io.emit('newIncident', incident);
}

// Start server on port 5001
const PORT = 5001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server listening on port ${PORT}`);
});

// Export io instance and helper function
module.exports = { io, emitNewIncident };
