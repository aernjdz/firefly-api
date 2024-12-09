const axios = require('axios');
const  { GetData } = require("../handler/ParseData")

const last = require("../outages/latest/data_v2.json")
/**
 * @swagger
 * /api/getQueues_v2:
 *   get:
 *     summary: Fetch and parse queue data
 *     responses:
 *       200:
 *         description: Successfully retrieved queue data
 *       500:
 *         description: Failed to fetch or parse the queue data
 */
module.exports = (app) =>  {
  app.get('/api/getQueues_v2', async (req, res) => { 
      try {
          // Fetch new data
          let data = await GetData();
          
        
          res.status(200).send({
              title: data.title, 
              dates: last
          });
      } catch (error) {
          res.status(500).send({ message: "Failed to fetch or parse the queue data" });
      }
  });
}