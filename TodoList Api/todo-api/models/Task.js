const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: String,
    estado: { type: String, enum: ['pendiente', 'en_progreso', 'completado'], default: 'pendiente' },
    fechaLimite: { type: Date, required: true },
    color: { type: String, default: '#ffffff' }
});

module.exports = mongoose.model('Task', taskSchema);
