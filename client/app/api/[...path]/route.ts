import { ServerAPICall } from "@/lib/axios";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// 요청 헤더에서 인증 정보 가져오기
const getAuthHeaders = (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  const cookie = request.cookies.toString();
  const headers: Record<string, string> = {};

  if (authHeader) {
    headers["Authorization"] = authHeader;
  }
  if (cookie) {
    headers["Cookie"] = cookie;
  }

  return headers;
};

// API 요청 처리 함수
async function handleApiRequest(request: NextRequest, method: string, path: string[], body?: any) {
  const pathString = path.join("/");
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const headers = getAuthHeaders(request);
  const searchParams = request.nextUrl.searchParams.toString();

  const urlWithQuery = `/${pathString}${searchParams ? `?${searchParams}` : ""}`;

  try {
    const response = await ServerAPICall.request({
      method,
      url: urlWithQuery,
      data: body,
      baseURL: baseUrl,
      headers,
      withCredentials: true,
    });

    const { success, data, code, message } = response.data;
    if (!success) NextResponse.json({ error: message }, { status: code });

    return NextResponse.json(data);
  } catch (error: any) {
    if (error.status === 401) {
      // 리프레시 토큰이 헤더에 있는지 확인
      const cookie = request.headers.get("cookie");
      const refreshToken = cookie
        ?.split("; ")
        .find((row) => row.startsWith("isnow_refresh_token="))
        ?.split("=")[1];

      if (refreshToken) {
        try {
          // 리프레시 토큰으로 새 액세스 토큰 요청
          const response = await axios.post(
            `${baseUrl}/auth/refresh`,
            { refreshToken },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // 새 토큰으로 원래 요청 재시도
          headers.Authorization = `Bearer ${accessToken}`;
          headers.Cookie = `isnow_refresh_token=${newRefreshToken}`;
          const retryResponse = await ServerAPICall.request({
            method,
            url: urlWithQuery,
            data: body,
            baseURL: baseUrl,
            headers,
            withCredentials: true,
          });

          // 새 토큰을 클라이언트에 전달
          const res = NextResponse.json(retryResponse.data);
          res.headers.set(
            "Set-Cookie",
            `isnow_access_token=${accessToken}; isnow_refresh_token=${newRefreshToken}; Path=/; HttpOnly; SameSite=Lax`
          );
          return res;
        } catch (refreshError) {
          return NextResponse.json({ error: "Token refresh failed" }, { status: 401 });
        }
      }
      console.log("refreshToken 없음");
    }

    return NextResponse.json({ error: error.message }, { status: error.response?.status || 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { path } = await params;

  return handleApiRequest(request, "GET", path);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { path } = await params;
  const contentType = request.headers.get("content-type");
  let body;

  if (contentType?.includes("multipart/form-data")) {
    body = await request.formData();
  } else {
    body = await request.json();
  }

  return handleApiRequest(request, "POST", path, body);
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { path } = await params;
  const body = await request.json();
  return handleApiRequest(request, "PUT", path, body);
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { path } = await params;
  return handleApiRequest(request, "DELETE", path);
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { path } = await params;
  const body = await request.json();
  return handleApiRequest(request, "PATCH", path, body);
}
