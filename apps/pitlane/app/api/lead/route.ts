import { NextRequest, NextResponse } from 'next/server';
import { connectDB, leadRepository } from '@manuraj/data-access';
import { leadSchema } from '@manuraj/domain';

// Public lead-capture endpoint. Called cross-origin by the Showroom landing,
// so it advertises CORS. No auth, no cookies — safe to expose.
const ALLOWED_ORIGIN = process.env.SHOWROOM_URL || '*';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400, headers: corsHeaders }
      );
    }

    await connectDB();

    await leadRepository.create({
      ...parsed.data,
      source: 'showroom',
    });

    return NextResponse.json(
      { message: 'Recebemos seu contato! Retornaremos em breve.' },
      { status: 201, headers: corsHeaders }
    );
  } catch {
    return NextResponse.json(
      { message: 'Erro ao enviar. Tente novamente.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
