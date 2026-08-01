import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Placeholder middleware
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
