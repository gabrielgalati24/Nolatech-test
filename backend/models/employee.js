import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  evaluations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evaluation',
  }]
});

export default mongoose.model('Employee', employeeSchema);
