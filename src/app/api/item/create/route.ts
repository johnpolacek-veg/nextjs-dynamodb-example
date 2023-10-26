import { NextRequest, NextResponse } from "next/server";
import * as uuid from "uuid";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export async function PUT(req: NextRequest): Promise<void | NextResponse> {
  try {
    const { content } = await req.json();

    const Item = {
      id: { S: uuid.v4() },
      content: { S: content },
    };

    await client.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item,
      })
    );
    return NextResponse.json(Item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: `${error.message || "Could not create item"}` },
      { status: 500 }
    );
  }
}
