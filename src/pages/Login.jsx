import { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.js';
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const showToast = (message, type = 'success') => {
    const toastDiv = document.createElement('div');
    toastDiv.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    toastDiv.textContent = message;
    document.body.appendChild(toastDiv);
    
    setTimeout(() => {
      toastDiv.style.opacity = '0';
      setTimeout(() => toastDiv.remove(), 300);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        email: formData.email,
        password: formData.password,
      });

      // Store JWT token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Show success toast
      showToast('Login successful!', 'success');
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      console.error('Login failed:', error);
      
      // Show error toast
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      showToast(errorMessage, 'error');
      
      // Clear password field
      setFormData((prev) => ({ ...prev, password: '' }));
      
      // Set error in form
      setErrors((prev) => ({ ...prev, password: 'Invalid credentials' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl shadow-black/50 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#1e40af] shadow-lg shadow-blue-500/20">
              <span className="text-lg font-bold text-white">SOC</span>
            </div>
            <h1 className="text-2xl font-bold text-white">SOC Dashboard</h1>
            <p className="text-sm text-gray-400">Security Operations Center</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" strokeWidth={1.5} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@company.com"
                  className={[
                    'w-full rounded-lg border bg-white/5 py-2.5 pl-10 pr-4 text-white placeholder-gray-500 transition-colors duration-150 focus:outline-none focus:ring-2',
                    errors.email ? 'border-red-500/50 focus:ring-red-500/40' : 'border-white/10 focus:ring-[#1e40af]/40 focus:border-[#1e40af]/40',
                  ].join(' ')}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" strokeWidth={1.5} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={[
                    'w-full rounded-lg border bg-white/5 py-2.5 pl-10 pr-10 text-white placeholder-gray-500 transition-colors duration-150 focus:outline-none focus:ring-2',
                    errors.password ? 'border-red-500/50 focus:ring-red-500/40' : 'border-white/10 focus:ring-[#1e40af]/40 focus:border-[#1e40af]/40',
                  ].join(' ')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" strokeWidth={1.5} /> : <Eye className="h-5 w-5" strokeWidth={1.5} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#1e40af] focus:ring-2 focus:ring-[#1e40af] cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-300 cursor-pointer">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={[
                'w-full rounded-lg py-2.5 font-semibold transition-all duration-200 flex items-center justify-center gap-2',
                loading
                  ? 'bg-[#1e40af]/70 text-white cursor-not-allowed'
                  : 'bg-[#1e40af] text-white hover:bg-[#1e3a8a] hover:shadow-lg hover:shadow-blue-500/20 active:scale-95',
              ].join(' ')}
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="text-center">
            <a href="#" className="text-sm text-[#1e40af] hover:text-blue-400 transition-colors font-medium">
              Forgot password?
            </a>
          </div>

          <div className="pt-4 border-t border-white/10 text-center text-xs text-gray-400">
            <p>Demo credentials: admin@company.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
