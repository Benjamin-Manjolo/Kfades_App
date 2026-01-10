import { Service } from '../types';

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Classic Haircut',
    price: 25,
    duration: 30,
    description: 'Traditional haircut with clippers and scissors',
    popular: true,
  },
  {
    id: '2',
    name: 'Beard Trim',
    price: 15,
    duration: 20,
    description: 'Professional beard shaping and trimming',
    popular: true,
  },
  {
    id: '3',
    name: 'Haircut & Beard',
    price: 35,
    duration: 45,
    description: 'Complete haircut and beard grooming package',
    popular: true,
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
