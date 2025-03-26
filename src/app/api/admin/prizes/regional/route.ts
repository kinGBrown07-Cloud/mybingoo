import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const regionalPrices = await prisma.prize.findMany({
      select: {
        id: true,
        name: true,
        pointValue: true,
        stock: true,
        region: true,
      },
    });

    // Organiser les prix par région
    const pricesByRegion = regionalPrices.reduce((acc, price) => {
      if (!acc[price.id]) {
        acc[price.id] = [];
      }
      acc[price.id].push({
        prizeId: price.id,
        region: price.region,
        pointValue: price.pointValue,
        stock: price.stock,
      });
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json(pricesByRegion);
  } catch (error) {
    console.error('Error fetching regional prices:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { prizeId, region, pointValue, stock } = await request.json();

    const updatedPrize = await prisma.prize.update({
      where: { id: prizeId },
      data: {
        pointValue,
        stock,
        region,
      },
    });

    return NextResponse.json(updatedPrize);
  } catch (error) {
    console.error('Error updating regional price:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}