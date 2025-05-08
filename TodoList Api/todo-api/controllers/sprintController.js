const Sprint = require('../models/Sprint');
const Backlog = require('../models/Backlog');
const Task = require('../models/Task');


exports.getAllSprints = async (req, res) => {
    const sprints = await Sprint.find().populate('tareas');
    res.json(sprints);
};

exports.getSprintById = async (req, res) => {
    const sprint = await Sprint.findById(req.params.id).populate('tareas');
    res.json(sprint);
};

exports.createSprint = async (req, res) => {
    const sprint = new Sprint(req.body);
    await sprint.save();
    res.status(201).json(sprint);
};

exports.updateSprint = async (req, res) => {
    const sprint = await Sprint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(sprint);
};

exports.deleteSprint = async (req, res) => {
    res.json(await Sprint.findByIdAndDelete(req.params.id));
};

exports.addTaskToSprint = async (req, res) => {
    const { id, taskId } = req.params;
    try {
        const sprint = await Sprint.findById(id);
        if (!sprint) return res.status(404).json({ msg: 'Sprint no encontrado' });
    
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ msg: 'Tarea no encontrada' });
    
        if (sprint.tareas.includes(taskId)) {
            return res.status(400).json({ msg: 'La tarea ya está en el sprint' });
        }
    
        sprint.tareas.push(taskId);
        await sprint.save();
        res.json(sprint);
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};


exports.removeTaskFromSprint = async (req, res) => {
    const { sprintId, taskId } = req.params;

    try {
        const sprint = await Sprint.findById(sprintId);
        if (!sprint) return res.status(404).json({ msg: 'Sprint no encontrado' });

        sprint.tareas = sprint.tareas.filter(tarea => tarea.toString() !== taskId);
        await sprint.save();

        const backlog = await Backlog.findOne();
        if (!backlog) return res.status(404).json({ msg: 'Backlog no encontrado' });

        if (!backlog.tareas.includes(taskId)) {
            backlog.tareas.push(taskId);
            await backlog.save();
        }

        await Task.findByIdAndUpdate(taskId, { sprint: null });

        res.json({ msg: 'Tarea eliminada del sprint y agregada al backlog correctamente' });

    } catch (error) {
        console.error("Error al eliminar tarea del sprint y agregarla al backlog:", error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};
