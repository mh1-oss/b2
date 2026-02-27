import { db } from '@/lib/db';
import { studentsSelections } from '@/lib/schema';
import RegistrationForm from '@/components/RegistrationForm';
import StudentsList from '@/components/StudentsList';
import PrintButton from '@/components/PrintButton';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const selections = await db.select().from(studentsSelections);
  const takenSeminars = selections.map(s => s.seminarChoice);

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">اختيار السمينار</h1>
        <p className="subtitle">للعام الأكاديمي 2025-2026</p>
      </header>

      <div className="main-grid">
        <aside className="no-print">
          <RegistrationForm takenSeminars={takenSeminars} />
        </aside>

        <section>
          {/* Print specific header */}
          <div className="print-only" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2>الطلاب المسجلين - العام 2025/2026</h2>
            <p>تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}</p>
          </div>

          <Suspense fallback={<div className="card">جاري تحميل القائمة...</div>}>
            <StudentsList />
          </Suspense>

          <PrintButton />
        </section>
      </div>
    </main>
  );
}
