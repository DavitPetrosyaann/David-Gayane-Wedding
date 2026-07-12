import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RSVPFormData } from '../types';
import { useLanguage } from '../LanguageContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const RSVP: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<RSVPFormData>({
    name: '',
    attendance: '',
    guests: 1,
    side: '',
    wishes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // RSVP Deadline Countdown Logic
  const deadlineDate = new Date('2026-09-01T00:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = deadlineDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [deadlineDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'guests' ? (value === '' ? '' : parseInt(value)) : value 
    }));
  };

  const triggerFireworks = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Form field validation
    if (!formData.name.trim()) {
      setSubmitError('Please enter your name.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.attendance) {
      setSubmitError('Please select whether you will attend.');
      setIsSubmitting(false);
      return;
    }
    if (formData.attendance === 'yes' && !formData.side) {
      setSubmitError('Please select whose guest you are.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: formData.name,
      attendance: formData.attendance,
      guests: formData.attendance === 'yes' ? (formData.guests === '' ? 1 : formData.guests) : 0,
      side: formData.attendance === 'yes' ? formData.side : '',
      wishes: formData.wishes,
      timestamp: new Date().toISOString(),
    };

    console.log('Submitting RSVP:', payload);

    const configuredFunctionUrl = (import.meta.env.VITE_RSVP_FUNCTION_URL || '')
      .trim()
      .replace(/\/$/, '');

    const configuredBase = (import.meta.env.VITE_RSVP_API_BASE || '')
      .trim()
      .replace(/\/$/, '');

    const allowRelativeApi =
      ['localhost', '127.0.0.1'].includes(window.location.hostname) ||
      import.meta.env.VITE_ENABLE_RELATIVE_RSVP_API === 'true';

    const endpointCandidates = [
      configuredFunctionUrl,
      configuredBase ? `${configuredBase}/api/rsvp` : '',
      allowRelativeApi ? '/api/rsvp' : '',
    ].filter(Boolean);

    const uniqueEndpoints = [...new Set(endpointCandidates)];

    let lastError: any = null;
    let submitted = false;

    for (const endpoint of uniqueEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setIsSubmitted(true);
          triggerFireworks();
          submitted = true;
          break;
        }

        lastError = new Error(`API submission failed: ${response.status} via ${endpoint}`);
      } catch (err) {
        lastError = err;
      }
    }

    if (submitted) {
      setIsSubmitting(false);
      return;
    }

    console.warn('API submission failed, attempting direct Firestore fallback...', lastError);

    const hasFirebaseConfig = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);
    if (hasFirebaseConfig) {
      try {
        const { firestore } = await import('../lib/firebaseClient');
        await addDoc(
          collection(
            firestore,
            import.meta.env.VITE_FIRESTORE_RSVP_COLLECTION || 'projects',
            import.meta.env.VITE_RSVP_PROJECT_ID || 'david-gayane-wedding',
            'rsvps'
          ),
          {
            ...payload,
            createdAtIso: new Date().toISOString(),
            createdAt: serverTimestamp(),
            source: 'client_firestore_fallback',
          }
        );
        setIsSubmitted(true);
        triggerFireworks();
      } catch (firestoreError) {
        console.error('Firestore fallback write failed:', firestoreError);
        setSubmitError('Failed to submit RSVP. Please try again.');
      }
    } else {
      setSubmitError('Failed to submit RSVP. Connection error.');
    }

    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <section className="py-20 px-4 text-center transition-all duration-500">
        <div className="max-w-md mx-auto bg-wedding-accent text-white p-10 rounded-sm shadow-[0_0_20px_rgba(139,154,133,0.4)] fade-in">
          <h3 className="text-2xl mb-4">{t.thankYou}</h3>
          <p className="text-lg font-light">{t.thankYouText}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-wedding-light/30 transition-all duration-500">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl mb-4 text-wedding-text">{t.rsvpTitle}</h2>
          <p className="text-gray-600">
            {t.rsvpSubtitle}
          </p>
        </div>

        {/* Deadline Countdown */}
        <div className="mb-10 p-4 sm:p-6 bg-white/60 rounded-sm border border-wedding-accent/20 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 uppercase tracking-widest mb-4 text-center">{t.rsvpDeadline}</p>
          <div className="flex justify-center gap-2 sm:gap-4 md:gap-6 text-wedding-accent font-medium">
            <div className="flex flex-col items-center w-10 sm:w-12">
              <span className="text-xl sm:text-2xl md:text-3xl">{timeLeft.days}</span>
              <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 uppercase mt-1">{t.days}</span>
            </div>
            <span className="text-lg sm:text-xl md:text-2xl mt-1">:</span>
            <div className="flex flex-col items-center w-10 sm:w-12">
              <span className="text-xl sm:text-2xl md:text-3xl">{timeLeft.hours}</span>
              <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 uppercase mt-1">{t.hours}</span>
            </div>
            <span className="text-lg sm:text-xl md:text-2xl mt-1">:</span>
            <div className="flex flex-col items-center w-10 sm:w-12">
              <span className="text-xl sm:text-2xl md:text-3xl">{timeLeft.minutes}</span>
              <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 uppercase mt-1">{t.minutes}</span>
            </div>
            <span className="text-lg sm:text-xl md:text-2xl mt-1">:</span>
            <div className="flex flex-col items-center w-10 sm:w-12">
              <span className="text-xl sm:text-2xl md:text-3xl">{timeLeft.seconds}</span>
              <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 uppercase mt-1">{t.seconds}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 shadow-sm rounded-sm border border-gray-100">
          
          <div>
            <label htmlFor="name" className="block text-sm text-gray-700 mb-2">{t.nameLabel}</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-wedding-accent focus:ring-0 bg-transparent transition-colors"
              placeholder={t.namePlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-3">{t.attendanceLabel}</label>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="attendance"
                  value="yes"
                  required
                  checked={formData.attendance === 'yes'}
                  onChange={handleChange}
                  className="accent-wedding-accent w-4 h-4 focus:ring-wedding-accent"
                />
                <span className="text-gray-700 text-sm sm:text-base">{t.attendYes}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="attendance"
                  value="no"
                  required
                  checked={formData.attendance === 'no'}
                  onChange={handleChange}
                  className="accent-wedding-accent w-4 h-4 focus:ring-wedding-accent"
                />
                <span className="text-gray-700 text-sm sm:text-base">{t.attendNo}</span>
              </label>
            </div>
          </div>

          {formData.attendance === 'yes' && (
            <>
              <div className="animate-fade-in">
                <label htmlFor="guests" className="block text-sm text-gray-700 mb-2">{t.guestsLabel}</label>
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  min="1"
                  max="10"
                  required
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-wedding-accent focus:ring-0 bg-transparent transition-colors"
                  placeholder={t.guestsPlaceholder}
                />
              </div>

              <div className="animate-fade-in">
                <label className="block text-sm text-gray-700 mb-3">{t.sideLabel}</label>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="side"
                      value="bride"
                      required
                      checked={formData.side === 'bride'}
                      onChange={handleChange}
                      className="accent-wedding-accent w-4 h-4 focus:ring-wedding-accent"
                    />
                    <span className="text-gray-700 text-sm sm:text-base">{t.sideBride}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="side"
                      value="groom"
                      required
                      checked={formData.side === 'groom'}
                      onChange={handleChange}
                      className="accent-wedding-accent w-4 h-4 focus:ring-wedding-accent"
                    />
                    <span className="text-gray-700 text-sm sm:text-base">{t.sideGroom}</span>
                  </label>
                </div>
              </div>
            </>
          )}

          <div>
            <label htmlFor="wishes" className="block text-sm text-gray-700 mb-2">{t.wishesLabel}</label>
            <textarea
              id="wishes"
              name="wishes"
              rows={3}
              value={formData.wishes}
              onChange={handleChange}
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-wedding-accent focus:ring-0 bg-transparent resize-none transition-colors"
              placeholder={t.wishesPlaceholder}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-wedding-accent text-white py-4 mt-4 hover:bg-opacity-90 transition-all duration-300 tracking-widest uppercase text-sm rounded-sm hover:shadow-[0_0_15px_rgba(139,154,133,0.6)] disabled:bg-wedding-accent/50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '...' : t.submit}
          </button>
          {submitError && (
            <p className="text-red-500 text-sm text-center mt-2">{submitError}</p>
          )}
        </form>
      </div>
    </section>
  );
};

export default RSVP;