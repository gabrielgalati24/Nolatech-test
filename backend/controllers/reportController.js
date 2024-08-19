import Employee from '../models/employee.js';
import Evaluation from '../models/evaluation.js';

export const generateReportForEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate('evaluations');
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  const evaluations = await Evaluation.find({ employee: employee._id });
  const averageScore = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluations.length;

  res.json({
    employee: employee.name,
    averageScore,
    evaluations,
  });
};
