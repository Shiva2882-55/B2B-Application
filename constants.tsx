
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { 
    id: 'm1', 
    name: 'Paracetamol 500mg (Bulk)', 
    manufacturer: 'PharmaCore Labs', 
    pricePerUnit: 2.50, 
    minOrderQuantity: 500, 
    stockLevel: 25000, 
    category: 'Analgesics', 
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600&h=450', 
    packaging: 'Box of 10 Strips x 10 Tabs',
    bulkDiscounts: [
      { minQty: 1000, discountPercent: 0.05 },
      { minQty: 5000, discountPercent: 0.12 }
    ]
  },
  { 
    id: 'm2', 
    name: 'Amoxicillin 250mg Capsules', 
    manufacturer: 'Global Antibiotics', 
    pricePerUnit: 8.75, 
    minOrderQuantity: 200, 
    stockLevel: 15000, 
    category: 'Antibiotics', 
    image: 'https://images.unsplash.com/photo-1471864190281-ad5fe9bb0724?auto=format&fit=crop&q=80&w=600&h=450', 
    packaging: 'Bottle of 100 Caps',
    bulkDiscounts: [
      { minQty: 1000, discountPercent: 0.08 },
      { minQty: 3000, discountPercent: 0.15 }
    ]
  },
  { 
    id: 'm3', 
    name: 'Vitamin C 1000mg Effervescent', 
    manufacturer: 'Vitality Nutra', 
    pricePerUnit: 4.20, 
    minOrderQuantity: 300, 
    stockLevel: 8000, 
    category: 'Supplements', 
    image: 'https://images.unsplash.com/photo-1616671285410-093110298a03?auto=format&fit=crop&q=80&w=600&h=450', 
    packaging: 'Tube of 20 Tabs',
    bulkDiscounts: [
      { minQty: 1000, discountPercent: 0.05 }
    ]
  },
  { 
    id: 'm4', 
    name: 'Insulin Glargine 100U/mL', 
    manufacturer: 'BioGenics', 
    pricePerUnit: 45.00, 
    minOrderQuantity: 50, 
    stockLevel: 2000, 
    category: 'Endocrinology', 
    image: 'https://images.unsplash.com/photo-1579165466541-74e2149581ae?auto=format&fit=crop&q=80&w=600&h=450', 
    packaging: 'Carton of 5 Pens'
  },
  { id: 'm5', name: 'Ibuprofen 400mg Tablets', manufacturer: 'PainRelief Inc.', pricePerUnit: 3.10, minOrderQuantity: 400, stockLevel: 12000, category: 'Analgesics', image: 'https://images.unsplash.com/photo-1550572017-ed20015a323b?auto=format&fit=crop&q=80&w=600&h=450', packaging: 'Box of 50 Tabs' },
  { id: 'm6', name: 'Metformin 500mg Tablets', manufacturer: 'DiabeTech', pricePerUnit: 1.80, minOrderQuantity: 1000, stockLevel: 50000, category: 'Endocrinology', image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=600&h=450', packaging: 'Box of 100 Strips' },
  { id: 'm7', name: 'Atorvastatin 20mg Tablets', manufacturer: 'HeartCare Pharm', pricePerUnit: 12.50, minOrderQuantity: 100, stockLevel: 5000, category: 'Cardiovascular', image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=600&h=450', packaging: 'Blister Pack of 30' },
  { id: 'm8', name: 'Lisinopril 10mg Tablets', manufacturer: 'PureHealth Labs', pricePerUnit: 4.50, minOrderQuantity: 250, stockLevel: 10000, category: 'Cardiovascular', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=600&h=450', packaging: 'Strip of 10 Tabs' },
  { id: 'm9', name: 'Azithromycin 500mg', manufacturer: 'Global Antibiotics', pricePerUnit: 15.20, minOrderQuantity: 100, stockLevel: 3000, category: 'Antibiotics', image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=600&h=450', packaging: 'Pack of 3 Tablets' },
  { id: 'm10', name: 'Aspirin 81mg Low Dose', manufacturer: 'PharmaCore Labs', pricePerUnit: 1.10, minOrderQuantity: 2000, stockLevel: 100000, category: 'Analgesics', image: 'https://images.unsplash.com/photo-1547489432-cf93fa6c71ee?auto=format&fit=crop&q=80&w=600&h=450', packaging: 'Bulk Bottle of 500' },
  { id: 'm11', name: 'Omeprazole 20mg Caps', manufacturer: 'GastroGuard', pricePerUnit: 6.40, minOrderQuantity: 500, stockLevel: 18000, category: 'Gastroenterology', image: 'https://images.unsplash.com/photo-1626414302636-f082be05e320?auto=format&fit=crop&q=80&w=600&h=450', packaging: 'Bottle of 30 Caps' },
  { id: 'm12', name: 'Amlodipine 5mg Tablets', manufacturer: 'HeartCare Pharm', pricePerUnit: 3.80, minOrderQuantity: 600, stockLevel: 22000, category: 'Cardiovascular', image: 'https://images.unsplash.com/photo-1631549916768-4119b2e55c06?auto=format&fit=crop&q=80&w=600&h=450', packaging: 'Box of 100 Tabs' },
  { id: 'm13', name: 'Albuterol Inhaler 90mcg', manufacturer: 'BreatheFree', pricePerUnit: 35.00, minOrderQuantity: 20, stockLevel: 1500, category: 'Respiratory', image: 'https://images.unsplash.com/photo-1582718885933-31f32a875a64?auto=format&fit=crop&q=80&w=600&h=450', packaging: 'Metered Dose Inhaler' },
  { id: 'm14', name: 'Levothyroxine 50mcg', manufacturer: 'ThyroSafe', pricePerUnit: 5.20, minOrderQuantity: 300, stockLevel: 9000, category: 'Endocrinology', image: 'https://images.unsplash.com/photo-1550572017-ed20015a323b?auto=format&fit=crop&q=80&w=600&h=450', packaging: 'Bottle of 90' },
  { id: 'm15', name: 'Gabapentin 300mg Caps', manufacturer: 'NeuroRelief', pricePerUnit: 9.30, minOrderQuantity: 200, stockLevel: 6000, category: 'Neurology', image: 'https://images.unsplash.com/photo-1512428559087-560ad5ceab42?auto=format&fit=crop&q=80&w=600&h=450', packaging: 'Box of 60 Caps' },
  { id: 'm16', name: 'Sertraline 50mg Tablets', manufacturer: 'MindWellness', pricePerUnit: 7.10, minOrderQuantity: 400, stockLevel: 12000, category: 'Psychiatry', image: 'https://images.unsplash.com/photo-1542060775-10313f837364?auto=format&fit=crop&q=80&w=600&h=450', packaging: 'Strip of 14' },
  { id: 'm17', name: 'Losartan 50mg Tablets', manufacturer: 'PureHealth Labs', pricePerUnit: 5.90, minOrderQuantity: 300, stockLevel: 11000, category: 'Cardiovascular', image: 'https://images.unsplash.com/photo-1555633514-abcee6ad93a1?auto=format&fit=crop&q=80&w=600&h=450', packaging: 'Box of 30' },
  { id: 'm18', name: 'Hydrochlorothiazide 25mg', manufacturer: 'FlowMed', pricePerUnit: 2.10, minOrderQuantity: 1000, stockLevel: 45000, category: 'Cardiovascular', image: 'https://images.unsplash.com/photo-1550572017-617245458fd0?auto=format&fit=crop&q=80&w=600&h=450', packaging: 'Strip of 20' },
  { id: 'm19', name: 'Prednisone 10mg Tablets', manufacturer: 'PharmaCore Labs', pricePerUnit: 4.80, minOrderQuantity: 500, stockLevel: 15000, category: 'Immunology', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=600&h=450', packaging: 'Box of 50' },
  { id: 'm63', name: 'Paracetamol 650mg ER', manufacturer: 'PharmaCore Labs', pricePerUnit: 3.20, minOrderQuantity: 300, stockLevel: 12000, category: 'Analgesics', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600&h=450', packaging: 'Sheet Box (15 Strips x 10 Tabs)' }
];

export const APP_NAME = "REBEL";