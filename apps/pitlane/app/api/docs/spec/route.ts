import { NextResponse } from 'next/server';
import { generateOpenAPISpec } from '@manuraj/domain';

export async function GET() {
  const spec = generateOpenAPISpec();
  return NextResponse.json(spec);
}
