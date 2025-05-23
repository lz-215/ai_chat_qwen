import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab); // 'login', 'smsLogin', or 'register'

  // 当 initialTab 改变时，更新 activeTab
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+86');
  const [verificationCode, setVerificationCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // 处理倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 发送验证码
  const sendVerificationCode = () => {
    if (!phoneNumber) {
      setError(t('app.auth.phoneRequired'));
      return;
    }

    // 这里应该有发送验证码的API调用
    // 模拟发送验证码
    setCountdown(60); // 60秒倒计时
    setError('');
  };

  // 处理登录
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        onClose();
      } else {
        setError(result.error || t('app.auth.loginFailed'));
      }
    } catch (error) {
      setError(t('app.auth.unexpectedError'));
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理注册
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber) {
      setError(t('app.auth.phoneRequired'));
      return;
    }

    if (!verificationCode) {
      setError(t('app.auth.codeRequired'));
      return;
    }

    if (!agreeToTerms) {
      setError(t('app.auth.agreeTermsRequired'));
      return;
    }

    setIsLoading(true);

    try {
      // 这里应该有注册的API调用
      // 模拟注册成功
      setTimeout(() => {
        setIsLoading(false);
        // 注册成功后切换到登录标签
        setActiveTab('login');
        setError('');
      }, 1000);
    } catch (error) {
      setError(t('app.auth.registrationFailed'));
      setIsLoading(false);
    }
  };

  // 如果弹窗未打开，不渲染任何内容
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">


        {/* 标签切换 */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === 'login'
                ? 'text-gray-900 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('login')}
          >
            {t('app.auth.accountLogin')}
          </button>
          <button
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === 'smsLogin'
                ? 'text-gray-900 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('smsLogin')}
          >
            {t('app.auth.smsLogin')}
          </button>
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="px-4 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 表单内容 */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {activeTab === 'login' ? (
            // 账号登录表单
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('app.login.username')}
                  required
                />
              </div>

              <div className="mb-6">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('app.login.password')}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? t('app.login.loggingIn') : t('app.auth.login')}
              </button>
            </form>
          ) : activeTab === 'smsLogin' ? (
            // 短信登录表单
            <form onSubmit={handleLogin}>
              <div className="mb-4 flex">
                <div className="w-24 flex-shrink-0">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full h-full p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="+86">+86</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+81">+81</option>
                  </select>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-grow p-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('app.auth.enterPhoneNumber')}
                  required
                />
              </div>

              <div className="mb-6 flex">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('app.auth.verificationCode')}
                  required
                />
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  disabled={countdown > 0}
                  className={`w-32 flex-shrink-0 p-3 bg-blue-500 text-white rounded-r-lg font-medium hover:bg-blue-600 transition-colors ${
                    countdown > 0 ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {countdown > 0 ? `${countdown}s` : t('app.auth.sendCode')}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? t('app.login.loggingIn') : t('app.auth.login')}
              </button>
            </form>
          ) : (
            // 注册表单
            <form onSubmit={handleRegister}>
              <div className="mb-4 flex">
                <div className="w-24 flex-shrink-0">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full h-full p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="+86">+86</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+81">+81</option>
                  </select>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-grow p-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('app.auth.enterPhoneNumber')}
                  required
                />
              </div>

              <div className="mb-6 flex">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('app.auth.verificationCode')}
                  required
                />
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  disabled={countdown > 0}
                  className={`w-32 flex-shrink-0 p-3 bg-blue-500 text-white rounded-r-lg font-medium hover:bg-blue-600 transition-colors ${
                    countdown > 0 ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {countdown > 0 ? `${countdown}s` : t('app.auth.sendCode')}
                </button>
              </div>

              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                  {t('app.auth.readAndAgree')}
                  <a href="/terms-of-service" className="text-blue-500 hover:text-blue-700 mx-1" target="_blank">
                    {t('app.footer.terms')}
                  </a>
                  {t('app.auth.and')}
                  <a href="/privacy-policy" className="text-blue-500 hover:text-blue-700 mx-1" target="_blank">
                    {t('app.footer.privacy')}
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? t('app.auth.registering') : t('app.auth.registerButton')}
              </button>
            </form>
          )}

          {activeTab === 'login' && (
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-blue-500 hover:text-blue-700" onClick={() => setActiveTab('smsLogin')}>
                {t('app.auth.switchToSms')}
              </a>
            </div>
          )}

          {activeTab === 'smsLogin' && (
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-blue-500 hover:text-blue-700" onClick={() => setActiveTab('login')}>
                {t('app.auth.switchToAccount')}
              </a>
            </div>
          )}

          {activeTab === 'login' && (
            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-blue-500 hover:text-blue-700">
                {t('app.login.forgotPassword')}
              </a>
            </div>
          )}

          {(activeTab === 'login' || activeTab === 'smsLogin') && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {t('app.auth.orContinueWith')}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    const { googleLogin } = useAuth();
                    googleLogin();
                  }}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t('app.auth.continueWithGoogle')}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'register' && (
            <div className="mt-6 text-center">
              <a
                href="#"
                className="text-sm text-blue-500 hover:text-blue-700"
                onClick={() => setActiveTab('login')}
              >
                {t('app.auth.alreadyHaveAccount')}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
