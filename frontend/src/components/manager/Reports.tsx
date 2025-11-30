import React, { useState } from 'react';
import { useAttendanceStore } from '../../store/attendanceStore';
import { api } from '../../utils/api';
import { FileText, Download, Loader2 } from 'lucide-react';
import moment from 'moment';

const Reports: React.FC = () => {
    const { loading, setLoading, setError } = useAttendanceStore();
    const [startDate, setStartDate] = useState(moment().subtract(30, 'days').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
    const [reportData, setReportData] = useState<any[] | null>(null);

    const generateReport = async () => {
        setLoading(true);
        setError(null);
        setReportData(null);
        try {
            const data = await api.attendance.export({ startDate, endDate });
            setReportData(data.data);

        } catch (err) {
            // Error handled by api.ts
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = () => {
        if (!reportData || reportData.length === 0) return;

        const header = Object.keys(reportData[0]).join(',');
        const rows = reportData.map(row => Object.values(row).join(','));
        const csvContent = [header, ...rows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `attendance_report_${startDate}_to_${endDate}.csv`);
        link.click();
    };


    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-6 border-b pb-4">
                <FileText className="w-6 h-6 mr-2 text-red-600" />
                Attendance Reports Generator
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-8 p-4 bg-gray-50 rounded-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border rounded-lg p-2" disabled={loading} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border rounded-lg p-2" disabled={loading} />
                </div>
                <button
                    onClick={generateReport}
                    disabled={loading || !startDate || !endDate}
                    className="flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 transition duration-200 disabled:opacity-50 h-[42px]"
                >
                    {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : 'Generate Report'}
                </button>
            </div>

            {reportData && (
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Report Preview ({reportData.length} Records)</h3>
                        <button onClick={downloadCSV} className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200">
                            <Download className="w-4 h-4 mr-2"/> Download CSV
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto max-h-[500px] border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    {Object.keys(reportData[0]).map(key => (
                                        <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reportData.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition duration-150">
                                        {Object.values(row).map((value, idx) => (
                                            <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {value as string}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;