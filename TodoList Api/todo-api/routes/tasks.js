const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const taskController = require('../controllers/taskController');

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Obtener todas las tareas (con filtros)
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Estado de la tarea (pendiente, en progreso, completado)
 *     responses:
 *       200:
 *         description: Lista de tareas
 */
router.get('/', taskController.getAllTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Obtener una tarea por ID
 */
router.get('/:id', taskController.getTaskById);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crear nueva tarea
 */
router.post('/',
    [
        body('titulo').notEmpty().withMessage('El título es obligatorio'),
        body('fechaLimite').isISO8601().withMessage('La fecha debe ser válida'),
    ],
    taskController.createTask
);

router.put('/:id/estado', taskController.updateTaskEstado);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
