import Category from '../models/category.js';


export const createCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
      const category = new Category({ name, description });
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: 'Error creating category', error: error.message });
    }
  };
  

  export const getCategories = async (req, res) => {
    try {
      const categories = await Category.find().populate('questions');
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
  };
  

  export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findById(id).populate('questions');
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
  };

  
  export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
      const category = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: 'Error updating category', error: error.message });
    }
  };

  
  export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
  };
  