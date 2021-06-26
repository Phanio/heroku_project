const pg = require('pg');
const pgtools = require('pgtools');
const conf = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD
};
class PostgresStore {
  /** @type { import('pg').Pool } */
  pool; 
  /** @type { import('pg').PoolClient } */
  client;
  
  async init () {
   // this.pool = new pg.Pool({...conf, database: process.env.DB_NAME});
    console.log('process.env.DATABASE_URL')
    console.log(process.env.DATABASE_URL)
    this.client = await new pg.Client(process.env.DATABASE_URL) //this.pool.connect();
    if(this.client){
      console.log('**connexion ok**');
      console.log(process.env.MIGRATE);
      if(process.env.MIGRATE === undefined){
        process.env.MIGRATE = 0;
      }
      if(process.env.MIGRATE){
        this.buildTables();
        process.env.MIGRATE = 1;
      }
    }
  }

  close () {
    if (this.client) this.client.release();
    this.client = null;
  }

  async reset () {
    console.log(process.env.ADMIN_EMAIL)
   
    try {
      console.log(process.env.ADMIN_EMAIL)
      await pgtools.dropdb(conf, process.env.DB_NAME);
    } catch (err) {
      console.log("error but don't care", err);
    }
    await pgtools.createdb(conf, process.env.DB_NAME);

    await this.init();
    await this.buildTables();
    const user = await this.createAdminUser();

    console.log('bravo ! création des tables réussie');
  }

  async buildTables () {
    const User = require('../models/user.model'); 
    console.log('****')
    console.log(User)
    const res =  await this.client.query(User.toSqlTable());
    console.log('res')
    console.log(res)
    await this.createAdminUser();
  }
  /**
   * @returns {Promise<import('../models/user.model')>}
   */
  async createAdminUser () {
    const User = require('../models/user.model');
    return await User.create({
      email: process.env.ADMIN_EMAIL,
      firstname: process.env.ADMIN_FIRSTNAME,
      lastname: process.env.ADMIN_LASTNAME,
      password: process.env.ADMIN_PASS
    });
  }
}

module.exports = new PostgresStore();
