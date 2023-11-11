import { ICowBreed, ICowCategory, ICowLabel } from './cow.interface';

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
  'label',
];

export const cowSearchableFields = ['location', 'breed', 'category'];
