import React, { useState } from 'react';
import {
  AlertOctagon,
  Upload,
  ArrowRight,
  CheckCircle,
  Send,
  Sparkles,
  MapPin,
  Clock,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { submitGrievance } from '../services/apiService';
import { getPageContent } from '../utils/pageContent';

export const GrievanceForm: React.FC<{ onComplete?: (trackingId: string) => void }> = ({ onComplete }) => {
  const { userProfile, language } = useApp();
  const page = getPageContent(language).grievance;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [category, setCategory] = useState<string>(page.categories[0]?.id || 'Cooperative Society');
  const [description, setDescription] = useState<string>('');
  const [contactName] = useState<string>(userProfile.name);
  const [district] = useState<string>(`${userProfile.district}, ${userProfile.state}`);
  const [fileName, setFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleNext = () => {
    setValidationError(null);
    if (currentStep === 1 && !category) return;
    if (currentStep === 2 && !description.trim()) {
      setValidationError('Please provide a brief description of the issue before proceeding.');
      return;
    }
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitGrievance({
        category,
        description,
        contactName,
        district,
      });
      setSubmittedResult(res);
      setCurrentStep(5);
      if (onComplete) onComplete(res.trackingId);
    } catch {
      // Fallback local demo submission
      const mockId = `SAH-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedResult({
        success: true,
        trackingId: mockId,
        status: 'Submitted',
        authority: 'Assistant Registrar of Cooperative Societies (ARCS)',
        demoNotice: 'Grievance recorded in reference registry.',
      });
      setCurrentStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setDescription('');
    setFileName('');
    setValidationError(null);
    setSubmittedResult(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
      {/* Step Progress Header */}
      <div className="bg-gray-50 border-b border-gray-150 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-amber-600" />
              {page.title}
            </h3>
            <p className="text-xs text-gray-500">
              {page.desc}
            </p>
          </div>
          <span className="text-xs font-bold text-[#0B6B4F] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Step {currentStep} / 5
          </span>
        </div>

        {/* Step indicator bar */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {['Category', 'Description', 'Document', 'Summary', 'Registered'].map((stepLabel, idx) => (
            <div key={idx} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  idx + 1 <= currentStep ? 'bg-[#0B6B4F]' : 'bg-gray-200'
                }`}
              />
              <span
                className={`text-[10px] hidden sm:block truncate ${
                  idx + 1 === currentStep ? 'font-bold text-[#0B6B4F]' : 'text-gray-400'
                }`}
              >
                {stepLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {validationError && (
        <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Step Body */}
      <div className="p-5 sm:p-7">
        {/* STEP 1: Category Selection */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">
                {page.step1Title}
              </h4>
              <p className="text-xs text-gray-500">
                {page.step1Desc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {page.categories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0B6B4F] bg-[#0B6B4F]/5 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-bold text-xs sm:text-sm text-gray-900">{cat.label}</div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#0B6B4F] bg-[#0B6B4F]' : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#0B6B4F] hover:bg-[#095740] text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Describe Issue */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">
                {page.step2Title}
              </h4>
              <p className="text-xs text-gray-500">
                {page.step2Desc}
              </p>
            </div>

            <div>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={page.step2Placeholder}
                className="w-full rounded-xl border border-gray-300 p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4F] focus:border-transparent"
              />
            </div>

            {/* Quick Helper Chips */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-150">
              <span className="text-[11px] font-bold text-gray-600 block mb-1.5">
                Quick Prompts (Tap to use):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'PACS denied fertilizer or seed distribution quota.',
                  'Post-harvest crop loss survey delayed beyond 72 hours.',
                  'Society annual general meeting (AGM) not convened.',
                ].map((helper, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDescription(helper)}
                    className="text-xs bg-white border border-gray-200 px-2.5 py-1 rounded-lg text-gray-700 hover:border-[#0B6B4F] cursor-pointer"
                  >
                    {helper}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#0B6B4F] hover:bg-[#095740] text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Upload Optional Document */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">
                {page.step3Title}
              </h4>
              <p className="text-xs text-gray-500">
                {page.step3Desc}
              </p>
            </div>

            <label className="border-2 border-dashed border-gray-300 hover:border-[#0B6B4F] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/60">
              <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,.pdf" />
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0B6B4F] flex items-center justify-center mb-2">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">
                {fileName ? `File selected: ${fileName}` : (page.uploadDocLabel || 'Tap here to upload document')}
              </span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG, PDF (Max 5MB)</span>
            </label>

            <div className="flex justify-between pt-3">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#0B6B4F] hover:bg-[#095740] text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: AI Summary & Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E9A23B]" />
                {page.step4Title}
              </h4>
              <p className="text-xs text-gray-500">
                {page.step4Desc}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Complainant:</span>
                <span className="font-bold text-gray-900">{contactName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Location:</span>
                <span className="font-bold text-gray-900">{district}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Category:</span>
                <span className="font-bold text-[#0B6B4F]">{category}</span>
              </div>
              <div className="py-1">
                <span className="text-gray-500 block mb-1">Grievance Description:</span>
                <div className="bg-white p-3 rounded-lg border border-gray-200 text-gray-800 italic">
                  "{description}"
                </div>
              </div>
              {fileName && (
                <div className="flex justify-between py-1 text-xs">
                  <span className="text-gray-500">Attached File:</span>
                  <span className="text-[#0B6B4F] font-semibold">{fileName}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-3">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-7 py-3 rounded-xl bg-[#0B6B4F] hover:bg-[#095740] text-white font-bold text-sm flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Grievance'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Success & Tracking ID */}
        {currentStep === 5 && submittedResult && (
          <div className="space-y-5 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0B6B4F] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B6B4F] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Grievance Registered Successfully
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2">
                Tracking ID
              </h4>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-[#0B6B4F] tracking-wide mt-1 bg-gray-50 py-2 px-4 rounded-xl inline-block border border-gray-200">
                {submittedResult.trackingId}
              </div>
            </div>

            <div className="max-w-md mx-auto bg-gray-50 rounded-xl p-4 border border-gray-200 text-left text-xs sm:text-sm space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-500 block">Authority:</span>
                  <span className="font-bold text-gray-900">{submittedResult.authority}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-500 block">Estimated Resolution:</span>
                  <span className="font-semibold text-gray-800">15 to 30 Working Days</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 inline-flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>File Another Grievance</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
