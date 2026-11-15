import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plane, Mail, Lock } from 'lucide-react';
import { api } from '../services/api';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { email, password });
            // После успешной регистрации логинимся
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.access_token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Ошибка регистрации');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 relative">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-full mb-2">
                        <Plane className="w-8 h-8 text-brand-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Создать аккаунт</h1>
                    <p className="text-slate-500">Платформа прогнозирования спроса</p>
                </div>

                {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="email"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="password"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition-colors"
                    >
                        Зарегистрироваться
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500">
                    Уже есть аккаунт?{' '}
                    <Link to="/login" className="text-brand-600 hover:text-brand-500 font-medium">
                        Войти
                    </Link>
                </p>
            </div>
            <div className="absolute bottom-6 text-center text-sm text-slate-400 w-full left-0">
                <p>© {new Date().getFullYear()} Проект «Решись Авиа»</p>
                <p className="mt-1">Разработано: <span className="font-medium text-slate-500">Жарков Артём</span></p>
            </div>
        </div>
    );
}