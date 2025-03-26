import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Region } from '@prisma/client';

export async function PUT(
  request: Request,
  { params }: { params: { prizeId: string; region: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { pointValue, stock } = await request.json();
    const { prizeId, region } = params;

    const updatedPrize = await prisma.prize.update({
      where: { id: prizeId },
      data: {
        pointValue,
        stock,
        region: region as Region,
      },
    });

    return NextResponse.json(updatedPrize);
  } catch (error) {
    console.error('Error updating regional price:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}