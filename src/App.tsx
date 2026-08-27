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
  const [users, setUsers] = useState<User[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [recharges, setRecharges] = useState<any[]>([]);
  const [withdraws, setWithdraws] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    const [usersData, matchesData, rechargesData, withdrawsData, groupsData] = await Promise.all([
      supabase.from('users').select('*'),
      supabase.from('matches').select('*'),
      supabase.from('recharges').select('*'),
      supabase.from('withdraws').select('*'),
      supabase.from('groups').select('*')
    ]);
    if (usersData.data) setUsers(usersData.data);
    if (matchesData.data) setMatches(matchesData.data);
    if (rechargesData.data) setRecharges(rechargesData.data);
    if (withdrawsData.data) setWithdraws(withdrawsData.data);
    if (groupsData.data) setGroups(groupsData.data);
  };

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

  const handleSignup = async (userData: any) => {
    const newUser: User = {
      id: Date.now(),
      uid: `#ES-${users.length + 1}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      wallet: 0,
      totalMatches: 0,
      totalWins: 0,
      totalLosses: 0,
      totalEarned: 0,
      joinDate: new Date().toISOString(),
      status: 'active'
    };
    const { error } = await supabase.from('users').insert([newUser]);
    if (error) {
      alert('خطأ في التسجيل');
    } else {
      alert('تم إنشاء الحساب بنجاح');
      loadAllData();
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#0b0b0f]">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">⚙️ لوحة التحكم</h1>
              <p className="text-white/40 text-sm">إدارة المستخدمين والمحافظ</p>
            </div>
            <button onClick={handleLogout} className="bg-white/5 px-4 py-2 rounded-xl text-white/50">خروج</button>
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
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-white/5">
                      <td className="p-3 text-yellow-500 font-bold">{user.uid}</td>
                      <td className="p-3 text-white">{user.name}</td>
                      <td className="p-3 text-white/70">{user.email}</td>
                      <td className="p-3 text-green-400 font-bold">${user.wallet.toFixed(2)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {user.status === 'active' ? 'نشط' : 'محظور'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoggedIn && currentUser) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] pb-24">
        <div className="max-w-4xl mx-auto p-4">
          
          {/* بانر الإعلان */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-yellow-400 text-xs">بطولة الأسبوع</p>
                <h1 className="text-white font-bold text-xl">تحفيات الأسطورية</h1>
              </div>
              <div className="bg-white/10 rounded-xl p-2">
                <span className="text-white text-2xl">⚽</span>
              </div>
            </div>
          </div>

          {/* الأرقام */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#12121a] rounded-2xl p-4 border border-white/5">
              <p className="text-white/40 text-xs">💸 رصيد الحساب</p>
              <p className="text-green-400 font-bold text-3xl">${currentUser.wallet.toFixed(2)}</p>
              <button className="mt-2 bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full">🔄 شحن</button>
            </div>
            <div className="bg-[#12121a] rounded-2xl p-4 border border-white/5">
              <p className="text-white/40 text-xs">💰 إجمالي الأرباح</p>
              <p className="text-yellow-400 font-bold text-3xl">${currentUser.totalEarned.toFixed(2)}</p>
              <button className="mt-2 bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full">💸 سحب</button>
            </div>
          </div>

          {/* الأزرار */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#12121a] rounded-2xl p-4 border border-white/5 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-xl">+</div>
              <div>
                <p className="text-white font-bold">إنشاء تحدي</p>
                <p className="text-white/40 text-xs">ضد صديق</p>
              </div>
            </div>
            <div className="bg-[#12121a] rounded-2xl p-4 border border-white/5 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xl">⚔️</div>
              <div>
                <p className="text-white font-bold">المباريات المتاحة</p>
                <p className="text-white/40 text-xs">ابحث عن خصم</p>
              </div>
            </div>
          </div>

          {/* المباراة النشطة */}
          <div className="bg-[#12121a] rounded-2xl p-4 border border-white/5 mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-white/40 text-xs">Active Match</p>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">🔴</span>
            </div>
            <p className="text-yellow-400 text-sm mb-4">⚠️ مباراة جارية حالياً #📱[Match ID]</p>
            <button className="w-full bg-white/5 py-2 rounded-xl text-white/70 text-sm">دخول الفرقة</button>
          </div>
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
          if (isSignup) await handleSignup({ name, email, password, phone });
          else await handleLogin(email, password);
        }} className="bg-[#12121a] rounded-2xl p-8 space-y-4">
          {isSignup && (
            <>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم" required className="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl px-4 py-3 text-white" />
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الهاتف" required className="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl px-4 py-3 text-white" />
            </>
          )}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" required className="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl px-4 py-3 text-white" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" required className="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl px-4 py-3 text-white" />
          <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-green-400 py-3 rounded-xl text-white font-semibold">
            {isSignup ? 'إنشاء حساب' : 'تسجيل الدخول'}
          </button>
          <p className="text-center text-gray-500 text-sm">
            <button type="button" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? 'لديك حساب؟ سجل دخول' : 'ليس لديك حساب؟ أنشئ حساب'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default App;
