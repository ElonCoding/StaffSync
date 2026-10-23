import React from 'react';

export default function LineArtBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      <svg
        className="w-full h-full text-[#173D32] opacity-25"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M 60 70 H 220 V 160 H 130 V 230 H 420 V 380 H 320"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M 360 40 H 520 V 110 H 940 V 45 H 1120 V 120 H 1380"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M 120 360 H 280 V 520 H 160 V 680 H 460 V 780"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M 980 260 H 1160 V 390 H 1340 V 560 H 1080 V 720 H 1280"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M 280 620 H 680 V 710 H 920 V 650 H 1220"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <rect
          x="100"
          y="180"
          width="48"
          height="24"
          rx="6"
          stroke="currentColor"
          strokeWidth="1"
          fill="#EAE9DF"
          fillOpacity="0.8"
        />
        <text
          x="124"
          y="196"
          textAnchor="middle"
          fontSize="10"
          fontFamily="monospace"
          fill="#173D32"
          opacity="0.85"
        >
          ··
        </text>

        <rect
          x="24"
          y="348"
          width="52"
          height="24"
          rx="6"
          stroke="currentColor"
          strokeWidth="1"
          fill="#EAE9DF"
          fillOpacity="0.8"
        />
        <text
          x="50"
          y="364"
          textAnchor="middle"
          fontSize="10"
          fontFamily="sans-serif"
          fill="#173D32"
          opacity="0.85"
        >
          ≡
        </text>

        <rect
          x="110"
          y="508"
          width="54"
          height="24"
          rx="6"
          stroke="currentColor"
          strokeWidth="1"
          fill="#EAE9DF"
          fillOpacity="0.8"
        />
        <text
          x="137"
          y="524"
          textAnchor="middle"
          fontSize="11"
          fontFamily="monospace"
          fill="#173D32"
          opacity="0.85"
        >
          %
        </text>

        <rect
          x="68"
          y="768"
          width="74"
          height="26"
          rx="6"
          stroke="currentColor"
          strokeWidth="1"
          fill="#EAE9DF"
          fillOpacity="0.9"
        />
        <text
          x="105"
          y="785"
          textAnchor="middle"
          fontSize="10"
          fontFamily="sans-serif"
          fill="#173D32"
          fontWeight="500"
        >
          ✦ /sync/
        </text>

        <rect
          x="1160"
          y="98"
          width="52"
          height="24"
          rx="6"
          stroke="currentColor"
          strokeWidth="1"
          fill="#EAE9DF"
          fillOpacity="0.8"
        />
        <text
          x="1186"
          y="114"
          textAnchor="middle"
          fontSize="10"
          fontFamily="monospace"
          fill="#173D32"
        >
          ··
        </text>

        <rect
          x="1220"
          y="378"
          width="48"
          height="24"
          rx="6"
          stroke="currentColor"
          strokeWidth="1"
          fill="#EAE9DF"
          fillOpacity="0.8"
        />
        <text
          x="1244"
          y="394"
          textAnchor="middle"
          fontSize="10"
          fontFamily="sans-serif"
          fill="#173D32"
        >
          ≡
        </text>

        <g transform="translate(420, 610)">
          <rect
            x="0"
            y="0"
            width="128"
            height="26"
            rx="13"
            stroke="currentColor"
            strokeWidth="1"
            fill="#EAE9DF"
          />
          <circle cx="14" cy="13" r="3.5" fill="#34785B" />
          <text
            x="24"
            y="17"
            fontSize="10.5"
            fontWeight="500"
            fontFamily="sans-serif"
            fill="#173D32"
          >
            Auto-sync • live
          </text>
        </g>
      </svg>
    </div>
  );
}
