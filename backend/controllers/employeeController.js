import User from '../models/user.js';

export const getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query; 

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Crear un filtro para la búsqueda
    const searchQuery = search
      ? {
          role: 'Employee',
          $or: [
            { name: { $regex: search, $options: 'i' } }, // Búsqueda insensible a mayúsculas y minúsculas en el nombre
            { email: { $regex: search, $options: 'i' } } // Búsqueda insensible a mayúsculas y minúsculas en el email
          ]
        }
      : { role: 'Employee' }; // Si no hay búsqueda, solo filtra por empleados

    // Obtener empleados con paginación
    const employees = await User.find(searchQuery)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Contar el total de empleados que coinciden con la búsqueda
    const totalEmployees = await User.countDocuments(searchQuery);

    res.json({
      total: totalEmployees,
      page: pageNumber,
      limit: limitNumber,
      employees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
  
};


export const getEmployed = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await User.findById(id);

    if (!employee || employee.role !== 'Employee') {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}