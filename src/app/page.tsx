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
        <p className="subtitle no-print">للعام الأكاديمي 2025-2026</p>
        <div className="print-only" style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}
        </div>
      </header>

      <div className="main-grid">
        <aside className="no-print">
          <RegistrationForm takenSeminars={takenSeminars} />
        </aside>

        <section>
          <Suspense fallback={<div className="card">جاري تحميل القائمة...</div>}>
            <StudentsList />
          </Suspense>

          <PrintButton />
        </section>
      </div>
    </main>
  );
}
