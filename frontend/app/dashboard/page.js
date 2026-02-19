"use client";

import { useEffect, useState } from "react";
import { itemService } from "@/api/item.service.js"
import toast from "react-hot-toast";

export default function Dashboard({ currentUser }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = currentUser?.roleName === "admin";

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await itemService.getItems();
            setItems(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch items");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm("Delete this item?")) return;

        try {
            const res = await itemService.deleteItem(itemId);
            toast.success(res.data.message);
            setItems(items.filter(item => item._id !== itemId));
        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed");
        }
    };

    if (loading) return <div className="p-8 text-neutral-500 text-sm">Loading...</div>;

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-300 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center border-b border-neutral-800 pb-4 mb-6">
                    <h1 className="text-lg font-medium text-neutral-100">Items</h1>
                    <button className="px-3 py-1.5 text-sm bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded transition-colors">
                        + New Item
                    </button>
                </div>

                <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={item._id}
                            className="p-4 bg-neutral-900/50 border border-neutral-800 rounded flex justify-between items-start"
                        >
                            <div>
                                <h2 className="text-sm font-medium text-neutral-200">{item.title}</h2>
                                <p className="text-sm text-neutral-500 mt-1">{item.description}</p>

                                {isAdmin && item.createdBy && (
                                    <p className="text-xs text-neutral-600 mt-3">
                                        Created by: {item.createdBy.fullname} ({item.createdBy.email})
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button className="px-2 py-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors">
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="px-2 py-1 text-xs text-red-400/70 hover:text-red-400 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-sm text-neutral-600 italic">No items found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}