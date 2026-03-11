/**
 * Service Model - Service schema and validation
 */

class ServiceModel {
  /**
   * Available service types
   */
  static services = [
    {
      id: '1',
      name: 'Classic Haircut',
      price: 25,
      duration: 30,
      description: 'Traditional haircut with clippers and scissors',
    },
    {
      id: '2',
      name: 'Beard Trim',
      price: 15,
      duration: 20,
      description: 'Professional beard shaping and trimming',
    },
    {
      id: '3',
      name: 'Haircut & Beard',
      price: 35,
      duration: 45,
      description: 'Complete haircut and beard grooming package',
    },
    {
      id: '4',
      name: 'Kids Haircut',
      price: 20,
      duration: 25,
      description: 'Gentle haircut for children under 12',
    },
    {
      id: '5',
      name: 'Senior Haircut',
      price: 22,
      duration: 30,
      description: 'Comfortable haircut for seniors',
    },
    {
      id: '6',
      name: 'Hot Towel Shave',
      price: 30,
      duration: 40,
      description: 'Traditional straight razor shave with hot towel',
    },
  ];

  /**
   * Get all available services
   * @returns {Array} - List of services
   */
  static getAll() {
    return this.services;
  }

  /**
   * Get service by ID
   * @param {string} id - Service ID
   * @returns {Object|null} - Service or null
   */
  static getById(id) {
    return this.services.find(service => service.id === id) || null;
  }

  /**
   * Validate service data
   * @param {Object} service - Service data
   * @returns {boolean} - Valid or not
   */
  static validate(service) {
    const requiredFields = ['name', 'price', 'duration'];
    
    for (const field of requiredFields) {
      if (!service[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (typeof service.price !== 'number' || service.price < 0) {
      throw new Error('Price must be a positive number');
    }

    if (typeof service.duration !== 'number' || service.duration < 0) {
      throw new Error('Duration must be a positive number');
    }

    return true;
  }
}

module.exports = ServiceModel;

