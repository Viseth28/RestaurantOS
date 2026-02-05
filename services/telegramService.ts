import { Order } from '../types';

export const sendTelegramNotification = async (order: Order, botToken: string, chatId: string) => {
  if (!botToken || !chatId) {
    console.warn("Telegram Bot Token or Chat ID is missing. Notification skipped.");
    return;
  }

  // Use standard newlines, we will encode the whole message later
  const itemsList = order.items
    .map(i => `- ${i.quantity}x ${i.name}`)
    .join('\n');

  const message = `
🍽 <b>New Order Received!</b>
📍 <b>Table ${order.tableId}</b>
Order ID: #${order.id.slice(-4)}

${itemsList}

💰 <b>Total: $${order.total.toFixed(2)}</b>
  `.trim();

  try {
    // We must encode the message to handle spaces, newlines, and special characters correctly in the URL
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodedMessage}&parse_mode=HTML`;
    
    // We use mode: 'no-cors' to allow sending the request from the browser to Telegram's API
    // which does not support CORS headers. 
    // The response will be "opaque" (we can't read the result), but the message will be sent.
    await fetch(url, { mode: 'no-cors' });
    
    console.log("Telegram notification sent");
  } catch (error) {
    // Note: With no-cors, we won't catch HTTP errors (like 400 Bad Request), only network errors.
    console.error("Error sending Telegram notification:", error);
  }
};