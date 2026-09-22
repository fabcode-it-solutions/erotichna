import { MongoClient } from 'mongodb';

// Connection pool management for production
class DatabaseManager {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnecting = false;
  }

  async connect() {
    if (this.client && this.client.topology && this.client.topology.isConnected()) {
      return this.db;
    }

    if (this.isConnecting) {
      // Wait for existing connection attempt
      while (this.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.db;
    }

    this.isConnecting = true;

    try {
      const options = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
        retryWrites: true,
        retryReads: true,
        compressors: ['zlib'], // Enable compression
      };

      this.client = new MongoClient(process.env.MONGODB_URI, options);
      await this.client.connect();
      this.db = this.client.db();
      
      return this.db;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }

  async getCollection(name) {
    const db = await this.connect();
    return db.collection(name);
  }

  // Health check for monitoring
  async healthCheck() {
    try {
      const db = await this.connect();
      await db.admin().ping();
      return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message, timestamp: new Date() };
    }
  }
}

// Singleton instance
const dbManager = new DatabaseManager();

export default dbManager;

// Graceful shutdown handling
process.on('SIGINT', async () => {
  await dbManager.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await dbManager.disconnect();
  process.exit(0);
});