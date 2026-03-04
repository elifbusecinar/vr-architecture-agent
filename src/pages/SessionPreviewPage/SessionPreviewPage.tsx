import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import './SessionPreviewPage.css';

interface Participant {
    id: string;
    name: string;
    initials: string;
    role: string;
    color: string;
    placed: boolean;
    spawn?: THREE.Vector3;
}

const waypointsData = [
    { theta: 0.3, phi: 0.85, radius: 14, tx: -1, ty: 1, tz: 2, fpPos: [3, 1.7, 3.5], fpYaw: 2.7, room: 'Entrance' },
    { theta: -0.5, phi: 1.0, radius: 10, tx: -3, ty: 1, tz: 0, fpPos: [-1.5, 1.7, 1.5], fpYaw: 2.8, room: 'Living Room' },
    { theta: 0.6, phi: 1.0, radius: 9, tx: 2, ty: 1, tz: -2.5, fpPos: [1, 1.7, -0.5], fpYaw: 0.1, room: 'Kitchen' },
    { theta: -1.1, phi: 1.0, radius: 9, tx: -3, ty: 1, tz: -2, fpPos: [-2, 1.7, 0.5], fpYaw: -1.0, room: 'Bedroom' },
];

const SessionPreviewPage: React.FC = () => {
    const navigate = useNavigate();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fpCanvasRef = useRef<HTMLCanvasElement>(null);
    const mainRendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const fpRendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const mainSceneRef = useRef<THREE.Scene | null>(null);
    const fpSceneRef = useRef<THREE.Scene | null>(null);
    const mainCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const fpCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const floorPlaneRef = useRef<THREE.Mesh | null>(null);

    const [participants, setParticipants] = useState<Record<string, Participant>>({
        you: { id: 'you', name: 'Ahmet Koç', initials: 'AK', role: 'Host · Owner', color: 'rgba(45,91,227,0.88)', placed: false },
        martin: { id: 'martin', name: 'Martin Koch', initials: 'MK', role: 'Client · Guest', color: 'rgba(26,122,74,0.88)', placed: false },
        selin: { id: 'selin', name: 'Selin Fidan', initials: 'SF', role: 'Architect · Team', color: 'rgba(180,83,9,0.88)', placed: false },
    });

    const [activeParticipantId, setActiveParticipantId] = useState('you');
    const [currentWP, setCurrentWP] = useState(0);
    const [placingMode, setPlacingMode] = useState(true);
    const [viewMode, setViewMode] = useState<'overview' | 'top' | 'fp'>('overview');
    const [fpActive, setFpActive] = useState(false);
    const [fps, setFps] = useState(60);
    const [locomotion, setLocomotion] = useState('Teleport');
    const [scale, setScale] = useState('1:1 (real)');
    const [fpWireframe, setFpWireframe] = useState(false);

    const [markerPositions, setMarkerPositions] = useState<Record<string, { x: number, y: number }>>({});
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, visible: false });

    // Orbit/Camera Ref States
    const orbRef = useRef({ theta: 0.7, phi: 0.9, radius: 18, tx: 0, ty: 1, tz: 0 });
    const fpLookRef = useRef({ yaw: 0.1, pitch: -0.05 });
    const isDraggingRef = useRef(false);
    const lastMouseRef = useRef({ x: 0, y: 0 });

    const buildScene = useCallback(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#0D0C0B');

        const amb = new THREE.AmbientLight(0xfaf6f0, 0.55); scene.add(amb);
        const sun = new THREE.DirectionalLight(0xfff5e0, 0.8);
        sun.position.set(15, 20, 10); sun.castShadow = true;
        scene.add(sun);

        const grid = new THREE.GridHelper(28, 28, 0x1e1e1e, 0x181818);
        scene.add(grid);

        const makeMat = (c: THREE.ColorRepresentation, r = 0.65, m = 0, op = 1) => new THREE.MeshStandardMaterial({
            color: c, roughness: r, metalness: m,
            transparent: op < 1, opacity: op, side: THREE.DoubleSide
        });

        const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number) => {
            const m = new THREE.Mesh(geo, mat);
            m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
            scene.add(m); return m;
        };

        const B = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
        const wm = makeMat(0xF0EDE7, 0.85);
        const wallH = 2.9, wY = wallH / 2;

        add(B(12, 0.12, 9), makeMat(0xD8C8A8, 0.9), 0, -0.06, 0);
        add(B(12, 0.08, 9), makeMat(0xF5F3EF, 0.95), 0, wallH, 0);
        add(B(12, wallH, 0.14), wm.clone(), 0, wY, -4.5);
        add(B(12, wallH, 0.14), wm.clone(), 0, wY, 4.5);
        add(B(0.14, wallH, 9), wm.clone(), -6, wY, 0);
        add(B(0.14, wallH, 9), wm.clone(), 6, wY, 0);
        add(B(5.9, wallH, 0.12), wm.clone(), -3, wY, 0);

        // Invisible floor for raycasting
        const floorPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(12, 9),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        floorPlane.rotation.x = -Math.PI / 2;
        floorPlane.position.y = 0.01;
        scene.add(floorPlane);

        return { scene, floorPlane };
    }, []);

    const applyOrbit = useCallback((cam: THREE.PerspectiveCamera) => {
        const o = orbRef.current;
        const s = Math.sin(o.phi);
        cam.position.set(
            o.tx + o.radius * s * Math.sin(o.theta),
            o.ty + o.radius * Math.cos(o.phi),
            o.tz + o.radius * s * Math.cos(o.theta)
        );
        cam.lookAt(o.tx, o.ty, o.tz);
    }, []);

    const applyFP = useCallback(() => {
        if (!fpCameraRef.current) return;
        const wp = waypointsData[currentWP];
        fpCameraRef.current.position.set(wp.fpPos[0] as number, wp.fpPos[1] as number, wp.fpPos[2] as number);
        fpCameraRef.current.rotation.set(fpLookRef.current.pitch, fpLookRef.current.yaw, 0, 'YXZ');
    }, [currentWP]);

    useEffect(() => {
        if (!canvasRef.current || !fpCanvasRef.current) return;

        const mainRes = buildScene();
        mainSceneRef.current = mainRes.scene;
        floorPlaneRef.current = mainRes.floorPlane;

        const fpRes = buildScene();
        fpSceneRef.current = fpRes.scene;

        mainRendererRef.current = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
        fpRendererRef.current = new THREE.WebGLRenderer({ canvas: fpCanvasRef.current, antialias: true });

        [mainRendererRef.current, fpRendererRef.current].forEach(r => {
            r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            r.shadowMap.enabled = true;
            r.toneMapping = THREE.ACESFilmicToneMapping;
            r.toneMappingExposure = 1.0;
        });

        mainCameraRef.current = new THREE.PerspectiveCamera(45, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.01, 200);
        fpCameraRef.current = new THREE.PerspectiveCamera(75, fpCanvasRef.current.clientWidth / fpCanvasRef.current.clientHeight, 0.01, 200);

        applyOrbit(mainCameraRef.current);

        let lastT = 0, fpsC = 0, fpsT = 0;
        const animate = (t: number) => {
            const dt = t - lastT; lastT = t;
            fpsC++; fpsT += dt;
            if (fpsT > 600) {
                setFps(Math.round(fpsC * 1000 / fpsT));
                fpsC = 0; fpsT = 0;
            }

            if (mainSceneRef.current && mainCameraRef.current) {
                mainRendererRef.current?.render(mainSceneRef.current, mainCameraRef.current);

                // Update marker screen positions
                const rect = canvasRef.current?.getBoundingClientRect();
                if (rect && mainCameraRef.current) {
                    const newMarkers: Record<string, { x: number, y: number }> = {};
                    Object.entries(participants).forEach(([id, p]) => {
                        if (p.placed && p.spawn) {
                            const v = p.spawn.clone().project(mainCameraRef.current!);
                            newMarkers[id] = {
                                x: (v.x + 1) / 2 * rect.width,
                                y: -(v.y - 1) / 2 * rect.height
                            };
                        }
                    });
                    setMarkerPositions(newMarkers);
                }
            }
            if (fpActive && fpSceneRef.current && fpCameraRef.current) {
                fpRendererRef.current?.render(fpSceneRef.current, fpCameraRef.current);
            }
            requestAnimationFrame(animate);
        };
        const frameId = requestAnimationFrame(animate);

        const handleResize = () => {
            if (!canvasRef.current || !fpCanvasRef.current) return;
            const mw = canvasRef.current.clientWidth, mh = canvasRef.current.clientHeight;
            mainRendererRef.current?.setSize(mw, mh, false);
            mainCameraRef.current!.aspect = mw / mh; mainCameraRef.current!.updateProjectionMatrix();

            const fw = fpCanvasRef.current.clientWidth, fh = fpCanvasRef.current.clientHeight;
            fpRendererRef.current?.setSize(fw, fh, false);
            fpCameraRef.current!.aspect = fw / fh; fpCameraRef.current!.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
            mainRendererRef.current?.dispose();
            fpRendererRef.current?.dispose();
        };
    }, [buildScene, applyOrbit, fpActive, participants]);

    const handleMainMouseDown = (e: React.MouseEvent) => {
        isDraggingRef.current = true;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMainMouseMove = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect || !mainCameraRef.current || !floorPlaneRef.current) return;

        if (isDraggingRef.current) {
            const dx = e.clientX - lastMouseRef.current.x;
            const dy = e.clientY - lastMouseRef.current.y;
            lastMouseRef.current = { x: e.clientX, y: e.clientY };
            orbRef.current.theta -= dx * 0.006;
            orbRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, orbRef.current.phi + dy * 0.006));
            applyOrbit(mainCameraRef.current);
        }

        if (placingMode && !isDraggingRef.current) {
            const mouse = new THREE.Vector2(
                ((e.clientX - rect.left) / rect.width) * 2 - 1,
                -((e.clientY - rect.top) / rect.height) * 2 + 1
            );
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, mainCameraRef.current);
            const hits = raycaster.intersectObject(floorPlaneRef.current);
            if (hits.length) {
                setCursorPos({ x: e.clientX, y: e.clientY, visible: true });
            } else {
                setCursorPos(prev => ({ ...prev, visible: false }));
            }
        }
    };

    const handleMainClick = (e: React.MouseEvent) => {
        if (!placingMode || isDraggingRef.current) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect || !mainCameraRef.current || !floorPlaneRef.current) return;

        const mouse = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, mainCameraRef.current);
        const hits = raycaster.intersectObject(floorPlaneRef.current);

        if (hits.length) {
            const pt = hits[0].point;
            const updatedParticipants = { ...participants };
            updatedParticipants[activeParticipantId].spawn = pt;
            updatedParticipants[activeParticipantId].placed = true;
            setParticipants(updatedParticipants);

            // Auto-advance
            const next = ['you', 'martin', 'selin'].find(k => !updatedParticipants[k].placed);
            if (next) {
                setActiveParticipantId(next);
            } else {
                setPlacingMode(false);
            }
        }
    };

    const handleFpMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingRef.current) return;
        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
        fpLookRef.current.yaw -= dx * 0.005;
        fpLookRef.current.pitch = Math.max(-0.8, Math.min(0.5, fpLookRef.current.pitch - dy * 0.005));
        applyFP();
    };

    const setMode = (mode: 'overview' | 'top' | 'fp') => {
        setViewMode(mode);
        if (mode === 'top') {
            orbRef.current.phi = 0.05; orbRef.current.radius = 20;
            orbRef.current.tx = 0; orbRef.current.ty = 0; orbRef.current.tz = 0;
            if (mainCameraRef.current) applyOrbit(mainCameraRef.current);
        } else if (mode === 'overview') {
            orbRef.current.phi = 0.9; orbRef.current.radius = 18;
            if (mainCameraRef.current) applyOrbit(mainCameraRef.current);
        } else if (mode === 'fp') {
            setFpActive(true);
        }
    };

    const resetSpawns = () => {
        const reset = { ...participants };
        Object.keys(reset).forEach(k => {
            reset[k].placed = false;
            reset[k].spawn = undefined;
        });
        setParticipants(reset);
        setPlacingMode(true);
        setActiveParticipantId('you');
    };

    return (
        <div className="session-preview-page">
            <div className="sp-topbar">
                <div className="sp-tb-back" onClick={() => navigate(-1)}>← Back</div>
                <div className="sp-tb-sep"></div>
                <div className="sp-tb-info">
                    <div className="sp-tb-title">Session Preview</div>
                    <div className="sp-tb-sub">Set spawn points · plan tour route · then launch VR</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                    <div className="step-badge">
                        <div className="sb-num">2</div>
                        {Object.values(participants).every(p => p.placed) ? 'Ready to launch' : 'Place spawn points'}
                    </div>
                    <div className="sp-tb-sep"></div>
                    <button className="btn btn-secondary" onClick={resetSpawns}>↺ Reset</button>
                    <button className="btn btn-primary" onClick={() => alert('Launching VR session...')}>🥽 Launch in VR</button>
                </div>
            </div>

            <div className="sp-body-wrap">
                <div className="sp-left-panel">
                    <div className="lp-section">
                        <div className="lp-section-title">Participants · click to place</div>
                        {Object.values(participants).map(p => (
                            <div
                                key={p.id}
                                className={`participant-card ${activeParticipantId === p.id ? 'selected' : ''}`}
                                onClick={() => { setActiveParticipantId(p.id); setPlacingMode(true); }}
                            >
                                <div className="pc-av" style={{ background: p.id === 'you' ? 'linear-gradient(135deg,#2D5BE3,#7C3AED)' : (p.id === 'martin' ? 'linear-gradient(135deg,#1A7A4A,#22A05A)' : 'linear-gradient(135deg,#B45309,#E07000)') }}>{p.initials}</div>
                                <div className="pc-info">
                                    <div className="pc-name">{p.name} {p.id === 'you' && <span style={{ fontSize: '10px', color: 'var(--ink-3)' }}>(you)</span>}</div>
                                    <div className="pc-role">{p.role}</div>
                                </div>
                                <div className={`pc-spawn ${p.placed ? 'set' : ''}`}>{p.placed ? 'Set ✓' : 'Not set'}</div>
                            </div>
                        ))}
                    </div>

                    <div className="lp-sep"></div>

                    <div className="lp-section">
                        <div className="lp-section-title">Tour waypoints</div>
                        {waypointsData.map((wp, i) => (
                            <div key={i} className={`waypoint-item ${currentWP === i ? 'active' : ''}`} onClick={() => {
                                setCurrentWP(i);
                                orbRef.current.theta = wp.theta; orbRef.current.phi = wp.phi; orbRef.current.radius = wp.radius;
                                orbRef.current.tx = wp.tx; orbRef.current.ty = wp.ty; orbRef.current.tz = wp.tz;
                                if (mainCameraRef.current) applyOrbit(mainCameraRef.current);
                                if (fpActive) {
                                    fpLookRef.current.yaw = wp.fpYaw;
                                    applyFP();
                                }
                            }}>
                                <div className="wi-num">{i + 1}</div>
                                <div className="wi-body">
                                    <div className="wi-name">{wp.room}</div>
                                    <div className="wi-meta">{i === 0 ? 'Start point' : 'Highlight zone'}</div>
                                </div>
                                <div className="wi-action">→</div>
                            </div>
                        ))}
                    </div>

                    <div className="lp-sep"></div>

                    <div className="lp-section">
                        <div className="lp-section-title">Session settings</div>
                        <div className="setting-row">
                            <span className="sr-label">Locomotion</span>
                            <span className="sr-val" onClick={() => setLocomotion(locomotion === 'Teleport' ? 'Smooth' : 'Teleport')}>{locomotion}</span>
                        </div>
                        <div className="setting-row">
                            <span className="sr-label">Scale</span>
                            <span className="sr-val" onClick={() => setScale(scale === '1:1 (real)' ? '1:50' : '1:1 (real)')}>{scale}</span>
                        </div>
                    </div>

                    <div className="lp-footer">
                        <div style={{ fontSize: '11px', color: 'var(--ink-3)', textAlign: 'center' }}>Click the floor to place spawn points</div>
                        <button className="btn btn-secondary" style={{ justifyContent: 'center' }} onClick={() => setMode('fp')}>👁 Preview first-person</button>
                    </div>
                </div>

                <div className="sp-main-area">
                    <div className="view-tabs">
                        <div className={`vt ${viewMode === 'overview' ? 'active' : ''}`} onClick={() => setMode('overview')}>Overview</div>
                        <div className={`vt ${viewMode === 'top' ? 'active' : ''}`} onClick={() => setMode('top')}>Floor plan</div>
                        <div className={`vt ${viewMode === 'fp' ? 'active' : ''}`} onClick={() => setMode('fp')}>First-person</div>
                    </div>

                    <canvas
                        ref={canvasRef}
                        className="sp-canvas"
                        onMouseDown={handleMainMouseDown}
                        onMouseMove={handleMainMouseMove}
                        onMouseUp={() => { isDraggingRef.current = false; }}
                        onMouseLeave={() => { isDraggingRef.current = false; setCursorPos(p => ({ ...p, visible: false })); }}
                        onClick={handleMainClick}
                        onWheel={(e) => {
                            e.preventDefault();
                            orbRef.current.radius = Math.max(3, Math.min(35, orbRef.current.radius + e.deltaY * 0.02));
                            if (mainCameraRef.current) applyOrbit(mainCameraRef.current);
                        }}
                    />

                    {cursorPos.visible && (
                        <div className="spawn-cursor" style={{ left: cursorPos.x, top: cursorPos.y }}>
                            <div className="sc-outer"><div className="sc-inner"></div></div>
                        </div>
                    )}

                    {Object.entries(markerPositions).map(([id, pos]) => (
                        <div key={id} className="spawn-marker" style={{ left: pos.x, top: pos.y }}>
                            <div className="sm-bubble" style={{ background: participants[id].color }}>🥽 {participants[id].initials}</div>
                            <div className="sm-arrow" style={{ borderTopColor: participants[id].color }}></div>
                        </div>
                    ))}

                    <div className="sp-tip-bar">
                        {Object.values(participants).every(p => p.placed) ? '✓ All spawn points set — ready to launch' : `Click the floor to place ${participants[activeParticipantId].name}'s spawn point`}
                    </div>

                    <div className="sp-float-top-right">
                        <div className="sp-fc-btn" onClick={() => { orbRef.current = { theta: 0.7, phi: 0.9, radius: 18, tx: 0, ty: 1, tz: 0 }; if (mainCameraRef.current) applyOrbit(mainCameraRef.current); }}>⊙</div>
                        <div className="sp-fc-btn" onClick={() => { orbRef.current.radius = Math.max(3, orbRef.current.radius - 2); if (mainCameraRef.current) applyOrbit(mainCameraRef.current); }}>+</div>
                        <div className="sp-fc-btn" onClick={() => { orbRef.current.radius = Math.min(35, orbRef.current.radius + 2); if (mainCameraRef.current) applyOrbit(mainCameraRef.current); }}>−</div>
                    </div>

                    <div className="sp-statusbar">
                        <span>Model</span><span className="sp-sb-val">v4.2</span>
                        <div className="sp-sb-sep"></div>
                        <span>Spawns</span><span className="sp-sb-val">{Object.values(participants).filter(p => p.placed).length}/3</span>
                        <div className="sp-sb-sep"></div>
                        <span className="sp-sb-val">{fps} fps</span>
                    </div>

                    {fpActive && (
                        <div className="fp-overlay active">
                            <div className="fp-canvas-wrap">
                                <canvas
                                    ref={fpCanvasRef}
                                    className="fp-canvas"
                                    onMouseDown={(e) => { isDraggingRef.current = true; lastMouseRef.current = { x: e.clientX, y: e.clientY }; }}
                                    onMouseMove={handleFpMouseMove}
                                    onMouseUp={() => { isDraggingRef.current = false; }}
                                />
                                <div className="fp-crosshair"></div>
                                <div className="fp-hud-top">
                                    <div className="fp-room-label">
                                        <div className="fp-room-dot"></div>
                                        <span>{waypointsData[currentWP].room}</span>
                                    </div>
                                    <div className="fp-close" onClick={() => { setFpActive(false); setViewMode('overview'); }}>✕ Exit preview</div>
                                </div>
                                <div className="fp-nav">
                                    <div className="fn-btn active">🚶 Walk</div>
                                    <div className="fn-sep"></div>
                                    <div className={`fn-btn ${fpWireframe ? 'active' : ''}`} onClick={() => {
                                        const next = !fpWireframe; setFpWireframe(next);
                                        fpSceneRef.current?.traverse(o => { if ((o as any).isMesh && (o as any).material) (o as any).material.wireframe = next; });
                                    }}>⬡ Wireframe</div>
                                    <div className="fn-sep"></div>
                                    <div className="fn-btn" onClick={() => { setFpActive(false); setViewMode('overview'); }}>← Overview</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SessionPreviewPage;
