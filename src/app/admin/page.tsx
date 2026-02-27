import { db } from '@/lib/db';
import { studentsSelections } from '@/lib/schema';
import { desc } from 'drizzle-orm';
import AdminTable from '@/components/AdminTable';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminPage({
    searchParams
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const params = await searchParams;
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_auth')?.value === 'true';

    if (!isAdmin) {
        return (
            <main className="container" style={{ maxWidth: '500px', marginTop: '10vh' }}>
                <div className="card text-center">
                    <h2 className="title" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>تسجيل الدخول للوحة التحكم</h2>

                    {params.error && (
                        <div className="error-message" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
                            كلمة المرور غير صحيحة.
                        </div>
                    )}

                    <form action="/api/auth" method="POST">
                        <div className="form-group" style={{ textAlign: 'right' }}>
                            <label htmlFor="password">كلمة المرور</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                placeholder="أدخل كلمة المرور..."
                                dir="ltr"
                            />
                        </div>
                        <button type="submit" className="btn-submit" style={{ marginTop: '1rem' }}>
                            دخول
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem' }}>
                        <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>العودة للرئيسية</a>
                    </div>
                </div>
            </main>
        );
    }

    const selections = await db.select().from(studentsSelections).orderBy(desc(studentsSelections.createdAt));

    return (
        <main className="container">
            <AdminTable selections={selections} />

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <form action="/api/logout" method="POST">
                    <button type="submit" style={{ background: 'transparent', border: '1px solid currentColor', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
                        تسجيل الخروج
                    </button>
                </form>
            </div>
        </main>
    );
}
