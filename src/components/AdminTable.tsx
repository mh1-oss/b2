'use client';

import { useState } from 'react';
import { deleteSelection, updateSelection } from '@/app/actions';

type StudentSelection = {
    id: number;
    studentName: string;
    seminarChoice: string;
    createdAt: Date;
};

const SEMINAR_OPTIONS = [
    'Differences between cyclic triaxial test and cyclic simple shear test',
    'Zones subjected to liquefaction in zoned earth dams',
    'Methods used for attenuation of waves caused by machines',
    'Influence of vibration on skin friction of piles',
    'Correlation between the earthquake magnitude and intensity with acceleration of excitation',
    'Dynamic active earth pressure behind retaining walls',
    'Hydrodynamic effects of pore water',
    'Hysteresis damping',
    'Allowable settlement in machine foundations',
    'Shapes of dynamic load functions',
    'Zone of influence around driven piles',
    'Method of calculation of natural frequency of foundations',
    'Calculation of Seismic Load in Design Codes'
];

export default function AdminTable({ selections }: { selections: StudentSelection[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editChoice, setEditChoice] = useState<string>('');
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا التسجيل؟')) {
            setIsDeleting(id);
            await deleteSelection(id);
            setIsDeleting(null);
        }
    };

    const startEdit = (student: StudentSelection) => {
        setEditingId(student.id);
        setEditChoice(student.seminarChoice);
    };

    const handleSave = async (id: number) => {
        await updateSelection(id, editChoice);
        setEditingId(null);
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="card-title">لوحة تحكم المشرف</h2>
                <a href="/" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 'bold' }}>
                    العودة للصفحة الرئيسية
                </a>
            </div>

            {selections.length === 0 ? (
                <div className="empty-state">
                    <p>لم يسجل أي طالب بعد.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>اسم الطالب</th>
                                <th>السمينار المختار</th>
                                <th>وقت التسجيل</th>
                                <th>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selections.map((student, index) => (
                                <tr key={student.id}>
                                    <td>{selections.length - index}</td>
                                    <td>{student.studentName}</td>

                                    <td>
                                        {editingId === student.id ? (
                                            <select
                                                value={editChoice}
                                                onChange={(e) => setEditChoice(e.target.value)}
                                                style={{ padding: '0.4rem', fontSize: '0.9rem', width: 'auto' }}
                                            >
                                                {SEMINAR_OPTIONS.map((opt, idx) => (
                                                    <option key={idx} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            student.seminarChoice
                                        )}
                                    </td>

                                    <td dir="ltr" style={{ textAlign: 'right' }}>
                                        {new Intl.DateTimeFormat('ar-EG', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }).format(new Date(student.createdAt))}
                                    </td>

                                    <td style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-start' }}>
                                        {editingId === student.id ? (
                                            <>
                                                <button
                                                    onClick={() => handleSave(student.id)}
                                                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    حفظ
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    style={{ background: '#64748b', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    إلغاء
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEdit(student)}
                                                    style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    تعديل
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student.id)}
                                                    disabled={isDeleting === student.id}
                                                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', opacity: isDeleting === student.id ? 0.5 : 1 }}
                                                >
                                                    {isDeleting === student.id ? 'جاري...' : 'حذف'}
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
