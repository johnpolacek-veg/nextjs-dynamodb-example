"use client";
import { useState, useEffect } from "react";

export default function ItemsList() {
  const [items, setItems] = useState([]);
  const [newItemContent, setNewItemContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items", {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (event) => {
    event.preventDefault(); // Prevent default form submission
    // Optimistically update the items list
    const optimisticUpdate = [...items, { id: { S: "temp-id" }, content: { S: newItemContent } }];
    setItems(optimisticUpdate);

    try {
      const response = await fetch("/api/item/create", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newItemContent }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setNewItemContent(""); // Clear the input field
    } catch (err) {
      console.error("Failed to add item:", err.message);
      // Revert to previous state in case of error
      fetchItems();
    }
  };

  const handleDeleteItem = async (id) => {
    // Optimistically update the items list
    const optimisticUpdate = items.filter((item) => item.id.S !== id);
    setItems(optimisticUpdate);

    try {
      const response = await fetch("/api/item/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (err) {
      console.error("Failed to delete item:", err.message);
      // Revert to previous state in case of error
      fetchItems();
    }
  };

  if (error) {
    return <div className="text-red-500">An error has occurred: {error.message}</div>;
  }
  if (loading) {
    return <div className="text-gray-500 text-xl text-center py-16 italic">Loading...</div>;
  }

  return (
    <>
      <div className="border mt-2 mb-8">
        {items.length === 0 ? (
          <div className="p-4 text-gray-500">No items yet.</div>
        ) : (
          <ul className="flex flex-col divide-y">
            {items.map((item, index) => (
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
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          value={newItemContent}
          onChange={(e) => setNewItemContent(e.target.value)}
          placeholder="New item content"
          required
          className="border border-gray-300 p-2 rounded mb-4 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-4"
        >
          Add Item
        </button>
      </form>
    </>
  );
}
