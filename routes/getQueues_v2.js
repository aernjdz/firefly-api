const axios = require('axios');
const  { GetData } = require("../handler/ParseData")

const last = require("../")
/**
 * @swagger
 * /api/getQueues:
 *   get:
 *     summary: Fetch and parse queue data
 *     responses:
 *       200:
 *         description: Successfully retrieved queue data
 *       500:
 *         description: Failed to fetch or parse the queue data
 */
module.exports = (app) =>  {
  app.get('/api/getQueues', async (req, res) => { 

    let data = await GetData();

      res.status(200).send({title: data.title , dates: data.dates })
      });
    }

