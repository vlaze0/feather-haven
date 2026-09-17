import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserFromReq } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = getSessionUserFromReq(req);
    const body = await req.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryMethod, // HOME_DELIVERY | STORE_PICKUP
      address,
      city,
      state,
      pincode,
      couponCode,
      paymentMethod,
      notes,
      items, // array of { type: 'bird'|'product', birdId, productId, quantity, unitPrice, title }
    } = body;

    if (!customerName || !customerPhone || !customerEmail || !items || items.length === 0) {
      return NextResponse.json({ error: 'Customer name, phone, email, and cart items are required.' }, { status: 400 });
    }

    if (deliveryMethod === 'HOME_DELIVERY' && (!address || !city || !pincode)) {
      return NextResponse.json({ error: 'Delivery address, city, and PIN code are required for Home Delivery.' }, { status: 400 });
    }

    // Atomic Database Transaction for double-buy protection & inventory reduction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify all bird & product items
      let subtotal = 0;
      const orderItemsToCreate: any[] = [];

      for (const item of items) {
        if (item.type === 'bird' && item.birdId) {
          const bird = await tx.bird.findUnique({
            where: { id: item.birdId },
          });

          if (!bird) {
            throw new Error(`Bird with ID ${item.birdId} was not found.`);
          }

          if (bird.status !== 'AVAILABLE') {
            throw new Error(`Sorry, ${bird.name} (${bird.birdCode}) has already been ${bird.status.toLowerCase()}!`);
          }

          // Mark bird as SOLD atomically
          await tx.bird.update({
            where: { id: bird.id },
            data: { status: 'SOLD' },
          });

          const itemTotal = bird.price;
          subtotal += itemTotal;

          orderItemsToCreate.push({
            birdId: bird.id,
            title: bird.name,
            price: bird.price,
            quantity: 1,
          });
        } else if (item.type === 'product' && item.productId) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new Error(`Product ${item.title} not found.`);
          }

          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}. Only ${product.stock} left.`);
          }

          // Reduce product stock atomically
          await tx.product.update({
            where: { id: product.id },
            data: { stock: { decrement: item.quantity } },
          });

          const price = product.discountPrice ?? product.price;
          const itemTotal = price * item.quantity;
          subtotal += itemTotal;

          orderItemsToCreate.push({
            productId: product.id,
            title: product.name,
            price: price,
            quantity: item.quantity,
          });
        }
      }

      // 2. Validate Coupon if provided
      let discountAmount = 0;
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode.toUpperCase().trim() },
        });

        if (coupon && coupon.isActive && subtotal >= coupon.minOrderAmount) {
          if (coupon.type === 'PERCENTAGE') {
            discountAmount = (subtotal * coupon.value) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else {
            discountAmount = coupon.value;
          }

          // Update coupon usage count
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }

      // 3. Delivery charge
      const deliveryCharge =
        deliveryMethod === 'STORE_PICKUP' ? 0 : subtotal === 0 || subtotal >= 1999 ? 0 : 99;

      const totalAmount = Math.max(0, subtotal - discountAmount + deliveryCharge);

      // 4. Generate order number
      const count = await tx.order.count();
      const orderNumber = `FH-${new Date().getFullYear()}-${1000 + count + 1}`;

      // 5. Create Order record
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user ? user.id : null,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim(),
          deliveryMethod: deliveryMethod || 'HOME_DELIVERY',
          address: deliveryMethod === 'STORE_PICKUP' ? 'Store Pickup - MG Road Bengaluru' : address.trim(),
          city: deliveryMethod === 'STORE_PICKUP' ? 'Bengaluru' : city.trim(),
          state: deliveryMethod === 'STORE_PICKUP' ? 'Karnataka' : (state || '').trim(),
          pincode: deliveryMethod === 'STORE_PICKUP' ? '560001' : pincode.trim(),
          subtotal,
          discountAmount,
          deliveryCharge,
          totalAmount,
          couponCode: couponCode || null,
          paymentMethod: paymentMethod || 'COD',
          paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
          orderStatus: 'CONFIRMED',
          notes: notes || null,
          orderItems: {
            create: orderItemsToCreate,
          },
        },
        include: {
          orderItems: true,
        },
      });

      return newOrder;
    });

    return NextResponse.json({ success: true, order: result });
  } catch (error: any) {
    console.error('Order placement error:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order.' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = getSessionUserFromReq(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let where: any = {};

    if (user.role !== 'ADMIN') {
      where.userId = user.id;
    } else if (status && status !== 'ALL') {
      where.orderStatus = status;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            bird: true,
            product: {
              include: { images: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch orders.' }, { status: 500 });
  }
}
