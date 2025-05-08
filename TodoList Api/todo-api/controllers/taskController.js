const Task = require('../models/Task');
const Sprint = require('../models/Sprint');
const { validationResult } = require('express-validator');

exports.getAllTasks = async (req, res) => {
    const filtro = req.query.estado ? { estado: req.query.estado } : {};
    const tareas = await Task.find(filtro).sort({ fechaLimite: 1 });
    res.json(tareas);
};

exports.getTaskById = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Tarea no encontrada' });
    res.json(task);
};

exports.createTask = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
};

exports.updateTask = async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Task.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ msg: 'Tarea no encontrada' });
        }
    
        res.json({ msg: 'Tarea eliminada correctamente' });
        
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

exports.updateTaskEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ msg: "Tarea no encontrada" });

        task.estado = estado;
        await task.save();

        res.json(task);
    } catch (err) {
        res.status(500).json({ msg: "Error al actualizar estado de tarea" });
    }
};
