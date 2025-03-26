import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { points: true }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json({ points: user.points });
  } catch (error) {
    console.error('Error fetching user points:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { points } = await request.json();

    if (typeof points !== 'number') {
      return new NextResponse('Invalid points value', { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { points }
    });

    return NextResponse.json({ points: user.points });
  } catch (error) {
    console.error('Error updating user points:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}