const express = require('express');
const router = express.Router();
const backlogController = require('../controllers/backlogController');

/**
 * @swagger
 * /backlog:
 *   get:
 *     summary: Obtener backlog
 */
router.get('/', backlogController.getBacklog);

/**
 * @swagger
 * /backlog/add-task/{taskId}:
 *   put:
 *     summary: Agregar tarea al backlog
 */
router.put('/add-task/:taskId', backlogController.addTaskToBacklog);

module.exports = router;

/**
 * @swagger
 * /backlog/remove-task/{taskId}:
 *   put:
 *     summary: Eliminar una tarea del backlog
 */
router.put('/remove-task/:taskId', backlogController.removeTaskFromBacklog);
