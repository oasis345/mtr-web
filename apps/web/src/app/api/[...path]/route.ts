import { NextRequest, NextResponse } from 'next/server';
import { appServices } from '@/service/server';

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

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
    const response = await appServices.httpClient.request({
      method,
      url: apiPath,
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      data,
      headers,
      params,
    });

    // 원본 상태코드/데이터 그대로 전달
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    // 에러 정규화 후 상태/메시지 전달
    const normalized = appServices.errorService.normalize(error);
    const status = normalized.status ?? 500;

    return NextResponse.json(
      {
        error: normalized.getSafeMessage(),
        code: normalized.code,
        context: normalized.context,
      },
      { status },
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return handleApiRequest(request, 'GET', path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return handleApiRequest(request, 'POST', path, await request.json());
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return handleApiRequest(request, 'PUT', path, await request.json());
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return handleApiRequest(request, 'DELETE', path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return handleApiRequest(request, 'PATCH', path, await request.json());
}
