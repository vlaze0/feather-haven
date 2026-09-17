export type Role = 'ADMIN' | 'CUSTOMER' | string;

export type BirdStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'COMING_SOON' | string;

export type DeliveryMethod = 'HOME_DELIVERY' | 'STORE_PICKUP' | string;

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | string;

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | string;

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
}

export interface BirdItem {
  id: string;
  birdCode: string;
  name: string;
  slug: string;
  species: string;
  variety?: string | null;
  color: string;
  age: string;
  gender: string;
  price: number;
  status: BirdStatus;
  healthStatus: string;
  healthInfo?: string | null;
  careLevel: string;
  dietRecommendation?: string | null;
  temperament?: string | null;
  description: string;
  images: string[];
  isDeliveryAllowed: boolean;
  createdAt: string;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: string | null;
  suitableFor?: string | null;
  packageWeight?: string | null;
  ingredients?: string | null;
  dimensions?: string | null;
  material?: string | null;
  price: number;
  discountPrice?: number | null;
  stock: number;
  description: string;
  isFeatured: boolean;
  images: { id: string; url: string; isPrimary: boolean }[];
}

export interface CartLineItem {
  id: string;
  type: 'bird' | 'product';
  birdId?: string;
  productId?: string;
  bird?: BirdItem;
  product?: ProductItem;
  quantity: number;
  unitPrice: number;
  title: string;
  image: string;
  selectedGender?: 'Male' | 'Female' | 'Pair' | string;
}

export interface CouponItem {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED' | string;
  value: number;
  minOrderAmount: number;
  maxDiscount?: number | null;
  isActive: boolean;
}

export interface OrderItemRecord {
  id: string;
  title: string;
  price: number;
  quantity: number;
  birdId?: string | null;
  productId?: string | null;
  bird?: { name: string; birdCode: string; images: string } | null;
  product?: { name: string; images: { url: string }[] } | null;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryMethod: DeliveryMethod;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  totalAmount: number;
  couponCode?: string | null;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string | null;
  orderItems: OrderItemRecord[];
  createdAt: string;
}
