import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@manuraj/data-access';

// GET /api/health - Public health check endpoint
export async function GET() {
  const start = Date.now();

  try {
    await connectDB();
    const dbState = mongoose.connection.readyState;
    const latency = Date.now() - start;

    return NextResponse.json({
      status: 'ok',
      db: dbState === 1 ? 'connected' : 'disconnected',
      latency: `${latency}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        status: 'error',
        db: 'disconnected',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
