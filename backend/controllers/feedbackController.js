import Feedback from '../models/feedback.js';
import Evaluation from '../models/evaluation.js';

export const createFeedback = async (req, res) => {
  const { evaluationId, feedback } = req.body;

  try {

    const evaluation = await Evaluation.findById(evaluationId);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }


    const newFeedback = new Feedback({
      evaluation: evaluationId,
      feedback,
    });

    await newFeedback.save();

    evaluation.feedbacks.push(newFeedback._id);
    await evaluation.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
