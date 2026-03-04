import React from 'react';

interface AgentLogoProps {
    size?: number;
    color?: string;
    className?: string;
}

const AgentLogo: React.FC<AgentLogoProps> = ({ size = 24, color = "white", className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Hexagonal "Arch" Frame */}
        <path
            d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        {/* Inner stylized A / Arch shape */}
        <path
            d="M12 22V12L3 7"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M12 12L21 7"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        {/* Central Core Pulse */}
        <circle
            cx="12"
            cy="12"
            r="3"
            fill={color}
            fillOpacity="0.2"
            stroke={color}
            strokeWidth="1"
        />
        <path
            d="M9 13.5L12 10.5L15 13.5"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default AgentLogo;
