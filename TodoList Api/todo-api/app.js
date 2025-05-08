const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const taskRoutes = require('./routes/tasks');
const sprintRoutes = require('./routes/sprints');
const backlogRoutes = require('./routes/backlog');

const Backlog = require('./models/Backlog');

dotenv.config();
const app = express();
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: { title: 'To-Do API', version: '1.0.0' },
    },
    apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/tasks', taskRoutes);
app.use('/sprints', sprintRoutes);
app.use('/backlog', backlogRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Conectado a MongoDB');

        const existingBacklog = await Backlog.findOne();
        if (!existingBacklog) {
            const newBacklog = new Backlog({ tareas: [] });
            await newBacklog.save();
            console.log('Backlog creado automáticamente');
        }

        app.listen(process.env.PORT, () =>
            console.log(`Servidor en puerto ${process.env.PORT}`)
        );
    })
    .catch(err => console.error('Error al conectar con MongoDB:', err));