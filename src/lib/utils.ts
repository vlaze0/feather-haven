import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateWhatsAppLink(phoneNumber: string, message: string): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

export function generateBirdEnquiryMessage(birdName: string, birdCode: string, price: number): string {
  return `Hello Feather Haven, I am interested in ${birdName} [Ref: ${birdCode}] listed for ${formatCurrency(
    price
  )}. Is it currently available for purchase?`;
}

export function generateProductEnquiryMessage(productName: string, price: number): string {
  return `Hello Feather Haven, I have an enquiry about ${productName} listed for ${formatCurrency(
    price
  )}. Can you confirm stock availability?`;
}

export interface WhatsAppOrderDetails {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: string;
  address?: string;
  city?: string;
  pincode?: string;
  items: Array<{ title: string; quantity: number; price: number }>;
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  notes?: string;
}

export function generateWhatsAppOrderScript(order: WhatsAppOrderDetails): string {
  const itemsText = order.items
    .map((item) => `• ${item.title} (x${item.quantity}) - ${formatCurrency(item.price * item.quantity)}`)
    .join('\n');

  const deliveryText =
    order.deliveryMethod === 'STORE_PICKUP'
      ? '🏬 Store Pickup (MG Road Bengaluru)'
      : `🚚 Home Delivery\n📍 Address: ${order.address || ''}, ${order.city || ''} ${order.pincode || ''}`;

  return `🦜 *NEW ORDER: Feather Haven Aviary*
━━━━━━━━━━━━━━━━━━━━
*Order ID:* #${order.orderNumber}

*Customer Details:*
👤 *Name:* ${order.customerName}
📞 *Phone:* ${order.customerPhone}
${deliveryText}

*Items Ordered:*
${itemsText}

━━━━━━━━━━━━━━━━━━━━
*Subtotal:* ${formatCurrency(order.subtotal)}
${order.discountAmount > 0 ? `*Discount:* -${formatCurrency(order.discountAmount)}\n` : ''}*Delivery:* ${order.deliveryCharge === 0 ? 'FREE' : formatCurrency(order.deliveryCharge)}
*Total Amount:* *${formatCurrency(order.totalAmount)}*
*Payment Mode:* ${order.paymentMethod === 'UPI' ? 'UPI / QR Code' : 'Cash on Delivery (COD)'}
${order.notes ? `*Notes:* ${order.notes}\n` : ''}━━━━━━━━━━━━━━━━━━━━
Hello Feather Haven! I have placed this order on your store. Please confirm availability and delivery schedule!`;
}
