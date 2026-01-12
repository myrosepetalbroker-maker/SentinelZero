const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const DB_PATH = process.env.DB_PATH || './data/db.json';

class Database {
  constructor() {
    this.data = {
      contracts: [],
      analyses: [],
      exploits: [],
      approvals: []
    };
  }

  async initialize() {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(DB_PATH)) {
        const fileData = fs.readFileSync(DB_PATH, 'utf8');
        this.data = JSON.parse(fileData);
        logger.info('Database loaded from file');
      } else {
        await this.save();
        logger.info('New database initialized');
      }
    } catch (error) {
      logger.error('Database initialization error:', error);
      throw error;
    }
  }

  async save() {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2));
    } catch (error) {
      logger.error('Database save error:', error);
      throw error;
    }
  }

  async addContract(contract) {
    this.data.contracts.push({
      ...contract,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    await this.save();
  }

  async addAnalysis(analysis) {
    this.data.analyses.push({
      ...analysis,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    await this.save();
  }

  async addApproval(approval) {
    this.data.approvals.push({
      ...approval,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    await this.save();
  }

  getContracts() {
    return this.data.contracts;
  }

  getAnalyses() {
    return this.data.analyses;
  }

  getApprovals() {
    return this.data.approvals;
  }

  getAnalysisByAddress(address) {
    return this.data.analyses.filter(a => 
      a.contractAddress.toLowerCase() === address.toLowerCase()
    );
  }
}

const db = new Database();

async function initializeDatabase() {
  await db.initialize();
  return db;
}

module.exports = {
  initializeDatabase,
  db
};
