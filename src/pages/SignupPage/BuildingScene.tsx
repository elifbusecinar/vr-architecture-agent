import type React from 'react';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const MAX_FLOORS = 12;
const FLOORS_BY_STRENGTH = [0, 2, 4, 7, 9, 12];
const CAPTIONS = [
    'Create your account',
    'Foundation laid',
    'Walls going up',
    'Structure rising',
    'Almost complete',
    'Penthouse unlocked 🏆',
];

// ─── STRENGTH CALCULATOR ─────────────────────────────────────────────────────
export function getPasswordStrength(pw: string): number {
    if (!pw || pw.length === 0) return 0;
    if (pw.length < 6) return 1;
    if (pw.length < 10) return 2;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasDigit = /[0-9]/.test(pw);
    const hasSymbol = /[^A-Za-z0-9]/.test(pw);
    let score = 3;
    if (hasUpper && hasLower) score++;
    if (hasDigit || hasSymbol) score++;
    return Math.min(5, score);
}

// ─── STAR COMPONENT ──────────────────────────────────────────────────────────
function Star({ index }: { index: number }) {
    const sz = 1 + (((index * 7 + 3) % 20) / 10);
    const top = ((index * 31 + 17) % 75);
    const left = ((index * 53 + 11) % 100);
    const dur = (2 + ((index * 13) % 30) / 10).toFixed(1);
    const delay = ((index * 17) % 30 / 10).toFixed(1);

    return (
        <div
            className="ob-star"
            style={{
                width: sz, height: sz,
                top: `${top}%`, left: `${left}%`,
                // @ts-ignore -- CSS custom properties
                '--tw-dur': `${dur}s`,
                '--tw-delay': `${delay}s`,
            } as React.CSSProperties}
        />
    );
}

// ─── FLOOR COMPONENT ─────────────────────────────────────────────────────────
function Floor({ index, strength }: { index: number; strength: number }) {
    const litChance = strength / 5;
    // Stable random per-window using index-based seed
    const windows = [0, 1, 2, 3].map(w => {
        const seed = (index * 4 + w) * 2654435761;
        const rand = ((seed >>> 0) % 1000) / 1000;
        return rand < litChance;
    });

    return (
        <div
            className="ob-floor"
            style={{ animationDelay: `${index * 0.035}s` }}
        >
            {windows.map((lit, w) => (
                <div key={w} className={`ob-floor-window${lit ? ' lit' : ''}`} />
            ))}
        </div>
    );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
interface BuildingSceneProps {
    strength: number;  // 0–5
    wireframe?: boolean;
}

export default function BuildingScene({ strength, wireframe = false }: BuildingSceneProps) {
    const targetFloors = FLOORS_BY_STRENGTH[strength] ?? 0;
    const caption = CAPTIONS[strength] ?? CAPTIONS[0];
    const showRoof = targetFloors >= MAX_FLOORS - 2;
    const showAntenna = strength >= 5;
    const showCrane = targetFloors > 0 && strength < 5;

    const floors = Array.from({ length: targetFloors }, (_, i) => i);

    return (
        <div className="ob-building-scene">
            {/* Stars */}
            <div className="ob-sky-stars">
                {Array.from({ length: 24 }, (_, i) => <Star key={i} index={i} />)}
            </div>

            <div className="ob-building-outer">
                <div className={`ob-building-wrap${wireframe ? ' wireframe' : ''}`} data-strength={strength}>
                    {/* Antenna */}
                    <div className={`ob-antenna${showAntenna ? ' visible' : ''}`}>
                        <div className="ob-antenna-tip" />
                    </div>

                    {/* Crane */}
                    <div className={`ob-crane${showCrane ? ' visible' : ''}`}>
                        <div className="ob-crane-mast" />
                        <div className="ob-crane-arm" />
                        <div className="ob-crane-hook" />
                    </div>

                    {/* Roof */}
                    <div className={`ob-roof${showRoof ? ' visible' : ''}`} />

                    {/* Floors */}
                    <div className="ob-building-floors">
                        {floors.map(i => (
                            <Floor key={i} index={i} strength={strength} />
                        ))}
                    </div>

                    {/* Ground */}
                    <div className="ob-ground" />
                </div>

                {/* Strength indicator segments */}
                <div className="ob-strength-row">
                    {[1, 2, 3, 4, 5].map(s => (
                        <div
                            key={s}
                            className={`ob-strength-seg${s <= strength ? ` s${strength}` : ''}`}
                        />
                    ))}
                </div>

                {/* Caption */}
                <div className="ob-building-caption">{caption}</div>
            </div>
        </div>
    );
}
