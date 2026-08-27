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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    const { data } = await supabase.from('users').select('*');
    if (data) setUsers(data);
  };

  // (هذه فقط أمثلة من أجل التبسيط)
  const [users, setUsers] = useState<User[]>([]);

  const handleLogin = async (email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setIsLoggedIn(true);
      return;
    }
    const { data } = await supabase.from('users').select('*').eq('email', email).eq('password', password);
    if (data && data.length > 0) {
      setCurrentUser(data[0]);
      setIsLoggedIn(true);
    } else {
      alert('بيانات الدخول خاطئة');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  if (isLoggedIn && isAdmin) {
    return (
      <div className="min-h-screen bg-[#0b0b0f]">
        <div className="max-w-6xl mx-auto p-4">
          <h1 className="text-2xl font-bold text-white">⚙️ لوحة التحكم</h1>
          <div className="bg-[#12121a] rounded-2xl p-4 border border-white/5 mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="p-2">ID</th>
                  <th className="p-2">المستخدم</th>
                  <th className="p-2">الإيميل</th>
                  <th className="p-2">المحفظة</th>
                  <th className="p-2">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-white/5">
                    <td className="p-2 text-yellow-500">{user.uid}</td>
                    <td className="p-2 text-white">{user.name}</td>
                    <td className="p-2 text-white/70">{user.email}</td>
                    <td className="p-2 text-green-400">${user.wallet.toFixed(2)}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {user.status === 'active' ? 'نشط' : 'محظور'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleLogout} className="mt-4 bg-red-600 py-2 rounded-xl text-white">خروج</button>
        </div>
      </div>
    );
  }

  if (isLoggedIn && currentUser) {
    return (
      <div className="min-h-screen bg-[#0b0b0f]">
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-[#12121a] rounded-2xl p-6 border border-white/5 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center text-2xl font-bold text-white">{currentUser.name.charAt(0)}</div>
              <div>
                <h2 className="text-white font-bold text-xl">{currentUser.name}</h2>
                <p className="text-yellow-500 text-xs">🆔 {currentUser.uid}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#12121a] rounded-2xl p-4 border border-white/5">
              <p className="text-white/40 text-xs">💰 الرصيد</p>
              <p className="text-green-400 font-bold text-3xl">${currentUser.wallet.toFixed(2)}</p>
            </div>
            <div className="bg-[#12121a] rounded-2xl p-4 border border-white/5">
              <p className="text-white/40 text-xs">🏆 الأرباح</p>
              <p className="text-yellow-400 font-bold text-3xl">${currentUser.totalEarned.toFixed(2)}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full mt-4 bg-red-600 py-3 rounded-xl text-white font-semibold">🚪 خروج</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0f] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚽</div>
          <h1 className="text-4xl font-bold text-white">eSport</h1>
          <h2 className="text-2xl font-bold text-blue-500">Betting Arena</h2>
        </div>
        <form onSubmit={async (e) => {
          e.preventDefault();
          await handleLogin(email, password);
        }} className="bg-[#12121a] rounded-2xl p-8 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني"
            className="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl px-4 py-3 text-white"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            className="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl px-4 py-3 text-white"
            required
          />
          <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-green-400 py-3 rounded-xl text-white font-semibold">
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
