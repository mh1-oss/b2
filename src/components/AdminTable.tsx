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
    '1. Differences between cyclic triaxial test and cyclic simple shear test',
    '2. Zones subjected to liquefaction in zoned earth dams',
    '3. Methods used for attenuation of waves caused by machines',
    '4. Influence of vibration on skin friction of piles',
    '5. Correlation between the earthquake magnitude and intensity with acceleration of excitation',
    '6. Dynamic active earth pressure behind retaining walls',
    '7. Hydrodynamic effects of pore water',
    '8. Hysteresis damping',
    '9. Allowable settlement in machine foundations',
    '10. Shapes of dynamic load functions',
    '11. Zone of influence around driven piles',
    '12. Method of calculation of natural frequency of foundations',
    '13. Calculation of Seismic Load in Design Codes'
];

export default function AdminTable({ selections }: { selections: StudentSelection[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editChoice, setEditChoice] = useState<string>('');
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const takenSeminars = selections.map(s => s.seminarChoice);

    const handleDelete = async (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا التسجيل؟')) {
            setActionError(null);
            setIsDeleting(id);
            const result = await deleteSelection(id);
            if (result?.error) setActionError(result.error);
            setIsDeleting(null);
        }
    };

    const startEdit = (student: StudentSelection) => {
        setActionError(null);
        setEditingId(student.id);
        setEditChoice(student.seminarChoice);
    };

    const handleSave = async (id: number) => {
        setActionError(null);
        const result = await updateSelection(id, editChoice);
        if (result?.error) {
            setActionError(result.error);
        } else {
            setEditingId(null);
        }
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="card-title">لوحة تحكم المشرف</h2>
                <a href="/" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 'bold' }}>
                    العودة للصفحة الرئيسية
                </a>
            </div>

            {actionError && (
                <div className="error-message" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '8px', color: '#b91c1c' }}>
                    {actionError}
                </div>
            )}

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
                                    <td>{index + 1}</td>
                                    <td>{student.studentName}</td>

                                    <td>
                                        {editingId === student.id ? (
                                            <select
                                                value={editChoice}
                                                onChange={(e) => setEditChoice(e.target.value)}
                                                style={{ padding: '0.4rem', fontSize: '0.9rem', width: 'auto' }}
                                            >
                                                {SEMINAR_OPTIONS.map((opt, idx) => {
                                                    const isTaken = takenSeminars.includes(opt) && opt !== student.seminarChoice;
                                                    return (
                                                        <option key={idx} value={opt} disabled={isTaken}>
                                                            {opt} {isTaken ? '(محجوز)' : ''}
                                                        </option>
                                                    );
                                                })}
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
