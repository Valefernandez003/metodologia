const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
    nombre: String,
    fechaInicio: { type: Date, required: true },
    fechaCierre: { type: Date, required: true },
    tareas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    color: { type: String, default: '#cccccc' }
});



module.exports = mongoose.model('Sprint', sprintSchema);
