import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from '@/api';

// API 요청 처리 함수
async function handleApiRequest(
  request: NextRequest,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  path: string[],
  data?: unknown,
) {
  const headers = Object.fromEntries(request.headers.entries());
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const apiPath = '/' + path.map(encodeURIComponent).join('/');

  try {
    const response = await serverApi.request({
      method,
      url: apiPath,
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      data,
      headers,
      params,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { path } = params;
  return handleApiRequest(request, 'GET', path);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { path } = params;
  return handleApiRequest(request, 'POST', path, await request.json());
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { path } = params;
  return handleApiRequest(request, 'PUT', path, await request.json());
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { path } = params;
  return handleApiRequest(request, 'DELETE', path);
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { path } = params;
  return handleApiRequest(request, 'PATCH', path, await request.json());
}
