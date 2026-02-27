'use client';

import { useState } from 'react';
import { submitSelection } from '@/app/actions';

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

export default function RegistrationForm({ takenSeminars = [] }: { takenSeminars?: string[] }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function handleAction(formData: FormData) {
        setLoading(true);
        setMessage(null);

        // Fallback UI delay for better experience
        await new Promise(resolve => setTimeout(resolve, 300));

        const result = await submitSelection(formData);

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else if (result.success) {
            setMessage({ type: 'success', text: result.success });
            // Reset form on success
            const form = document.getElementById('seminar-form') as HTMLFormElement;
            if (form) form.reset();
        }

        setLoading(false);
    }

    return (
        <div className="card form-container">
            <h2 className="card-title">سجل اختيارك</h2>

            {message?.type === 'success' && (
                <div className="success-message">
                    {message.text}
                </div>
            )}

            {message?.type === 'error' && (
                <div className="error-message" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
                    {message.text}
                </div>
            )}

            <form id="seminar-form" action={handleAction}>
                <div className="form-group">
                    <label htmlFor="studentName">الاسم الرباعي</label>
                    <input
                        type="text"
                        id="studentName"
                        name="studentName"
                        required
                        placeholder="أدخل اسمك الكامل هنا..."
                        autoComplete="name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="seminarChoice">موضوع السمينار</label>
                    <select id="seminarChoice" name="seminarChoice" required defaultValue="">
                        <option value="" disabled>-- اختر موضوعاً --</option>
                        {SEMINAR_OPTIONS.map((option, idx) => {
                            const isTaken = takenSeminars.includes(option);
                            return (
                                <option key={idx} value={option} disabled={isTaken}>
                                    {option} {isTaken ? '(محجوز)' : ''}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'جاري التسجيل...' : 'تأكيد الاختيار'}
                </button>
            </form>
        </div>
    );
}
