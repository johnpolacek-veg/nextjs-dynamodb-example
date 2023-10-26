import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export async function DELETE(req: NextRequest): Promise<void | NextResponse> {
  try {
    const { id } = await req.json();

    await client.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: id },
        },
      })
    );

    return NextResponse.json({ result: "Item was deleted" }, { status: 200 });
  } catch (error: any) {
    console.log({ error });
    return NextResponse.json(
      { error: `${error.message || "Could not delete item"}` },
      { status: 500 }
    );
  }
}
