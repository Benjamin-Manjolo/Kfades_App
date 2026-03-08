import { Service, NavBarItem } from '../types';


const images = [
    '/Barber-Inspo/0f89c8e73a91bda7d29787e82d8653a5.jpg',
    '/Barber-Inspo/1cbaa2dfe955cf7157b9eae69e0f20b0.jpg',
    '/Barber-Inspo/2a815864b47f54c0a7b7be092f07bc84.jpg',
    '/Barber-Inspo/3a304c45d267701b7464bb876ffd8f63.jpg',
    '/Barber-Inspo/3deaadf5bdb86a5301c412bac72c1db0.jpg',
    '/Barber-Inspo/015ccfea1bb5f92cd474a27a6047913d.jpg',
    '/Barber-Inspo/020a6909a72d5fefc40e64311213105e.jpg',
    '/Barber-Inspo/39cc9ca1e11fa627a10cc4a6cbbf472d.jpg',
    '/Barber-Inspo/335f9e17922cf54b743791aa749ba30a.jpg',
    '/Barber-Inspo/892b55ce910c23c780e7c521ca7ccc0d.jpg',
    '/Barber-Inspo/917e814a8d8b5ae825e51feeecb0da52.jpg',
    '/Barber-Inspo/960b51f96853c6b7151693712f809d12.jpg',
    '/Barber-Inspo/1143c70484bb2dc18a333fd82aa88086.jpg',
    '/Barber-Inspo/5362ab09d4590be3820a11da519cd2b1.jpg',
    '/Barber-Inspo/52443f55d6950f490256c6332417fc5f.jpg',
    '/Barber-Inspo/3457063081123eaffeceeb4961b55875.jpg',
    '/Barber-Inspo/Beautiful hair cut style.jpg',
    '/Barber-Inspo/bland.jpg',
    '/Barber-Inspo/c81668c55b7c376eab6d37d3d6097386.jpg',
    '/Barber-Inspo/d4508df2339452d175dd714a3cfba41d.jpg',
    '/Barber-Inspo/e0a2a2ebb19ac73485cec0fb08324f13.jpg',
    '/Barber-Inspo/e7700318a64e56b77a6e81d87664b160.jpg',
    '/Barber-Inspo/ee6fefd7446e8fb98150c49d683a836f.jpg',
    '/Barber-Inspo/fdf09453acf5e3753c2b816a22063bec.jpg',
  ];
export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Classic Haircut',
    image:images[0],
    price: 25,
    duration: 30,
    description: 'Traditional haircut with clippers and scissors',
    popular: true,
  },
  {
    id: '2',
    name: 'Beard Trim',
    image:images[1],
    price: 15,
    duration: 20,
    description: 'Professional beard shaping and trimming',
    popular: true,
  },
  {
    id: '3',
    name: 'Haircut & Beard',
    image:images[2],
    price: 35,
    duration: 45,
    description: 'Complete haircut and beard grooming package',
    popular: true,
  },
  {
    id: '4',
    name: 'Kids Haircut',
    image:images[3],
    price: 20,
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
    label: 'Notifications',
    explore: '/',
  },
  {
    label: 'Explore',
    explore: '/barber-inspo',
  },
   ]