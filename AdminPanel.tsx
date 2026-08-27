import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fngttmeuonurvxlbdsrk.supabase.co',
  'sb_publishable_WaV9QizkutlQ8biHlz224A_UahRfYLw'
);

const ADMIN_EMAIL = 'admin@esport.com';
const ADMIN_PASSWORD = 'admin123';

interface User {
  id: number;
  uid: string;
  name: string;
  email: string;
  password: string;
  wallet: number;
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  totalEarned: number;
  joinDate: string;
  status: 'active' | 'blocked';
  phone: string;
}

function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [addAmount, setAddAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      loadUsers();
    }
  }, [isLoggedIn]);

  const loadUsers = async () => {
    const { data } = await supabase.from('users').select('*');
    if (data) setUsers(data);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      alert('بيانات الأدمن خاطئة');
    }
  };

  const updateWallet = async (userId: number, amount: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const updatedWallet = Math.max(0, user.wallet + amount);
    await supabase.from('users').update({ wallet: updatedWallet }).eq('id', userId);
    loadUsers();
    alert('تم تحديث المحفظة');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0f] p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⚙️</div>
            <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
            <p className="text-white/40 text-sm">تسجيل الدخول فقط للأدمن</p>
          </div>
          <form onSubmit={handleLogin} className="bg-[#12121a] rounded-2xl p-8 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@esport.com"
              className="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl px-4 py-3 text-white"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              className="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl px-4 py-3 text-white"
              required
            />
            <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-green-400 py-3 rounded-xl text-white font-semibold">تسجيل الدخول</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] pb-24">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">⚙️ لوحة التحكم</h1>
            <p className="text-white/40 text-sm">إدارة المستخدمين والمحافظ</p>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="bg-white/5 px-4 py-2 rounded-xl text-white/50">خروج</button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-[#12121a] rounded-2xl p-4 border border-white/5 text-center">
            <p className="text-white/40 text-xs">👥 المستخدمين</p>
            <p className="text-white font-bold text-2xl">{users.length}</p>
          </div>
          <div className="bg-[#12121a] rounded-2xl p-4 border border-white/5 text-center">
            <p className="text-white/40 text-xs">💰 إجمالي المحفظة</p>
            <p className="text-green-400 font-bold text-2xl">${users.reduce((sum, u) => sum + u.wallet, 0).toFixed(2)}</p>
          </div>
          <div className="bg-[#12121a] rounded-2xl p-4 border border-white/5 text-center">
            <p className="text-white/40 text-xs">🏆 الأرباح</p>
            <p className="text-yellow-500 font-bold text-2xl">${users.reduce((sum, u) => sum + u.totalEarned, 0).toFixed(2)}</p>
          </div>
          <div className="bg-[#12121a] rounded-2xl p-4 border border-white/5 text-center">
            <p className="text-white/40 text-xs">📋 مجموعات</p>
            <p className="text-green-500 font-bold text-2xl">0</p>
          </div>
        </div>

        <div className="mb-4">
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="🔍 بحث عن مستخدم..." className="w-full bg-[#12121a] border border-white/10 rounded-xl px-4 py-3 text-white" />
        </div>

        <div className="bg-[#12121a] rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0b0b0f]">
                <tr>
                  <th className="text-right p-3 text-white/40">🆔 ID</th>
                  <th className="text-right p-3 text-white/40">المستخدم</th>
                  <th className="text-right p-3 text-white/40">📧 الإيميل</th>
                  <th className="text-right p-3 text-white/40">💰 المحفظة</th>
                  <th className="text-right p-3 text-white/40">الحالة</th>
                  <th className="text-right p-3 text-white/40">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                  <tr key={user.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="p-3 text-yellow-500 font-bold">{user.uid}</td>
                    <td className="p-3 text-white">{user.name}</td>
                    <td className="p-3 text-white/70">{user.email}</td>
                    <td className="p-3 text-green-400 font-bold">${user.wallet.toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {user.status === 'active' ? 'نشط' : 'محظور'}
                      </span>
                    </td>
                    <td className="p-3">
                      <button onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)} className="bg-gradient-to-r from-blue-500 to-green-400 text-white py-1 px-3 rounded-xl text-xs">إدارة</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#12121a] rounded-2xl p-6 max-w-md w-full border border-white/10">
              <h3 className="text-white font-bold text-lg mb-4">إدارة {selectedUser.name}</h3>
              <div className="space-y-4">
                <div className="flex justify-between"><span className="text-white/50">المحفظة</span><span className="text-green-400 font-bold">${selectedUser.wallet.toFixed(2)}</span></div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">تعديل المحفظة</label>
                  <div className="flex gap-2">
                    <input type="number" value={addAmount} onChange={(e) => setAddAmount(Number(e.target.value))} className="flex-1 bg-[#0b0b0f] border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="المبلغ" />
                    <button onClick={() => updateWallet(selectedUser.id, addAmount)} className="bg-green-600 text-white py-2 px-4 rounded-xl text-sm">إضافة</button>
                    <button onClick={() => updateWallet(selectedUser.id, -addAmount)} className="bg-red-600 text-white py-2 px-4 rounded-xl text-sm">خصم</button>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="w-full bg-white/5 py-2 rounded-xl text-white/50">إغلاق</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
