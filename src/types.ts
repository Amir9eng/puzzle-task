export type SubService = { id: string; label: string; price: string };
export type Service = {
  id: string;
  name: string;
  description: string;
  price: string;
  status: 'public' | 'private';
  subServices: SubService[];
};
export type Category = { id: string; name: string; services: Service[] };
export type Addon = { id: string; name: string; price: string };
