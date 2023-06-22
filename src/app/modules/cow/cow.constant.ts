import {
  ICowBreed,
  ICowCategory,
  ICowLabel,
  ICowLocation,
} from './cow.interface';

export const cowLocation: ICowLocation[] = [
  'Dhaka',
  'Chattogram',
  'Barishal',
  'Rajshahi',
  'Sylhet',
  'Comilla',
  'Rangpur',
  'Mymensingh',
];
export const cowBreed: ICowBreed[] = [
  'Brahman',
  'Nellore',
  'Sahiwal',
  'Gir',
  'Indigenous',
  'Tharparkar',
  'Kankrej',
];

export const cowLabel: ICowLabel[] = ['for sale', 'sold out'];
export const cowCategory: ICowCategory[] = ['Dairy', 'Beef', 'Dual Purpose'];

export const cowFilterableFields = [
  'searchTerm',
  'minPrice',
  'maxPrice',
  'location',
];

export const cowSearchableFields = ['location', 'breed', 'category'];
