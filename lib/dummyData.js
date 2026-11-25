/**
 * Preview / seed catalog — sourced from data/batteries.json.
 * Replace that JSON with your full batteries export and re-seed; UI mapping stays intact.
 */

import { batteryCatalog } from '@/lib/batteryCatalog';

export const products = batteryCatalog.products;
export const categories = batteryCatalog.categories;

export const orders = [
  { id: 'ORD-1001', date: '2024-07-15', total: 2396, status: 'Delivered', items: 2 },
  { id: 'ORD-1002', date: '2024-07-20', total: 1198, status: 'Shipped', items: 1 },
  { id: 'ORD-1003', date: '2024-07-25', total: 948, status: 'Pending', items: 1 },
];

export const users = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'user', joined: '2024-01-10' },
  { id: '2', name: 'Priya Patel', email: 'priya@example.com', role: 'user', joined: '2024-02-15' },
  { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin', joined: '2024-01-01' },
];

/** Product attributes used for filters / variants in admin */
export const attributes = [
  {
    id: '1',
    name: 'Voltage',
    slug: 'voltage',
    type: 'select',
    values: ['24V', '54.6V', '60V', '67.2V', '69.4V', '72V', '99V'],
  },
  {
    id: '2',
    name: 'Current',
    slug: 'current-a',
    type: 'select',
    values: ['2A', '3A', '4A', '5A', '6A', '8A', '15A', '35A', '40A', '50A', '60A'],
  },
  {
    id: '3',
    name: 'Capacity',
    slug: 'capacity-ah',
    type: 'select',
    values: ['30Ah'],
  },
  {
    id: '4',
    name: 'Battery Type',
    slug: 'battery-type',
    type: 'select',
    values: ['Lithium', 'NMC', 'Lead Acid', 'LFP'],
  },
  {
    id: '5',
    name: 'Brand',
    slug: 'brand',
    type: 'select',
    values: ['ATHER', 'GRAPHY', 'IMP', 'OLA', 'QT7', 'SUN6', 'TSV', 'ULA'],
  },
  {
    id: '6',
    name: 'Warranty',
    slug: 'warranty',
    type: 'select',
    values: ['1 Year', '2 Year'],
  },
];
