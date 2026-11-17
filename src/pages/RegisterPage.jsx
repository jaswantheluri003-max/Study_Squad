import React, { useState, useRef } from 'react';
import { useRoomRadar } from '../context/RoomRadarContext';
import { UserAvatar } from '../components/UserAvatar';
import { DEFAULT_AVATAR } from '../utils/constants';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Hash,
  Camera
} from 'lucide-react';

export const RegisterPage = () => {
  const { setCurrentPage, handleRegister, showToast } = useRoomRadar();

  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    department: 'Computer Science & Engineering',
    year: '1st Year (Freshman)',
    password: '',
    confirmPassword: '',
    avatar: DEFAULT_AVATAR,
    academicInterests: ['Operating Systems', 'Algorithms'],
  });

  const handleCustomAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('File Too Large', 'Please upload an image smaller than 2MB.', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      if (uploadEvt.target?.result) {
        setFormData(prev => ({ ...prev, avatar: uploadEvt.target.result }));
        showToast('Photo Attached', 'Profile photo attached to registration.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeHonorCode, setAgreeHonorCode] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'Computer Science & Engineering',
    'Applied Mathematics & Statistics',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Data Science & Artificial Intelligence',
    'Economics & Business Management'
  ];

  const years = [
    '1st Year (Freshman)',
    '2nd Year (Sophomore)',
    '3rd Year (Junior)',
    '4th Year (Senior)',
    'Graduate / Master’s'
  ];

  const availableInterests = [
    'Operating Systems',
    'Linear Algebra',
    'Algorithms & Data Structures',
    'Deep Learning & AI',
    'GATE CSE Prep',
    'GRE Quant',
    'Computer Networks',
    'Thermodynamics'
  ];

  const toggleInterest = (interest) => {
    setFormData(prev => {
      const exists = prev.academicInterests.includes(interest);
      return {
        ...prev,
        academicInterests: exists
          ? prev.academicInterests.filter(i => i !== interest)
          : [...prev.academicInterests, interest]
      };
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Campus email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid university email address.';
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID token or roll number is required.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeHonorCode) {
      newErrors.honor = 'You must agree to the Campus Study Space Honor Code.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const res = handleRegister(formData);
      setIsSubmitting(false);

      if (res.success) {
        showToast('Account Created! 🎓', `Welcome to Study Squad, ${res.user.name}. Your workspace is ready!`, 'success');
        setCurrentPage('dashboard');
      } else {
        setErrors({ form: res.error || 'Registration failed. Please try again.' });
      }
    }, 450);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl space-y-6 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 text-white shadow-lg shadow-indigo-500/25 mb-1">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Join <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-400 bg-clip-text text-transparent">Study Squad</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Create your verified student profile to hold rooms and connect with study squads.
          </p>
        </div>

        {/* Card Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md">
          {errors.form && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Preview & Optional Upload */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <div className="relative group">
                <UserAvatar
                  src={formData.avatar}
                  alt="Student Avatar Preview"
                  className="w-14 h-14 ring-2 ring-indigo-500/40"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-transform hover:scale-110"
                  title="Upload custom profile photo"
                >
                  <Camera className="w-3 h-3" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCustomAvatar}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Profile Avatar
                </span>
                <p className="text-[11px] text-slate-500">
                  {formData.avatar === DEFAULT_AVATAR ? 'Official default avatar assigned' : 'Custom photo attached'}
                </p>
                {formData.avatar !== DEFAULT_AVATAR && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, avatar: DEFAULT_AVATAR }))}
                    className="text-[10px] text-indigo-500 hover:underline mt-0.5"
                  >
                    Reset to default avatar
                  </button>
                )}
              </div>
            </div>
            {/* Full Name & Student ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: null });
                    }}
                    placeholder="e.g. Jordan Lee"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.name ? 'border-rose-400 ring-2 ring-rose-400/20' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    } text-slate-800 dark:text-slate-200 focus:outline-none transition-all`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Student ID / Roll No.
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => {
                      setFormData({ ...formData, studentId: e.target.value });
                      if (errors.studentId) setErrors({ ...errors, studentId: null });
                    }}
                    placeholder="e.g. CS-2025-4102"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.studentId ? 'border-rose-400 ring-2 ring-rose-400/20' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    } text-slate-800 dark:text-slate-200 focus:outline-none font-mono transition-all`}
                  />
                </div>
                {errors.studentId && <p className="text-[11px] text-rose-500 mt-1">{errors.studentId}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Campus Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  placeholder="student.name@campus.edu"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border ${
                    errors.email ? 'border-rose-400 ring-2 ring-rose-400/20' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  } text-slate-800 dark:text-slate-200 focus:outline-none transition-all`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

            {/* Department & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Academic Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {departments.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Year of Study
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {years.map((y, i) => (
                    <option key={i} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                    placeholder="Min 6 characters"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.password ? 'border-rose-400 ring-2 ring-rose-400/20' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    } text-slate-800 dark:text-slate-200 focus:outline-none transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                    }}
                    placeholder="Re-type password"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.confirmPassword ? 'border-rose-400 ring-2 ring-rose-400/20' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    } text-slate-800 dark:text-slate-200 focus:outline-none transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[11px] text-rose-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Academic Interests Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Core Academic & Exam Interests (For Squad Matching)
              </label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {availableInterests.map((interest) => {
                  const selected = formData.academicInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        selected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Honor Code Agreement */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={agreeHonorCode}
                  onChange={(e) => {
                    setAgreeHonorCode(e.target.checked);
                    if (errors.honor) setErrors({ ...errors, honor: null });
                  }}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                />
                <span>
                  I agree to respect the campus quiet zones, honor 20-minute hold limits, and keep group spaces clean.
                </span>
              </label>
              {errors.honor && <p className="text-[11px] text-rose-500 mt-1">{errors.honor}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {isSubmitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Study Squad Account</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Switch to Login */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <button
            onClick={() => setCurrentPage('login')}
            className="font-bold text-indigo-600 dark:text-cyan-400 hover:underline"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};
