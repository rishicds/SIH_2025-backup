"use client";

import { ReactNode, ButtonHTMLAttributes, HTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyles =
    "font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30",
    secondary:
      "bg-light-200 text-gray-900 hover:bg-light-300 border border-light-400",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-primary border border-primary/30 hover:bg-primary/10",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: boolean;
}

export const Card = ({
  children,
  className = "",
  glow = false,
  ...props
}: CardProps) => {
  return (
    <div
      className={`
        bg-white rounded-xl border border-light-300 p-6 shadow-md
        transition-all duration-300 hover:border-primary/50 hover:shadow-lg
        ${glow ? "animate-glow" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "neon";
  className?: string;
}

export const Badge = ({
  children,
  variant = "default",
  className = "",
}: BadgeProps) => {
  const variants = {
    default: "bg-light-200 text-gray-700",
    success: "bg-green-100 text-green-700 border border-green-300",
    warning: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    danger: "bg-red-100 text-red-700 border border-red-300",
    neon: "bg-primary/10 text-primary border border-primary/30",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

interface ToggleProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
}

export const Toggle = ({
  checked,
  onChange,
  label,
  disabled = false,
}: ToggleProps) => {
  return (
    <label
      className={`flex items-center ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <div
          className={`
          block w-14 h-8 rounded-full transition-all duration-300
          ${checked ? "bg-primary" : "bg-light-400"}
          ${!disabled && "hover:opacity-90"}
        `}
        ></div>
        <div
          className={`
          absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-all duration-300 shadow-lg
          ${checked ? "translate-x-6" : "translate-x-0"}
        `}
        ></div>
      </div>
      {label && (
        <span className="ml-3 text-gray-700 font-medium select-none">
          {label}
        </span>
      )}
    </label>
  );
};

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  disabled?: boolean;
}

export const Slider = ({
  value,
  onChange,
  min = 0,
  max = 255,
  label,
  disabled = false,
}: SliderProps) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = Number((e.target as HTMLInputElement).value);
    onChange(newValue);
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <span className="text-sm font-bold text-primary">{value}</span>
        </div>
      )}
      <div className="relative py-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          onInput={handleInput}
          disabled={disabled}
          className="slider w-full"
          aria-label={label || "slider"}
          style={{
            background: disabled
              ? "#ced4da"
              : `linear-gradient(to right, #7CB800 0%, #7CB800 ${percentage}%, #dee2e6 ${percentage}%, #dee2e6 100%)`,
          }}
        />
      </div>
    </div>
  );
};

interface AlertProps {
  children: ReactNode;
  variant?: "info" | "success" | "warning" | "danger";
  onClose?: () => void;
  className?: string;
}

export const Alert = ({
  children,
  variant = "info",
  onClose,
  className = "",
}: AlertProps) => {
  const variants = {
    info: "bg-blue-50 border-blue-300 text-blue-800",
    success: "bg-green-50 border-green-300 text-green-800",
    warning: "bg-yellow-50 border-yellow-300 text-yellow-800",
    danger: "bg-red-50 border-red-300 text-red-800",
  };

  return (
    <div
      className={`p-4 rounded-lg border ${variants[variant]} ${className} relative`}
    >
      {children}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-current opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
};
