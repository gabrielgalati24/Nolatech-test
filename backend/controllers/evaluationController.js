import Evaluation from '../models/evaluation.js';
import User from '../models/user.js';

export const createEvaluation = async (req, res) => {
  const { employeeId, score, note, answers } = req.body; // Incluimos 'answers'
  
  try {
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

  
    const evaluation = new Evaluation({
      employee: employeeId,
      score,
      note,
      evaluator: req.user._id,
      answers, 
    });

    await evaluation.save();


    employee.evaluations.push(evaluation._id);
    await employee.save();

    res.status(201).json(evaluation);
  } catch (error) {
    console.error('Error creating evaluation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getEvaluation = async (req, res) => {
  const evaluation = await Evaluation.findById(req.params.id).populate('employee evaluator feedbacks');
  if (!evaluation) {
    return res.status(404).json({ message: 'Evaluation not found' });
  }
  res.json(evaluation);
};

export const updateEvaluation = async (req, res) => {
  const { score, note, answers } = req.body;

  try {
    const evaluation = await Evaluation.findByIdAndUpdate(
      req.params.id,
      { score, note, answers }, 
      { new: true }
    );
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    res.json(evaluation);
  } catch (error) {
    console.error('Error updating evaluation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getEvaluationsByEmployee = async (req, res) => {
  console.log('Function getEvaluationsByEmployee called');
  console.log('Request params:', req.params);

  try {
    const employeeId = req.params.id;
    console.log('Employee ID:', employeeId);

    const evaluations = await Evaluation.find({ employee: employeeId })
      .populate('employee', 'name email role')
      .populate('evaluator', 'name email role'); 

    if (!evaluations || evaluations.length === 0) {
      console.log('No evaluations found');
      return res.json([]);
    }

    console.log('Evaluations found:', evaluations);
    res.json(evaluations);
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getEvaluationsByEvaluator = async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 
  const skip = (page - 1) * limit;

  try {
    const evaluations = await Evaluation.find({ evaluator: req.user.id })
      .populate('employee', 'name email role')
      .populate('evaluator', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip) 
      .limit(limit); 
    console.log('Evaluations:', evaluations);
    const totalEvaluations = await Evaluation.countDocuments({ evaluator: req.user.id }); 

    if (!evaluations) {
      return res.status(404).json({ message: 'Evaluations not found' });
    }

    res.json({
      evaluations,
      totalPages: Math.ceil(totalEvaluations / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const calculateEvaluationResults = async (req, res) => {
  const { employeeId } = req.params;

  try {

    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== 'Employee') {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Obtener todas las evaluaciones del empleado
    const evaluations = await Evaluation.find({ employee: employeeId });

    if (evaluations.length === 0) {
      return res.status(404).json({ message: 'No evaluations found for this employee' });
    }

    // Calcular resultados
    const totalEvaluations = evaluations.length;
    const scores = evaluations.map(evaluation => evaluation.score);
    const averageScore = scores.reduce((a, b) => a + b, 0) / totalEvaluations;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    // Devolver los resultados
    res.json({
      employee: employee.name,
      totalEvaluations,
      averageScore,
      maxScore,
      minScore,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

};

export const getAllEvaluations = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Página actual
  const limit = parseInt(req.query.limit) || 10; // Límite de evaluaciones por página
  const skip = (page - 1) * limit;

  try {
    const evaluations = await Evaluation.find()
      .populate('employee', 'name email role')
      .populate('evaluator', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip) // Saltar registros según la página actual
      .limit(limit); // Limitar registros según el límite

    const totalEvaluations = await Evaluation.countDocuments(); // Contar el total de evaluaciones

    if (!evaluations || evaluations.length === 0) {
      return res.status(404).json({ message: 'Evaluations not found' });
    }

    res.json({
      evaluations,
      totalPages: Math.ceil(totalEvaluations / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
