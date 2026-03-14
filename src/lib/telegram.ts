import { AgentAction } from './types';

export async function sendTelegramAlert(action: AgentAction) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log("Mock Telegram Alert (Add keys to .env for real push notifications):", action.reasoning);
    return;
  }

  const message = `
🤖 *real_nigerian_prince* Action Alert
MODULE: \`${action.module}\`
STATUS: 🚀 ${action.status}

*Reasoning:*
_${action.reasoning}_

*Estimated Yield/Saved:*
+$${Number(action.pnlImpact).toLocaleString()}

[Open Dashboard to Execute Payload]
  `;

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (errorText.includes("chat not found")) {
        console.error("❌ Telegram Error: Chat not found. Have you clicked 'START' in the bot yet? (t.me/the_real_nigerian_prince_bot)");
      } else {
        console.error("Telegram API Error:", errorText);
      }
    }
  } catch (error: any) {
    console.log(`[Telegram] Alert delivery failed. Network may be blocking api.telegram.org (ETIMEDOUT).`);
  }
}
