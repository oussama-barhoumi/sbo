import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { 
    TrendingDown, 
    Wallet, 
    PieChart as PieChartIcon,
    DollarSign,
    Bus,
    Home,
    Briefcase,
    Plus,
    Minus
} from 'lucide-react';
import { 
    PieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer, 
    Tooltip as RechartsTooltip 
} from 'recharts';

export default function SalaryCalculator() {
    const { t } = useLaravelReactI18n();
    const [grossSalary, setGrossSalary] = useState(5000);
    const [transport, setTransport] = useState(200);
    const [housing, setHousing] = useState(1500);
    const [otherExpenses, setOtherExpenses] = useState(300);
    const [taxRate, setTaxRate] = useState(15);

    const [calculations, setCalculations] = useState({
        taxAmount: 0,
        totalExpenses: 0,
        netSalary: 0,
        expenseRatio: 0
    });

    useEffect(() => {
        const taxAmount = (grossSalary * taxRate) / 100;
        const totalExpenses = transport + housing + otherExpenses;
        const netSalary = grossSalary - taxAmount - totalExpenses;
        const expenseRatio = grossSalary > 0 ? ((totalExpenses + taxAmount) / grossSalary) * 100 : 0;

        setCalculations({
            taxAmount,
            totalExpenses,
            netSalary,
            expenseRatio
        });
    }, [grossSalary, transport, housing, otherExpenses, taxRate]);

    const chartData = [
        { name: 'Net Salary', value: Math.max(0, calculations.netSalary), color: '#000000' },
        { name: 'Tax', value: calculations.taxAmount, color: '#94a3b8' },
        { name: 'Housing', value: housing, color: '#475569' },
        { name: 'Transport', value: transport, color: '#cbd5e1' },
        { name: 'Other', value: otherExpenses, color: '#f1f5f9' },
    ];

    const containerVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVars = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    };

    const InputGroup = ({ label, value, min, max, step, onChange, icon: Icon, unit = "$" }) => (
        <div className="space-y-6 p-6 lg:p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-transparent hover:border-black dark:hover:border-white transition-all group relative overflow-hidden">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white dark:bg-black rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0">
                    <Icon className="w-5 h-5 text-black dark:text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">{label}</span>
            </div>

            <div className="flex items-center justify-between bg-white dark:bg-black/40 rounded-2xl p-2 border border-gray-100 dark:border-white/5 shadow-inner">
                <button 
                    onClick={() => onChange(Math.max(min, value - step))}
                    className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-90"
                >
                    <Minus className="w-5 h-5" />
                </button>
                
                <div className="flex flex-col items-center">
                    <span className="text-2xl lg:text-3xl font-black tabular-nums tracking-tighter">
                        {unit === "$" ? `$${value.toLocaleString()}` : `${value}%`}
                    </span>
                </div>

                <button 
                    onClick={() => onChange(Math.min(max, value + step))}
                    className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-90"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
            
            {/* Visual Progress Bar (Non-interactive) */}
            <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden mt-2">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((value - min) / (max - min)) * 100}%` }}
                    className="h-full bg-black/10 dark:bg-white/10"
                />
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-white/20">Analytical System v2.0</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-black dark:text-white italic uppercase break-words">
                        {t('layout.nav.salary')}
                    </h2>
                </div>
            }
        >
            <Head title={`${t('layout.nav.salary')} — HarborBank`} />

            <div className="py-12 lg:py-20 px-4 lg:px-8">
                <motion.div 
                    variants={containerVars}
                    initial="initial"
                    animate="animate"
                    className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-10"
                >
                    <motion.div variants={itemVars} className="xl:col-span-7 space-y-6">
                        <div className="p-6 lg:p-12 bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] lg:rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-none">
                            <h3 className="text-xl lg:text-2xl font-black mb-8 lg:mb-10 tracking-tighter uppercase italic break-words">Income Configuration</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                <InputGroup 
                                    label="Gross Monthly Salary" 
                                    value={grossSalary} 
                                    min={1000} 
                                    max={50000} 
                                    step={500} 
                                    onChange={setGrossSalary} 
                                    icon={DollarSign} 
                                />
                                <InputGroup 
                                    label="Tax Rate" 
                                    value={taxRate} 
                                    min={0} 
                                    max={50} 
                                    step={1} 
                                    onChange={setTaxRate} 
                                    icon={TrendingDown} 
                                    unit="%" 
                                />
                                <InputGroup 
                                    label="Transport Allowance" 
                                    value={transport} 
                                    min={0} 
                                    max={2000} 
                                    step={50} 
                                    onChange={setTransport} 
                                    icon={Bus} 
                                />
                                <InputGroup 
                                    label="Housing Allowance" 
                                    value={housing} 
                                    min={0} 
                                    max={10000} 
                                    step={250} 
                                    onChange={setHousing} 
                                    icon={Home} 
                                />
                            </div>
                            
                            <div className="mt-4 lg:mt-6">
                                <InputGroup 
                                    label="Other Monthly Expenses" 
                                    value={otherExpenses} 
                                    min={0} 
                                    max={5000} 
                                    step={50} 
                                    onChange={setOtherExpenses} 
                                    icon={Briefcase} 
                                />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVars} className="xl:col-span-5 flex flex-col gap-6">
                        <div className="p-6 lg:p-12 bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] lg:rounded-[4rem] shadow-2xl shadow-black/20 dark:shadow-none relative overflow-hidden flex-1 flex flex-col justify-between min-h-[500px]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 dark:bg-black/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                            
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8 lg:mb-12">
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/10 dark:bg-black/5 rounded-xl lg:rounded-2xl flex items-center justify-center">
                                        <Wallet className="w-5 h-5 lg:w-6 lg:h-6" />
                                    </div>
                                    <div className="px-4 py-1.5 bg-white/10 dark:bg-black/5 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">Estimated Net</div>
                                </div>
                                
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-3 block">Monthly Take-Home</span>
                                <h4 className="text-5xl lg:text-7xl font-black tracking-tighter tabular-nums mb-8 leading-none">
                                    ${calculations.netSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </h4>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Financial Burden</span>
                                        <span className="text-xl font-black tabular-nums">{calculations.expenseRatio.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 dark:bg-black/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, calculations.expenseRatio)}%` }}
                                            className={`h-full ${calculations.expenseRatio > 50 ? 'bg-red-400' : 'bg-white dark:bg-black'}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 lg:pt-12 h-64 relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(0,0,0,0.8)', 
                                                border: 'none', 
                                                borderRadius: '12px',
                                                fontSize: '10px',
                                                fontWeight: 'bold',
                                                color: '#fff'
                                            }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
