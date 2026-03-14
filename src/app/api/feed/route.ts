import { NextResponse } from 'next/server';
import { fetchNextDemoEvent } from '@/lib/chainmerge';
import { processEvent } from '@/lib/iqai';

// In a real app, this would use Server-Sent Events (SSE) or WebSockets.
// For the Next.js API route demo, we'll build a simple polling endpoint 
// that advances an index to simulate a live stream of data.
let eventIndex = 0;

export async function GET() {
  try {
    // 1. Fetch normalized data from ChainMerge SDK (simulated stream)
    const rawEvent = await fetchNextDemoEvent(eventIndex);
    eventIndex++;
    
    // 2. Feed the normalized multi-chain event into the IQ AI Engine
    const action = await processEvent(rawEvent as any);
    
    // 3. Fire optional Telegram Webhook (Safe/Silent delivery)
    if (action.status === 'EXECUTED') {
       try {
         await import('@/lib/telegram').then(m => m.sendTelegramAlert(action));
       } catch (teleError) {
         console.log("[SILENT] Telegram delivery skipped (Offline/Timeout)");
       }
    }
    
    return NextResponse.json(action);
  } catch (error) {
    // If it's a 429, we've already handled the simulation in processEvent, 
    // but just in case something else slipped through:
    console.log("[IQ AI] [SHADOW_MODE] Resilient dispatch in progress...");
    return NextResponse.json({ error: "System at capacity. Shadow Mode active." }, { status: 500 });
  }
}
