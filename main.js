const express = require("express")

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require("cors");

// Allow all origins for development
app.use(cors());

app.use(express.json());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Say Hello
 *     description: Responds with a greeting message.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello, World!
 */
app.get('/api/hello', (req, res) => {
    res.send({ message: 'Hello, World!' });
  });

  const routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith('.js')) {
    const route = require(path.join(routesPath, file));
    route(app); 
  }
});
app.listen(8080, () => console.log('Server is running on http://localhost:8080'));