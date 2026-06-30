import { STORE_CONFIG } from '../config/store.js';
import { getLocalizedField } from './formatters.js';

function sanitizeWhatsAppNumber(phoneNumber = '') {
  return phoneNumber.replace(/[^\d]/g, '');
}

function formatAmount(value, currency) {
  return `${Number(value || 0)} ${currency || STORE_CONFIG.currency}`;
}

export function buildWhatsAppMessage({
  orderNumber,
  customer,
  items,
  subtotal,
  deliveryFee,
  total,
  language,
  currency = STORE_CONFIG.currency,
}) {
  const isArabic = language === 'ar';
  const productLines = items
    .map((item, index) => {
      const productName = getLocalizedField(item, 'name', language);
      const lineTotal = item.price * item.quantity;

      if (isArabic) {
        return `${index + 1}. ${productName} × ${item.quantity} = ${formatAmount(lineTotal, currency)}`;
      }

      return `${index + 1}. ${productName} × ${item.quantity} = ${formatAmount(lineTotal, currency)}`;
    })
    .join('\n');

  if (isArabic) {
    return `السلام عليكم، أريد تأكيد طلب من Najem Store.

رقم الطلب: ${orderNumber || 'غير متوفر'}

معلومات الزبون:
الاسم: ${customer.fullName}
الهاتف: ${customer.phone}
المدينة: ${customer.city}
العنوان: ${customer.address}
ملاحظات: ${customer.notes || 'لا توجد ملاحظات'}

المنتجات:

${productLines}

المجموع الفرعي: ${formatAmount(subtotal, currency)}
رسوم التوصيل: ${formatAmount(deliveryFee, currency)}
المجموع الكلي: ${formatAmount(total, currency)}

طريقة الدفع: الدفع عند الاستلام`;
  }

  return `Hello, I would like to confirm an order from Najem Store.

Order number: ${orderNumber || 'N/A'}

Customer information:
Name: ${customer.fullName}
Phone: ${customer.phone}
City: ${customer.city}
Address: ${customer.address}
Notes: ${customer.notes || 'None'}

Products:

${productLines}

Subtotal: ${formatAmount(subtotal, currency)}
Delivery fee: ${formatAmount(deliveryFee, currency)}
Total: ${formatAmount(total, currency)}

Payment method: Cash on Delivery`;
}

export function createWhatsAppOrderUrl(order) {
  const message = buildWhatsAppMessage(order);
  const phone = sanitizeWhatsAppNumber(order.whatsappNumber || STORE_CONFIG.whatsappNumber);

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
