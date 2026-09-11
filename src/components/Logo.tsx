import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  withText?: boolean;
}

export function Logo({ size = 32, className, withText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>
        <path
          d="M16 1.5 L28.5 5.5 L28.5 14.5 C28.5 22.5 22.5 28.5 16 30.5 C9.5 28.5 3.5 22.5 3.5 14.5 L3.5 5.5 Z"
          fill="url(#logoGrad)"
        />
        <path
          d="M10.5 16.2 L14.2 19.9 L21.5 12"
          stroke="white"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withText && (
        <span className="text-lg font-semibold tracking-tight text-text">
          BeforeSend
        </span>
      )}
    </div>
  );
}