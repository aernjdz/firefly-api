module.exports = (app) => {
    
    /**
 * @swagger
 * /api/testpoint:
 *   get:
 *     summary: Fetch and parse queue data
 *     responses:
 *       200:
 *         description: Successfully retrieved queue data
 *       500:
 *         description: Failed to fetch or parse the queue data
 */
    app.get('/api/testpoint', async (req, res) => {
      try {
        // Mocked test response with 6 queues
        const testResponse = {
          title: "Test Data for 6 Queues",
          dates: [
            {
              date: "2024-11-18",
              data: [
                { queue: "1", times: ["08:00-09:00", "14:00-15:00"] },
                { queue: "2", times: ["09:00-10:00", "15:00-16:00"] },
                { queue: "3", times: ["10:00-11:00", "16:00-17:00"] },
                { queue: "4", times: ["11:00-12:00", "17:00-18:00"] },
                { queue: "5", times: ["12:00-13:00", "18:00-19:00"] },
                { queue: "6", times: ["13:00-14:00", "19:00-20:00"] },
              ],
            },
            {
              date: "2024-11-19",
              data: [
                { queue: "1", times: ["08:30-09:30", "14:30-15:30"] },
                { queue: "2", times: ["09:30-10:30", "15:30-16:30"] },
                { queue: "3", times: ["10:30-11:30", "16:30-17:30"] },
                { queue: "4", times: ["11:30-12:30", "17:30-18:30"] },
                { queue: "5", times: ["12:30-13:30", "18:30-19:30"] },
                { queue: "6", times: ["13:30-14:30", "19:30-20:30"] },
              ],
            },
          ],
        };
  
        res.status(200).json(testResponse);
      } catch (error) {
        console.error('Error in /api/testpoint test route:', error);
        res.status(500).json({ message: 'Error in test route', error: error.message });
      }
    });
  };
  