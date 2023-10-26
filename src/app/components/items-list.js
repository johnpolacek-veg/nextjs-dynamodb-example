"use client";
import useSWR, { mutate } from "swr";
import { useState } from "react";
import fetcher from "./util/fetcher";

export default function ItemsList() {
  const { data, error } = useSWR("/api/items", fetcher);
  const [newItemContent, setNewItemContent] = useState("");

  const handleAddItem = async () => {
    const newItem = { id: { S: "" }, content: { S: newItemContent } }; // Temp ID will be replaced by actual ID from server
    const optimisticData = data ? [...data, newItem] : [newItem];

    // Optimistically update the list
    mutate("/api/items", optimisticData, false);

    const response = await fetch("/api/item/create", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newItemContent }),
    });

    if (response.ok) {
      // If the request is successful, re-fetch /api/items to get the actual updated list
      mutate("/api/items");
      setNewItemContent(""); // Clear the input field
    } else {
      console.error("Failed to add item:", response.statusText);
      // If the request fails, revert back to the original data
      mutate("/api/items", data, false);
    }
  };

  const handleDeleteItem = async (id) => {
    // Optimistically update the list
    const updatedData = data.filter((item) => item.id.S !== id);
    mutate("/api/items", updatedData, false);

    const response = await fetch("/api/item/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      console.error("Failed to delete item:", response.statusText);
      // If the request fails, revert back to the original data
      mutate("/api/items", data, false);
    } else {
      // If the request is successful, re-fetch /api/items to get the actual updated list
      mutate("/api/items");
    }
  };

  if (error)
    return (
      <div className="text-red-500">An error has occurred: {error.message}</div>
    );
  if (!data)
    return (
      <div className="text-gray-500 text-xl text-center py-16 italic">
        Loading...
      </div>
    );

  return (
    <>
      <div className="border mt-2 mb-8">
        {data.length === 0 ? (
          <div className="p-4 text-gray-500">No items yet.</div>
        ) : (
          <ul className="flex flex-col divide-y">
            {data.map((item, index) => (
              <li key={index} className="p-4 flex items-center justify-between">
                {item.content.S}
                <button
                  onClick={() => handleDeleteItem(item.id.S)}
                  className="text-red-600 px-2 scale-150"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h3 className="text-lg my-1">Add Item</h3>
      <input
        type="text"
        value={newItemContent}
        onChange={(e) => setNewItemContent(e.target.value)}
        placeholder="New item content"
        className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
      />
      <button
        onClick={handleAddItem}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
      >
        Add Item
      </button>
    </>
  );
}
