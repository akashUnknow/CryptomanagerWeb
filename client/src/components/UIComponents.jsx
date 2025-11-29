import React from 'react';

// Button Component
export const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'text-gray-600 hover:bg-gray-100'
  };
  
  const sizes = { 
    sm: 'px-3 py-1.5 text-sm', 
    md: 'px-4 py-2.5 text-sm', 
    lg: 'px-6 py-3 text-base' 
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

// Card Component
export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

// Card Header Component
export const CardHeader = ({ icon: Icon, title, description, iconBgColor = 'bg-blue-100', iconColor = 'text-blue-600' }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

// Input Component
export const Input = ({ label, icon: Icon, className = '', ...props }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input 
        className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${Icon ? 'pl-11' : ''} ${className}`} 
        {...props} 
      />
    </div>
  </div>
);

// Select Component
export const Select = ({ label, options, className = '', ...props }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <select 
      className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${className}`} 
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// Textarea Component
export const Textarea = ({ label, className = '', ...props }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <textarea 
      className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${className}`} 
      {...props} 
    />
  </div>
);

// Alert Component (for errors)
export const Alert = ({ children, variant = 'error' }) => {
  const variants = {
    error: 'bg-red-50 border-red-200 text-red-600',
    success: 'bg-green-50 border-green-200 text-green-600',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    info: 'bg-blue-50 border-blue-200 text-blue-600'
  };
  
  return (
    <div className={`p-3 rounded-lg border text-sm ${variants[variant]}`}>
      {children}
    </div>
  );
};

// Result Display Component
export const ResultDisplay = ({ result, onCopy, copied }) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[120px] font-mono text-sm text-gray-600 break-all">
    {result || 'Result will appear here...'}
  </div>
);