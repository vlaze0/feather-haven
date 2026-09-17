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
