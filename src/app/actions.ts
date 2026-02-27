'use server';

import { db } from '@/lib/db';
import { studentsSelections } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function submitSelection(formData: FormData) {
    const studentName = formData.get('studentName') as string;
    const seminarChoice = formData.get('seminarChoice') as string;

    if (!studentName || !seminarChoice) {
        return { error: 'يرجى إدخال الاسم واختيار السمينار.' };
    }

    try {
        await db.insert(studentsSelections).values({
            studentName: studentName.trim(),
            seminarChoice,
        });

        revalidatePath('/');
        return { success: 'تم تسجيل اختيارك بنجاح!' };
    } catch (error: any) {
        // Basic unique constraint error handling
        if (error.message?.includes('duplicate key') || error.code === '23505') {
            return { error: 'هذا الاسم مسجل مسبقاً. يرجى استخدام اسم آخر أو التحقق من القائمة.' };
        }
        console.error('Database Error:', error);
        return { error: 'حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.' };
    }
}

export async function deleteSelection(id: number) {
    try {
        await db.delete(studentsSelections).where(eq(studentsSelections.id, id));
        revalidatePath('/');
        revalidatePath('/admin');
        return { success: 'تم حذف التسجيل بنجاح.' };
    } catch (error) {
        console.error('Delete Error:', error);
        return { error: 'حدث خطأ أثناء الحذف.' };
    }
}

export async function updateSelection(id: number, newChoice: string) {
    try {
        await db.update(studentsSelections)
            .set({ seminarChoice: newChoice })
            .where(eq(studentsSelections.id, id));
        revalidatePath('/');
        revalidatePath('/admin');
        return { success: 'تم تحديث الاختيار بنجاح.' };
    } catch (error) {
        console.error('Update Error:', error);
        return { error: 'حدث خطأ أثناء التحديث.' };
    }
}
