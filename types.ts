
export enum UserRole {
  RETAILER = 'RETAILER',
  SUPPLIER = 'SUPPLIER' // The "REBEL Hub" Admin (Us)
}

export enum OrderStatus {
  PENDING = 'PENDING',
  MANUFACTURER_DISPATCHED = 'MANUFACTURER_DISPATCHED', // From Distro to Rebel
  HUB_RECEIVED = 'HUB_RECEIVED', // Rebel Hub Received
  HUB_QUALITY_CHECK = 'HUB_QUALITY_CHECK', // Rebel QC
  HUB_PROCESSING = 'HUB_PROCESSING', // Sorting
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', // Dispatched from Rebel to Retailer
  DELIVERED = 'DELIVERED'
}

export enum PaymentMethod {
  GPAY = 'GPAY',
  PHONEPE = 'PHONEPE',
  PAYTM = 'PAYTM',
  CREDIT_CARD = 'CREDIT_CARD',
  COD = 'COD'
}

export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  originalPrice: number;
  image: string;
}

export interface Address {
  shopName: string;
  street: string;
  city: string;
  pincode: string;
  phone: string;
}

export interface BulkDiscount {
  minQty: number;
  discountPercent: number;
}

export interface Product {
  id: string;
  name: string;
  manufacturer: string;
  pricePerUnit: number;
  minOrderQuantity: number;
  stockLevel: number;
  category: string;
  image: string;
  packaging?: string;
  bulkDiscounts?: BulkDiscount[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
}

export interface Order {
  id: string;
  retailerName: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  address: Address;
  createdAt: string;
  logs: AuditLog[];
}

export interface UserProfile {
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  address: Address;
  businessId: string;
  joinedAt: string;
}
