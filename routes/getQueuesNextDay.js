const axios = require('axios');
const  { GetData } = require("../handler/ParseData");
const fs = require('fs');
const path = require('path');
const moment = require('moment'); 
/**
 * @swagger
 * /api/getQueuesNextDay_v2:
 *   get:
 *     summary: Fetch and parse queue data for the next day
 *     responses:
 *       200:
 *         description: Successfully retrieved queue data
 *       500:
 *         description: Failed to fetch or parse the queue data
 */
module.exports = (app) => {
  app.get('/api/getQueuesNextDay_v2', async (req, res) => {
    try {
        await GetData();
      // Get the current date in YYYY-MM-DD format
      const nextDay = moment().add(1, 'days').format('YYYY-MM-DD');

      console.log(nextDay)
      // Path to the history data for the current date
      const historyFilePath = path.join(__dirname, `../outages/history/${nextDay}/data_v2.json`);

      // Read data from the history file
      const historyData = JSON.parse(fs.readFileSync(historyFilePath, 'utf8'));

      res.status(200).send({
        message: "Good",
        dates: historyData
      });
    } catch (error) {
      res.status(500).send({ message: "Failed" });
    }
  });
}
