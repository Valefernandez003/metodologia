const Backlog = require('../models/Backlog');
const Task = require('../models/Task');

exports.getBacklog = async (req, res) => {
    const backlog = await Backlog.findOne().populate('tareas');
    if (!backlog) {
        return res.status(404).json({ msg: 'No se encontró el backlog' });
    }
    res.json(backlog);
};

exports.addTaskToBacklog = async (req, res) => {
    try {
        const backlog = await Backlog.findOne();
        if (!backlog) return res.status(404).json({ msg: 'Backlog no creado' });
    
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ msg: 'Tarea no encontrada' });
    
        if (backlog.tareas.includes(task._id)) {
            return res.status(400).json({ msg: 'La tarea ya está en el backlog' });
        }
    
        backlog.tareas.push(task._id);
        await backlog.save();
        res.json(backlog);
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

exports.removeTaskFromBacklog = async (req, res) => {
    try {
        const backlog = await Backlog.findOne();
        if (!backlog) return res.status(404).json({ msg: 'Backlog no encontrado' });

        const taskId = req.params.taskId;

        if (!backlog.tareas.includes(taskId)) {
            return res.status(404).json({ msg: 'La tarea no está en el backlog' });
        }

        backlog.tareas = backlog.tareas.filter(id => id.toString() !== taskId);
        await backlog.save();

        res.json({ msg: 'Tarea eliminada del backlog correctamente', backlog });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};