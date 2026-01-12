
import { Order, Product, OrderStatus, AuditLog, UserRole } from './types';
import { MOCK_PRODUCTS } from './constants';

const STORAGE_KEYS = {
  ORDERS: 'rebel_orders_v2',
  PRODUCTS: 'rebel_products_v2',
  LOGS: 'rebel_audit_logs_v2',
  USER: 'rebel_user_v2'
};

export class RebelBackend {
  static async getProducts(): Promise<Product[]> {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
      return MOCK_PRODUCTS;
    }
    return JSON.parse(data);
  }

  static async updateProductStock(productId: string, quantity: number): Promise<void> {
    const products = await this.getProducts();
    const updated = products.map(p => 
      p.id === productId ? { ...p, stockLevel: Math.max(0, p.stockLevel - quantity) } : p
    );
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  }

  static async getOrders(): Promise<Order[]> {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  }

  static async saveOrder(order: Order): Promise<void> {
    const orders = await this.getOrders();
    const updated = [order, ...orders];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    await this.addAuditLog('ORDER_PLACED', `Order ${order.id} placed by ${order.retailerName}. Total: ₹${order.totalAmount.toLocaleString()}`);
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus, logMsg?: string): Promise<void> {
    const orders = await this.getOrders();
    let retailerName = '';
    const updated = orders.map(o => {
      if (o.id === orderId) {
        retailerName = o.retailerName;
        const newLog: AuditLog = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          action: 'STATUS_UPDATE',
          details: logMsg || `Supply chain stage advanced: ${status.replace(/_/g, ' ')}`,
          type: status === OrderStatus.DELIVERED ? 'SUCCESS' : 'INFO'
        };
        return { ...o, status, logs: [newLog, ...o.logs] };
      }
      return o;
    });
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    if (retailerName) {
      await this.addAuditLog('LOGISTICS_UPDATE', `${orderId} (${retailerName}): ${status.replace(/_/g, ' ')}`);
    }
  }

  static async addAuditLog(action: string, details: string, type: AuditLog['type'] = 'INFO'): Promise<void> {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    const logs: AuditLog[] = data ? JSON.parse(data) : [];
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      details,
      type
    };
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([newLog, ...logs].slice(0, 100)));
  }

  static async getAuditLogs(): Promise<AuditLog[]> {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  }

  static async resetSystem(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    window.location.reload();
  }
}
