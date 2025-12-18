
import React, { useMemo } from 'react';
import { Document, Status, DirectorStatus } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
    documents: Document[];
}

const StatCard: React.FC<{ title: string; value: number; color: string }> = ({ title, value, color }) => (
    <div className={`p-4 rounded-lg shadow-md bg-white border-l-4 ${color}`}>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ documents }) => {
    const stats = useMemo(() => {
        const total = documents.length;
        const directorApproved = documents.filter(d => d.directorStatus === DirectorStatus.Approved).length;
        const directorRejected = documents.filter(d => d.directorStatus === DirectorStatus.Rejected).length;
        const directorInProgress = documents.filter(d => d.directorStatus === DirectorStatus.InProgress).length;
        
        return { total, directorApproved, directorRejected, directorInProgress };
    }, [documents]);

    const statusData = useMemo(() => {
        const statusCounts: { [key in Status]?: number } = {};
        documents.forEach(doc => {
            [doc.statusDept1, doc.statusDept2, doc.statusDept3, doc.statusDept4].forEach(status => {
                statusCounts[status] = (statusCounts[status] || 0) + 1;
            });
        });

        return [
            { name: Status.Approved, value: statusCounts[Status.Approved] || 0 },
            { name: Status.Rejected, value: statusCounts[Status.Rejected] || 0 },
            { name: Status.Pending, value: statusCounts[Status.Pending] || 0 },
            { name: Status.NotApplicable, value: statusCounts[Status.NotApplicable] || 0 },
        ];
    }, [documents]);

    const COLORS = {
        [Status.Approved]: '#4CAF50',
        [Status.Rejected]: '#F44336',
        [Status.Pending]: '#9E9E9E',
        [Status.NotApplicable]: '#2196F3',
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="เอกสารทั้งหมด" value={stats.total} color="border-blue-500" />
                <StatCard title="อนุมัติ" value={stats.directorApproved} color="border-green-500" />
                <StatCard title="ไม่อนุมัติ" value={stats.directorRejected} color="border-red-500" />
                <StatCard title="กำลังดำเนินการ" value={stats.directorInProgress} color="border-yellow-500" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">ภาพรวมสถานะการตรวจสอบรายฝ่าย</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as Status]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
