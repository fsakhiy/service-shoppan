export class Product {
  uuid: string;
  name: string;
  photo: string;
  description: string;
  category: 'FOOD' | 'GOODS';
  price: number;
  seller: string;
}
