export const revalidate = 0

import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { NextResponse } from "next/server";

const client = new DynamoDBClient({});

export async function GET(req: Request): Promise<void | NextResponse> {
  try {
    const { Items } = await client.send(
      new ScanCommand({ TableName: process.env.TABLE_NAME, ConsistentRead: true }),
    );
    const response = NextResponse.json(Items, { status: 200 });
    response.headers.set('Cache-Control', 's-maxage=0, stale-while-revalidate');
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to retrieve items: ${String(error)}` },
      { status: 500 }
    );
  }
}
