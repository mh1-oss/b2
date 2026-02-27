import { db } from '@/lib/db';
import { studentsSelections } from '@/lib/schema';
import { desc } from 'drizzle-orm';

export default async function StudentsList() {
    const selections = await db.select().from(studentsSelections).orderBy(studentsSelections.id);

    return (
        <div className="card">
            <h2 className="card-title no-print">قائمة الطلاب المسجلين</h2>

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
                            </tr>
                        </thead>
                        <tbody>
                            {selections.map((student, index) => (
                                <tr key={student.id}>
                                    <td>{index + 1}</td>
                                    <td>{student.studentName}</td>
                                    <td>{student.seminarChoice}</td>
                                    <td dir="ltr" style={{ textAlign: 'right' }}>
                                        {new Intl.DateTimeFormat('ar-EG', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }).format(new Date(student.createdAt))}
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
