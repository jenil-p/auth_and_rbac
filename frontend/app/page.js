"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/api/auth.service.js";
import { itemService } from "@/api/item.service.js";

export default function HomePage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const [items, setItems] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newItem, setNewItem] = useState({ title: "", description: "" });

  const [editingItemId, setEditingItemId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: "", description: "" });

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const userRes = await authService.getMe();
      const user = userRes.data.user;
      setCurrentUser(user);

      const itemsRes = await itemService.getItems();
      setItems(itemsRes.data);

      if (user.role?.name === "admin" || user.roleName === "admin") {
        const usersRes = await authService.getAllUsers();
        setAllUsers(usersRes.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
      } else {
        toast.error("Failed to load dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      const res = await itemService.createItem(newItem);
      toast.success(res.data.message);
      setItems([res.data.item, ...items]);
      setNewItem({ title: "", description: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create item");
    }
  };

  const startEditing = (item) => {
    setEditingItemId(item._id);
    setEditFormData({ title: item.title, description: item.description });
  };

  const cancelEditing = () => {
    setEditingItemId(null);
    setEditFormData({ title: "", description: "" });
  };

  const handleUpdateItem = async (id) => {
    try {
      const res = await itemService.updateItem(id, editFormData);
      toast.success(res.data.message || "Item updated successfully");

      setItems(items.map(item => item._id === id ? res.data.item : item));

      setEditingItemId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update item");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Delete this record permanently?")) return;
    try {
      const res = await itemService.deleteItem(id);
      toast.success(res.data.message);
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete item");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to ban/delete this user?")) return;
    try {
      const res = await authService.deleteUser(userId);
      toast.success(res.data.message);
      setAllUsers(allUsers.filter((u) => u._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-500 text-sm">Loading workspace...</div>;
  }

  if (!currentUser) return null;

  const isAdmin = currentUser.role?.name === "admin" || currentUser.roleName === "admin";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* header */}
        <header className="flex justify-between items-center border-b border-neutral-800 pb-4">
          <div>
            <h1 className="text-lg font-medium text-neutral-100">
              {isAdmin ? "Admin Command Center" : "My Dashboard"}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">Logged in as {currentUser.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded transition-colors"
          >
            Logout
          </button>
        </header>

        {/* make item */}
        {!isAdmin && (
          <section className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-lg">
            <h2 className="text-sm font-medium text-neutral-200 mb-3">Write a new item</h2>
            <form onSubmit={handleCreateItem} className="space-y-3">
              <input
                type="text"
                placeholder="Title one"
                required
                className="w-full px-3 py-1.5 text-sm bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-neutral-600 transition-colors"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              />
              <textarea
                placeholder="we have to do this task..."
                required
                rows={2}
                className="w-full px-3 py-1.5 text-sm bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-neutral-600 transition-colors resize-none"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs bg-neutral-200 hover:bg-white text-neutral-900 font-medium rounded transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </section>
        )}

        {/* items listed here */}
        <section>
          <h2 className="text-sm font-medium text-neutral-400 mb-3 uppercase tracking-wider">
            {isAdmin ? "All System Items" : "My Items"}
          </h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item._id} className="p-3 bg-neutral-900/20 border border-neutral-800/60 rounded flex flex-col sm:flex-row justify-between items-start hover:border-neutral-700 transition-colors">

                {editingItemId === item._id ? (
                  <div className="w-full space-y-2">
                    <input
                      type="text"
                      className="w-full px-2 py-1 text-sm bg-neutral-950 border border-neutral-700 rounded text-neutral-200 focus:outline-none focus:border-neutral-500 transition-colors"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    />
                    <textarea
                      rows={2}
                      className="w-full px-2 py-1 text-sm bg-neutral-950 border border-neutral-700 rounded text-neutral-200 focus:outline-none focus:border-neutral-500 transition-colors resize-none"
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={cancelEditing}
                        className="px-2 py-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateItem(item._id)}
                        className="px-2 py-1 text-xs bg-neutral-200 text-neutral-900 hover:bg-white rounded transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-full">
                      <h3 className="text-sm font-medium text-neutral-200">{item.title}</h3>
                      <p className="text-xs text-neutral-500 mt-1">{item.description}</p>

                      {isAdmin && item.createdBy && (
                        <div className="mt-2 text-[11px] text-neutral-600 bg-neutral-900/50 inline-block px-2 py-0.5 rounded">
                          Reporter: {item.createdBy.fullname}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 sm:ml-4 mt-3 sm:mt-0 shrink-0">
                      <button
                        onClick={() => startEditing(item)}
                        className="px-2 py-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="px-2 py-1 text-xs text-red-500/60 hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-xs text-neutral-600 italic">No records found.</p>
            )}
          </div>
        </section>

        {/* admin things */}
        {isAdmin && (
          <section className="pt-8 border-t border-neutral-800 mt-8">
            <h2 className="text-sm font-medium text-neutral-400 mb-3 uppercase tracking-wider">User Management</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allUsers.map((u) => (
                <div key={u._id} className="p-3 border border-neutral-800 rounded flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-300">{u.fullname}</p>
                    <p className="text-xs text-neutral-500">{u.email}</p>
                  </div>
                  {u._id !== currentUser._id && (
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="px-2 py-1 text-xs text-red-500/60 hover:text-red-400 transition-colors border border-red-500/20 rounded hover:border-red-500/40"
                    >
                      Ban User
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}