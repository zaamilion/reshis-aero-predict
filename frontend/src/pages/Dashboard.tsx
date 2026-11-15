import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LogOut, Calculator, MapPin, Calendar, Users, Ticket, RussianRuble
} from 'lucide-react';
import {
    ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { api } from '../services/api';
import type { ForecastResponse } from '../types';

export default function Dashboard() {
    const navigate = useNavigate();
    const [routes, setRoutes] = useState<string[]>([]);
    const [forecast, setForecast] = useState<ForecastResponse | null>(null);

    const [formData, setFormData] = useState({
        route: '',
        date: '2026-06-15',
        price: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Загрузка маршрутов при входе
    useEffect(() => {
        api.get('/forecast/routes')
            .then(res => {
                setRoutes(res.data);
                if (res.data.length > 0) setFormData(prev => ({ ...prev, route: res.data[0] }));
            })
            .catch(() => setError('Не удалось загрузить маршруты'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setForecast(null);
        try {
            const { data } = await api.post<ForecastResponse>('/forecast/', {
                route: formData.route,
                date: formData.date,
                price: parseFloat(formData.price)
            });

            const chartDataWithLimit = data.chart_data.map(item => ({
                ...item,
                limit: data.seats
            }));

            setForecast({ ...data, chart_data: chartDataWithLimit });
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Ошибка расчета');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Навигация */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <Calculator className="w-6 h-6 text-brand-600" />
                    <span className="font-bold text-xl text-slate-800">Решись-Авиа Прогноз</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Выйти</span>
                </button>
            </nav>

            <main className="max-w-6xl mx-auto mt-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Панель управления (Форма) */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Параметры рейса</h2>
                    <form onSubmit={handleCalculate} className="space-y-4">

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Маршрут
                            </label>
                            <select
                                value={formData.route}
                                onChange={e => setFormData({ ...formData, route: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            >
                                {routes.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Дата
                            </label>
                            <input
                                type="date"
                                required
                                min="2026-06-01"
                                max="2026-07-01"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                <RussianRuble className="w-4 h-4" /> Цена билета
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                required
                                placeholder="Например: 3500"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Считаем...' : 'Рассчитать спрос'}
                        </button>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </form>
                </div>

                {/* Результаты и графики */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Информационные карточки */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <Users className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Вместимость борта</p>
                                <h3 className="text-3xl font-bold text-slate-800">
                                    {forecast ? forecast.seats : '-'} <span className="text-lg font-normal text-slate-400">мест</span>
                                </h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                            <div className="p-4 bg-green-50 rounded-xl">
                                <Ticket className="w-8 h-8 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Прогноз продаж (медиана)</p>
                                <h3 className="text-3xl font-bold text-slate-800">
                                    {forecast ? forecast.median_sales : '-'} <span className="text-lg font-normal text-slate-400">билетов</span>
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* График распределения вероятностей */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800 mb-6">Распределение вероятного спроса</h2>
                        {forecast ? (
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={forecast.chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="quantile"
                                            tick={{ fill: '#64748b' }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fill: '#64748b' }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            labelFormatter={(label) => `Квантиль: ${label}`}
                                        />

                                        {/* Линия вместимости самолета */}
                                        <Line
                                            type="monotone"
                                            dataKey="limit"
                                            name="Вместимость (Мест)"
                                            stroke="#ef4444"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            dot={false}
                                            activeDot={false}
                                        />

                                        {/* Область спроса (желают) */}
                                        <Area
                                            type="monotone"
                                            dataKey="demand"
                                            name="Желают купить"
                                            fill="#e0f2fe"
                                            stroke="#0ea5e9"
                                            strokeWidth={3}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-80 w-full flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-slate-400">Введите параметры и рассчитайте спрос</p>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}