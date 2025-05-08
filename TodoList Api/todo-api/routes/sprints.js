const express = require('express');
const router = express.Router();
const sprintController = require('../controllers/sprintController');

/**
 * @swagger
 * /sprints:
 *   get:
 *     summary: Obtener todos los sprints
 */
router.get('/', sprintController.getAllSprints);

/**
 * @swagger
 * /sprints/{id}:
 *   get:
 *     summary: Obtener un sprint por ID
 */
router.get('/:id', sprintController.getSprintById);

/**
 * @swagger
 * /sprints:
 *   post:
 *     summary: Crear nuevo sprint
 */
router.post('/', sprintController.createSprint);

/**
 * @swagger
 * /sprints/{id}:
 *   put:
 *     summary: Editar un sprint
 */
router.put('/:id', sprintController.updateSprint);

/**
 * @swagger
 * /sprints/{id}:
 *   delete:
 *     summary: Eliminar un sprint
 */
router.delete('/:id', sprintController.deleteSprint);

/**
 * @swagger
 * /sprints/{id}/add-task/{taskId}:
 *   put:
 *     summary: Agregar una tarea al sprint
 */
router.put('/:id/add-task/:taskId', sprintController.addTaskToSprint);

/**
 * @swagger
 * /sprints/{sprintId}/remove-task-from-sprint/{taskId}:
 *   put:
 *     summary: Eliminar tarea del sprint y agregarla al backlog
 */
router.put('/:sprintId/remove-task-from-sprint/:taskId', sprintController.removeTaskFromSprint);

module.exports = router;
