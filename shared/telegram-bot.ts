/**
 * Telegram Bot Handler
 * Handles bot responses and lead capture
 */

const BOT_TOKEN = "8142972713:AAGhqPeK_uHnx80DgJAWa7xAd4I2pHLAwgE";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// FAQ responses
const FAQ: Record<string, string> = {
  services:
    "🤖 *AI-CoreLogic Services*\n\nWe provide:\n• AI Discovery & Strategy\n• AI Implementation\n• AI Research & Development\n• AI Maturity Assessment\n• AI Training & Enablement\n\nWhat interests you most?",
  pricing:
    "💰 *Pricing*\n\nOur pricing is customized based on your specific needs, company size, and project scope. We offer:\n• Discovery calls (free)\n• Hourly consulting rates\n• Project-based engagements\n• Retainer arrangements\n\nLet's discuss your budget!",
  timeline:
    "⏱️ *Project Timeline*\n\nTypical engagements:\n• AI Discovery: 2-4 weeks\n• Implementation: 3-6 months\n• Maturity Assessment: 1-2 weeks\n• Training Programs: 4-8 weeks\n\nTimelines vary based on scope and complexity.",
  team:
    "👤 *About Rodney Chiasson*\n\nFounder & Enterprise AI/Cloud Architect\n• 25+ years of experience\n• Led $25M+ cloud transformations\n• Expertise in multi-cloud, agentic AI, MLOps\n• Harvard M.S. in Data Science\n• AWS, GCP, IBM Certified Architect",
  contact:
    "📞 *Contact Us*\n\n📧 Email: rodchiasson@ai-corelogic.com\n☎️ Phone: +1 (727) 318-9265\n🌍 Offices: London, UK & New York, USA\n💬 Chat: Available 24/7",
  discovery:
    "🔍 *Discovery Call*\n\nOur free discovery call includes:\n• Understanding your AI needs\n• Assessing your current state\n• Identifying quick wins\n• Discussing next steps\n\nReady to book? Reply with your preferred time!",
};

const QUICK_REPLIES = [
  { text: "Services", callback_data: "services" },
  { text: "Pricing", callback_data: "pricing" },
  { text: "Timeline", callback_data: "timeline" },
  { text: "Team", callback_data: "team" },
  { text: "Contact", callback_data: "contact" },
  { text: "Book Discovery Call", callback_data: "discovery" },
];

export async function handleTelegramMessage(message: any) {
  const chatId = message.chat.id;
  const text = message.text?.toLowerCase() || "";
  const messageId = message.message_id;

  // Greeting message
  if (text === "/start") {
    await sendMessage(
      chatId,
      "👋 Welcome to AI-CoreLogic!\n\nI'm here to help you learn about our AI consulting services. What would you like to know?",
      QUICK_REPLIES
    );
    return;
  }

  // Check for FAQ keywords
  for (const [key, response] of Object.entries(FAQ)) {
    if (text.includes(key)) {
      await sendMessage(chatId, response);
      await sendMessage(chatId, "What else can I help you with?", QUICK_REPLIES);
      return;
    }
  }

  // Default response with quick replies
  await sendMessage(
    chatId,
    "I didn't quite understand that. Please select one of the options below or type your question:",
    QUICK_REPLIES
  );
}

export async function handleTelegramCallback(callbackQuery: any) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  const messageId = callbackQuery.message.message_id;

  const response = FAQ[data] || "I'm not sure about that. Please try again.";

  // Edit message with response
  await editMessage(chatId, messageId, response, QUICK_REPLIES);

  // Answer callback query (removes loading state)
  await answerCallbackQuery(callbackQuery.id);
}

async function sendMessage(
  chatId: number,
  text: string,
  replyMarkup?: any[]
) {
  const keyboard = replyMarkup
    ? {
        inline_keyboard: [replyMarkup.map((r) => ({ text: r.text, callback_data: r.callback_data }))],
      }
    : undefined;

  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
    ...(keyboard && { reply_markup: keyboard }),
  };

  try {
    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
}

async function editMessage(
  chatId: number,
  messageId: number,
  text: string,
  replyMarkup?: any[]
) {
  const keyboard = replyMarkup
    ? {
        inline_keyboard: [replyMarkup.map((r) => ({ text: r.text, callback_data: r.callback_data }))],
      }
    : undefined;

  const payload = {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "Markdown",
    ...(keyboard && { reply_markup: keyboard }),
  };

  try {
    const response = await fetch(`${TELEGRAM_API}/editMessageText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Error editing Telegram message:", error);
  }
}

async function answerCallbackQuery(callbackQueryId: string) {
  try {
    await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: callbackQueryId }),
    });
  } catch (error) {
    console.error("Error answering callback query:", error);
  }
}

export async function setWebhook(webhookUrl: string) {
  try {
    const response = await fetch(`${TELEGRAM_API}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: webhookUrl }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error setting webhook:", error);
  }
}
