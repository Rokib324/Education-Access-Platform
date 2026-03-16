"use client";

import { useEffect, useState } from "react";
import { 
  BiSearch, 
  BiUserPlus, 
  BiEditAlt, 
  BiTrash, 
  BiBlock, 
  BiCheckCircle,
  BiX,
  BiLoaderAlt,
  BiChevronLeft,
  BiChevronRight
} from "react-icons/bi";

interface User {
  _id: string;
  full_name: string;
  email: string;
  role_id: {
    _id: string;
    role_name: string;
  };
  status: "active" | "banned";
  is_banned: boolean;
  gender: "male" | "female" | "other";
  profile_photo?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<"student" | "teacher">("student");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student",
    gender: "male"
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?role=${activeTab}`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        full_name: user.full_name,
        email: user.email,
        password: "", // Don't show password on edit
        role: user.role_id.role_name,
        gender: user.gender || "male"
      });
    } else {
      setEditingUser(null);
      setFormData({
        full_name: "",
        email: "",
        password: "",
        role: activeTab,
        gender: "male"
      });
    }
    setShowModal(true);
    setMessage(null);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const url = editingUser ? `/api/admin/users/${editingUser._id}` : "/api/admin/users";
    const method = editingUser ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: editingUser ? "User updated!" : "User created!" });
        fetchUsers();
        setTimeout(() => setShowModal(false), 1500);
      } else {
        throw new Error(data.error || "Failed to save user");
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleBanToggle = async (user: User) => {
    const newBanned = !user.is_banned;
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          is_banned: newBanned,
          status: newBanned ? "banned" : "active"
        }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error("Failed to toggle ban", err);
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">User Management</h1>
          <p className="text-sm text-zinc-500">Manage students, teachers, and their access.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-all active:scale-95"
        >
          <BiUserPlus className="h-5 w-5" />
          Add New User
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex p-1 bg-zinc-100 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("student")}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === "student" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab("teacher")}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === "teacher" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Teachers
          </button>
        </div>

        <div className="relative max-w-sm w-full">
          <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50/50 text-zinc-500 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    <BiLoaderAlt className="mx-auto h-6 w-6 animate-spin text-zinc-400 mb-2" />
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 overflow-hidden shrink-0">
                          {user.profile_photo ? (
                            <img src={user.profile_photo} alt={user.full_name} className="h-full w-full object-cover" />
                          ) : (
                            <img 
                              src={
                                user.role_id.role_name === "teacher"
                                  ? user.gender === "female" 
                                    ? "/female-teacher-default-image.png"
                                    : "/male-teacher-default-image.png"
                                  : user.gender === "female"
                                    ? "/girl-student-default-image.png"
                                    : "/boy-student-default-image.png"
                              } 
                              alt={user.full_name} 
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900">{user.full_name}</p>
                          <p className="text-xs text-zinc-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                        user.is_banned 
                        ? "bg-red-100 text-red-700" 
                        : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {user.is_banned ? <BiBlock className="h-3 w-3" /> : <BiCheckCircle className="h-3 w-3" />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleBanToggle(user)}
                          title={user.is_banned ? "Unban User" : "Ban User"}
                          className={`p-2 rounded-lg transition-colors ${
                            user.is_banned 
                            ? "text-emerald-600 hover:bg-emerald-50" 
                            : "text-amber-600 hover:bg-amber-50"
                          }`}
                        >
                          {user.is_banned ? <BiCheckCircle className="h-5 w-5" /> : <BiBlock className="h-5 w-5" />}
                        </button>
                        <button 
                          onClick={() => handleOpenModal(user)}
                          title="Edit User"
                          className="p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors"
                        >
                          <BiEditAlt className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user._id)}
                          title="Delete User"
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <BiTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 italic">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">
                {editingUser ? "Edit User" : "Add New User"}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
              >
                <BiX className="h-6 w-6" />
              </button>
            </div>

            {message && (
              <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${
                message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                  placeholder="john@example.com"
                />
              </div>
              {!editingUser && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700">Initial Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all bg-white"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all bg-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                >
                  {saving && <BiLoaderAlt className="h-4 w-4 animate-spin" />}
                  {editingUser ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}