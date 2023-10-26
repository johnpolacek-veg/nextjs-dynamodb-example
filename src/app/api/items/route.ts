import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { NextRequest, NextResponse } from "next/server";

const client = new DynamoDBClient({});

export async function GET(req: NextRequest): Promise<void | NextResponse> {
  try {
    const { Items } = await client.send(
      new ScanCommand({ TableName: process.env.TABLE_NAME })
    );
    return NextResponse.json(Items, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to retrieve items: ${String(error)}` },
      { status: 500 }
    );
  }
}
