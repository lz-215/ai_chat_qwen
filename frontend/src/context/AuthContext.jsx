import React, { createContext, useState, useContext, useEffect } from 'react';

// 创建认证上下文
export const AuthContext = createContext();

// 获取主域名函数
const getMainDomain = () => {
  const hostName = window.location.hostname;
  const parts = hostName.split('.');
  if (parts.length > 2) {
    return parts.slice(-2).join('.');
  }
  return hostName;
};

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  // 状态定义
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 在组件挂载时从 localStorage 恢复认证状态
  useEffect(() => {
    const processUserData = (rawData) => {
      try {
        const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
        let picture = data.picture;
        
        // 处理可能被编码的头像 URL
        if (picture) {
          try {
            // 如果是 base64 数据，保持原样
            if (picture.startsWith('data:image')) {
              return { ...data, picture };
            }
            // 处理可能被多次编码的 URL
            while (picture.includes('%')) {
              const decoded = decodeURIComponent(picture);
              if (decoded === picture) break;
              picture = decoded;
            }
            return { ...data, picture };
          } catch (e) {
            console.error('Error processing avatar URL:', e);
            return { ...data, picture: null };
          }
        }
        return data;
      } catch (e) {
        console.error('Error processing user data:', e);
        return null;
      }
    };

    // 检查 URL 是否包含 Google 登录信息
    const url = window.location.href;
    if (url.includes('google_id=')) {
      const params = new URLSearchParams(url.split('?')[1]);
      
      // 构建用户数据对象
      const userData = {
        googleId: params.get('google_id'),
        name: params.get('name'),
        email: params.get('email'),
        picture: params.get('picture')
      };

      // 处理用户数据
      const processedData = processUserData(userData);
      if (processedData) {
        const token = btoa(JSON.stringify(processedData));
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(processedData));
        setAuthToken(token);
        setUser(processedData);
        setIsAuthenticated(true);
      }
      
      // 清理 URL 参数
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    } else {
      // 恢复现有的认证状态
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        const processedData = processUserData(storedUser);
        if (processedData) {
          setAuthToken(token);
          setUser(processedData);
          setIsAuthenticated(true);
        } else {
          // 数据无效，清除存储
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
    }
    setLoading(false);
  }, []);

  // 登录函数
  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      
      // 保存令牌和认证状态
      localStorage.setItem('authToken', data.access_token);
      setAuthToken(data.access_token);
      
      // 获取用户信息
      const userResponse = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
      }
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Google 登录函数
  const googleLogin = () => {
    const mainDomain = getMainDomain();
    const callback = encodeURIComponent(window.location.href);
    window.location.href = `https://aa.jstang.cn/google_login.php?url=${mainDomain}&redirect_uri=${callback}`;
  };

  // 登出函数
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // 为上下文提供的值
  const contextValue = {
    user,
    isAuthenticated,
    authToken,
    loading,
    login,
    logout,
    googleLogin
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义钩子，便于使用认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};