import { Service, NavBarItem } from '../types';


const images = [
    
    '/Barber-Inspo/1.png',
    '/Barber-Inspo/3.png',
    '/Barber-Inspo/4.png',  
    '/Barber-Inspo/5.png',
    '/Barber-Inspo/6.png',
    '/Barber-Inspo/7.png',  
    '/Barber-Inspo/8.png',
    '/Barber-Inspo/9.png',
    '/Barber-Inspo/10.png',
   
  ];
export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Classic Haircut',
    image:images[0],
    price: 2500,
    duration: 30,
    description: 'Traditional haircut with clippers and scissors',
    popular: true,
  },
  {
    id: '2',
    name: 'Beard Trim',
    image:images[1],
    price: 1500,
    duration: 20,
    description: 'Professional beard shaping and trimming',
    popular: true,
  },
  {
    id: '3',
    name: 'Haircut & Beard',
    image:images[2],
    price: 3500,
    duration: 45,
    description: 'Complete haircut and beard grooming package',
    popular: true,
  },
  {
    id: '4',
    name: 'Kids Haircut',
    image:images[3],
    price: 2000,
    duration: 25,
    description: 'Gentle haircut for children under 12',
  },
  {
    id: '5',
    name: 'Senior Haircut',
    image:images[4],
    price: 22,
    duration: 30,
    description: 'Comfortable haircut for seniors',
  },
  {
    id: '6',
    name: 'Hot Towel Shave',
    image:images[5],
    price: 30,
    duration: 40,
    description: 'Traditional straight razor shave with hot towel',
  },
];

export const NavbarItems: NavBarItem[] = [
  {
    label: '',
    explore: '/',
  },
  {
    label: '',
    explore: '/barber-inspo',
  },
   ]