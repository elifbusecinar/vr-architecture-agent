import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './ThreeDViewer.css';
import { projectService } from '@/services/projects/project.service';
import { annotationService } from '@/services/annotations/annotation.service';
import { useCollaboration, updatePresence, syncView, sendUserMove, sendVoiceSignal, summonParticipants, highlightObject, sendLaser } from '@/hooks/useCollaboration';
import { useAuth } from '@/context/AuthContext';
import type { ProjectDetail, ProjectWaypoint } from '@/types/project.types';
import type { Annotation } from '@/types/annotation.types';
import HeatmapStats from '@/components/analytics/HeatmapStats';
import { bimService } from '@/services/bim/bim.service';
import { aiService } from '@/services/ai/ai.service';
import { analyticsService } from '@/services/analytics/analytics.service';
import { webrtcService } from '@/services/realtime/webrtc.service';

const SYNC_THROTTLE_MS = 50; // Max 20 updates per second

interface ThreeDViewerProps {
    modelUrl?: string;
    compareModelUrl?: string;
    projectId?: string;
    onClose?: () => void;
    onObjectSelection?: (data: any) => void;
    triggerAnnotationPos?: { x: number; y: number; z: number } | null;
    onAnnotationModalClosed?: () => void;
}

const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ modelUrl, compareModelUrl, projectId, onObjectSelection, triggerAnnotationPos, onAnnotationModalClosed }) => {
    const { user } = useAuth();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
    const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
    const gridRef = useRef<THREE.GridHelper | null>(null);
    const objectsRef = useRef<THREE.Mesh[]>([]);
    const sectionPlaneMeshRef = useRef<THREE.Mesh | null>(null);
    const pinsRef = useRef<{ id: string, mesh: THREE.Mesh, ring: THREE.Mesh, ringMat: THREE.MeshBasicMaterial }[]>([]);
    const measureLineRef = useRef<THREE.Line | null>(null);
    const measurePointsMeshesRef = useRef<THREE.Mesh[]>([]);

    const [currentTool, setCurrentTool] = useState('orbit');
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [panelTab, setPanelTab] = useState('props');
    const [critiqueResult, setCritiqueResult] = useState<any>(null);
    const [isCritiquing, setIsCritiquing] = useState(false);
    const [ambientIntensity, setAmbientIntensity] = useState(65);
    const [sunIntensity, setSunIntensity] = useState(80);
    const [exposure, setExposure] = useState(1);
    const [sectionHeight, setSectionHeight] = useState(2.4);
    const [sectionEnabled, setSectionEnabled] = useState(false);
    const [wireframeOn, setWireframeOn] = useState(false);
    const [xrayOn, setXrayOn] = useState(false);
    const [zoomPct, setZoomPct] = useState(100);
    const [fps, setFps] = useState(60);
    const [bgColor, setBgColor] = useState('#0D0C0B');
    const compareGroupRef = useRef<THREE.Group | null>(null);

    const [pinPositions, setPinPositions] = useState<{ id: string, x: number, y: number, visible: boolean }[]>([]);
    const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>(null);
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [isPresenter, setIsPresenter] = useState(false);
    const [isFollowingPresenter, setIsFollowingPresenter] = useState(false);
    const [currentPresenterId, setCurrentPresenterId] = useState<string | null>(null);
    const [measurePoints, setMeasurePoints] = useState<THREE.Vector3[]>([]);
    const [modelMaterials, setModelMaterials] = useState<{ name: string, color: string, material: THREE.MeshStandardMaterial }[]>([]);
    const [modelError, setModelError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [selectedBimData, setSelectedBimData] = useState<{ name: string, category: string, material: string, area: string, volume: string } | null>(null);

    const [heatmapEnabled, setHeatmapEnabled] = useState(false);
    const [voiceConnected, setVoiceConnected] = useState(false);
    const [micMuted, setMicMuted] = useState(false);

    const remoteAvatarsRef = useRef<Map<string, THREE.Group>>(new Map());
    const heatmapGroupRef = useRef<THREE.Group | null>(null);
    const [followingUserId, setFollowingUserId] = useState<string | null>(null);
    const [modelLayers, setModelLayers] = useState<{ name: string, visible: boolean }[]>([]);
    const [annotateModalPos, setAnnotateModalPos] = useState<{ x: number; y: number; z: number } | null>(null);
    const [annotateText, setAnnotateText] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [laserActive, setLaserActive] = useState(false);
    const [highlightedObjId, setHighlightedObjId] = useState<string | null>(null);
    const [summonToast, setSummonToast] = useState<string | null>(null);


    // Camera state (orbit)
    const sphericalRef = useRef({ theta: 0.7, phi: 1.0, radius: 20 });
    const targetRef = useRef(new THREE.Vector3(0, 1, 0));
    const isDraggingRef = useRef(false);
    const lastMouseRef = useRef({ x: 0, y: 0 });
    const lastSyncTimeRef = useRef(0);
    const isStudio = user?.role !== 'Client' && user?.role !== 'Viewer';

    const fetchData = useCallback(async () => {
        if (!projectId) return;

        try {
            const [detail, annots] = await Promise.all([
                projectService.getDetail(projectId),
                annotationService.getProjectAnnotations(projectId)
            ]);
            setProjectDetail(detail);
            setAnnotations(annots);
        } catch (error) {
            console.error('Failed to fetch project detail:', error);
        } finally {

        }
    }, [projectId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // POINT 2: Heatmap Visualizer (Gaze Analytics Implementation)
    useEffect(() => {
        if (!projectId || !heatmapEnabled || !sceneRef.current) {
            if (heatmapGroupRef.current) {
                sceneRef.current?.remove(heatmapGroupRef.current);
                heatmapGroupRef.current = null;
            }
            return;
        }

        const loadHeatmap = async () => {
            try {
                const points = await analyticsService.getProcessedHeatmap(projectId, 0.5);
                if (!points || points.length === 0) return;

                const group = new THREE.Group();
                points.forEach(p => {
                    const geometry = new THREE.BoxGeometry(0.5, 0.1, 0.5);
                    // Color intensity mapping (Cold to Hot)
                    const color = new THREE.Color();
                    color.setHSL(0.7 * (1 - p.intensity), 1, 0.5);
                    const material = new THREE.MeshBasicMaterial({
                        color,
                        transparent: true,
                        opacity: 0.4 + (p.intensity * 0.4)
                    });
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(p.x, p.avgY + 0.05, p.z);
                    group.add(mesh);
                });

                if (heatmapGroupRef.current) sceneRef.current?.remove(heatmapGroupRef.current);
                heatmapGroupRef.current = group;
                sceneRef.current?.add(group);
            } catch (err) {
                console.error("Heatmap load failed:", err);
            }
        };

        loadHeatmap();

        return () => {
            if (heatmapGroupRef.current) {
                sceneRef.current?.remove(heatmapGroupRef.current);
                heatmapGroupRef.current = null;
            }
        };
    }, [projectId, heatmapEnabled]);

    useEffect(() => {
        if (triggerAnnotationPos) {
            setAnnotateModalPos(triggerAnnotationPos);
            setAnnotateText('');
        }
    }, [triggerAnnotationPos]);

    useEffect(() => {
        if (!sceneRef.current) return;

        // Cleanup previous measurement visuals
        if (measureLineRef.current) {
            sceneRef.current.remove(measureLineRef.current);
            measureLineRef.current.geometry.dispose();
            (measureLineRef.current.material as THREE.Material).dispose();
            measureLineRef.current = null;
        }
        measurePointsMeshesRef.current.forEach(m => {
            sceneRef.current?.remove(m);
            m.geometry.dispose();
            (m.material as THREE.Material).dispose();
        });
        measurePointsMeshesRef.current = [];

        if (measurePoints.length === 0) return;

        // Create points
        const sphereGeo = new THREE.SphereGeometry(0.1, 16, 16);
        const sphereMat = new THREE.MeshBasicMaterial({ color: 0x2D5BE3 });

        measurePoints.forEach(p => {
            const mesh = new THREE.Mesh(sphereGeo, sphereMat);
            mesh.position.copy(p);
            sceneRef.current?.add(mesh);
            measurePointsMeshesRef.current.push(mesh);
        });

        // Create line if two points
        if (measurePoints.length === 2) {
            const lineGeo = new THREE.BufferGeometry().setFromPoints(measurePoints);
            const lineMat = new THREE.LineBasicMaterial({ color: 0x2D5BE3 });
            const line = new THREE.Line(lineGeo, lineMat);
            sceneRef.current.add(line);
            measureLineRef.current = line;
        }
    }, [measurePoints]);

    const handleRemoteAnnotation = useCallback((newAnn: Annotation) => {
        setAnnotations(prev => {
            if (prev.find(a => a.id === newAnn.id)) return prev;
            return [...prev, newAnn];
        });
    }, []);

    const handleRemoteDelete = useCallback((id: string) => {
        setAnnotations(prev => prev.filter(a => a.id !== id));
    }, []);

    const handleUserJoined = (connId: string, name: string) => {
        console.log(`User joined: ${name} (${connId})`);
    };

    const handleUserLeft = (connId: string) => {
        console.log(`User left: ${connId}`);
    };

    const updateCamera = useCallback(() => {
        if (!cameraRef.current) return;
        const s = sphericalRef.current;
        const sin_phi = Math.sin(s.phi);
        cameraRef.current.position.set(
            targetRef.current.x + s.radius * sin_phi * Math.sin(s.theta),
            targetRef.current.y + s.radius * Math.cos(s.phi),
            targetRef.current.z + s.radius * sin_phi * Math.cos(s.theta)
        );
        cameraRef.current.lookAt(targetRef.current);

        const pct = Math.round((20 / s.radius) * 100);
        setZoomPct(pct);

        if (projectId) {
            const now = Date.now();
            if (now - lastSyncTimeRef.current > SYNC_THROTTLE_MS) {
                if (isPresenter) {
                    syncView(projectId, {
                        theta: s.theta,
                        phi: s.phi,
                        radius: s.radius,
                        target: { x: targetRef.current.x, y: targetRef.current.y, z: targetRef.current.z }
                    });
                }

                sendUserMove(projectId,
                    { x: cameraRef.current.position.x, y: cameraRef.current.position.y, z: cameraRef.current.position.z },
                    { x: cameraRef.current.quaternion.x, y: cameraRef.current.quaternion.y, z: cameraRef.current.quaternion.z, w: cameraRef.current.quaternion.w }
                );

                lastSyncTimeRef.current = now;
            }
        }
    }, [isPresenter, projectId]);

    const handleViewSynced = useCallback((viewData: any) => {
        if (!isFollowingPresenter) return;

        sphericalRef.current = {
            theta: viewData.theta,
            phi: viewData.phi,
            radius: viewData.radius
        };
        targetRef.current.set(viewData.target.x, viewData.target.y, viewData.target.z);
        updateCamera();
    }, [isFollowingPresenter, updateCamera]);

    const handlePresenterChanged = useCallback((user: any) => {
        setCurrentPresenterId(user.connectionId);
        // Maybe auto-follow if it's a VR user and we want to "Join" their session
    }, []);

    const handlePresenterRemoved = useCallback((id: string) => {
        if (currentPresenterId === id) {
            setCurrentPresenterId(null);
            setIsFollowingPresenter(false);
        }
    }, [currentPresenterId]);

    const handleRemoteUserMoved = useCallback((connectionId: string, position: any, rotation: any) => {
        if (!sceneRef.current) return;

        let avatarGroup = remoteAvatarsRef.current.get(connectionId);
        if (!avatarGroup) {
            avatarGroup = new THREE.Group();
            const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), new THREE.MeshStandardMaterial({ color: 0x2D5BE3, roughness: 0.3 }));
            avatarGroup.add(headMesh);

            const laserMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 10), new THREE.MeshBasicMaterial({ color: 0xFF5722, transparent: true, opacity: 0.6 }));
            laserMesh.position.z = -5;
            laserMesh.rotation.x = Math.PI / 2;
            avatarGroup.add(laserMesh);

            sceneRef.current.add(avatarGroup);
            remoteAvatarsRef.current.set(connectionId, avatarGroup);
        }

        avatarGroup.position.set(position.x, position.y, position.z);
        if (rotation?.w !== undefined) avatarGroup.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);

        // POINT 3: Follow logic
        if (followingUserId === connectionId && cameraRef.current) {
            cameraRef.current.position.set(position.x, position.y, position.z);
            cameraRef.current.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
            // We might want to offset the camera slightly behind if it's a 3rd person follow
        }
    }, [followingUserId]);

    const { activeUsers } = useCollaboration(projectId, {
        onAnnotationCreated: handleRemoteAnnotation,
        onAnnotationDeleted: handleRemoteDelete,
        onUserJoined: handleUserJoined,
        onUserLeft: (connId) => {
            handleUserLeft(connId);
            const avatar = remoteAvatarsRef.current.get(connId);
            if (avatar && sceneRef.current) {
                sceneRef.current.remove(avatar);
                remoteAvatarsRef.current.delete(connId);
            }
            webrtcService.removePeer(connId);
        },
        onViewSynced: handleViewSynced,
        onPresenterChanged: handlePresenterChanged,
        onPresenterRemoved: handlePresenterRemoved,
        onUserMoved: handleRemoteUserMoved,
        onVoiceSignal: (connId, signal) => {
            if (signal.type === 'join' && voiceConnected && projectId) {
                // If another user joins voice chat, initiate a WebRTC connection
                webrtcService.initiateCall(projectId, connId);
            }
        },
        onSignal: (senderId, signalData) => {
            if (projectId) webrtcService.handleSignalingData(projectId, senderId, signalData);
        }
    });

    useEffect(() => {
        if (!projectId) return;

        // Broadcast initial presence
        updatePresence(projectId, { status: 'viewing', timestamp: Date.now() });

        // Periodically update presence if needed (heartbeat)
        const interval = setInterval(() => {
            updatePresence(projectId, { status: 'viewing', timestamp: Date.now() });
        }, 30000);

        return () => clearInterval(interval);
    }, [projectId]);

    const resetView = () => {
        sphericalRef.current = { theta: 0.7, phi: 1.0, radius: 20 };
        targetRef.current.set(0, 1, 0);
        updateCamera();
    };

    const setView = (type: 'top' | 'front') => {
        if (type === 'top') {
            sphericalRef.current = { theta: 0, phi: 0.01, radius: 20 };
        } else if (type === 'front') {
            sphericalRef.current = { theta: 0, phi: Math.PI / 2, radius: 20 };
        }
        updateCamera();
    };

    const flyToWaypoint = (wp: ProjectWaypoint) => {
        sphericalRef.current = { theta: wp.yaw, phi: wp.pitch, radius: 8 };
        targetRef.current.set(wp.positionX, wp.positionY, wp.positionZ);
        updateCamera();
    };

    const flyToAnnotation = (ann: Annotation) => {
        sphericalRef.current = { theta: -0.5, phi: 1.0, radius: 6 };
        targetRef.current.set(ann.positionX, ann.positionY, ann.positionZ);
        updateCamera();
    };

    // Scene & Renderer Persistence
    useEffect(() => {
        if (!canvasRef.current) return;
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = exposure;
        rendererRef.current = renderer;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(45, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.01, 500);
        cameraRef.current = camera;

        // Static Lights
        const ambient = new THREE.AmbientLight(0xfaf6f0, ambientIntensity / 100);
        scene.add(ambient);
        ambientLightRef.current = ambient;

        const sun = new THREE.DirectionalLight(0xfff5e0, sunIntensity / 100);
        sun.position.set(15, 20, 10);
        sun.castShadow = true;
        sun.shadow.mapSize.set(2048, 2048);
        scene.add(sun);
        sunLightRef.current = sun;

        const fill = new THREE.DirectionalLight(0xd0e8ff, 0.25);
        fill.position.set(-8, 5, -10);
        scene.add(fill);

        const gridHelper = new THREE.GridHelper(30, 30, 0x333333, 0x222222);
        scene.add(gridHelper);
        gridRef.current = gridHelper;

        // Section Plane
        const sectionPlaneMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(14, 12),
            new THREE.MeshBasicMaterial({ color: 0x2D5BE3, transparent: true, opacity: 0.08, side: THREE.DoubleSide })
        );
        sectionPlaneMesh.rotation.x = Math.PI / 2;
        sectionPlaneMesh.position.y = sectionHeight;
        sectionPlaneMesh.visible = sectionEnabled;
        scene.add(sectionPlaneMesh);
        sectionPlaneMeshRef.current = sectionPlaneMesh;

        // Animation Loop
        let lastTime = 0;
        let fpsCount = 0;
        let fpsTime = 0;

        const animate = (time: number) => {
            const dt = time - lastTime;
            lastTime = time;
            fpsCount++;
            fpsTime += dt;
            if (fpsTime > 1000) {
                setFps(Math.round(fpsCount * 1000 / fpsTime));
                fpsCount = 0;
                fpsTime = 0;
            }

            const t = time * 0.001;
            pinsRef.current.forEach((p) => {
                const scale = 1 + 0.3 * Math.sin(t * 2 + p.id.length);
                p.ring.scale.setScalar(scale);
                p.ringMat.opacity = 0.3 + 0.3 * Math.sin(t * 2 + p.id.length + Math.PI);
            });

            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect && cameraRef.current && pinsRef.current.length > 0) {
                const newPinPos = pinsRef.current.map((p) => {
                    const v = p.mesh.position.clone().project(cameraRef.current!);
                    return {
                        id: p.id,
                        x: (v.x + 1) / 2 * rect.width,
                        y: -(v.y - 1) / 2 * rect.height,
                        visible: v.z < 1
                    };
                });
                setPinPositions(newPinPos);
            }

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        const frameId = requestAnimationFrame(animate);

        const handleResize = () => {
            if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return;
            const w = canvasRef.current.clientWidth;
            const h = canvasRef.current.clientHeight;
            rendererRef.current.setSize(w, h, false);
            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        if (!sceneRef.current) return;
        const scene = sceneRef.current;
        const loader = new GLTFLoader();
        let loadedModel: THREE.Group | null = null;
        setModelError(null);

        const makeMat = (color: number, roughness = 0.6, metalness = 0.0, opacity = 1) => {
            return new THREE.MeshStandardMaterial({
                color, roughness, metalness,
                transparent: opacity < 1, opacity,
                side: THREE.DoubleSide
            });
        };

        if (modelUrl && modelUrl !== '#') {
            loader.load(modelUrl, (gltf) => {
                loadedModel = gltf.scene;
                scene.add(loadedModel);

                const objects: THREE.Mesh[] = [];
                loadedModel.traverse((o) => {
                    if ((o as THREE.Mesh).isMesh) {
                        const m = o as THREE.Mesh;
                        m.castShadow = true;
                        m.receiveShadow = true;
                        objects.push(m);

                        if (m.material) {
                            const mats = Array.isArray(m.material) ? m.material : [m.material];
                            mats.forEach(mat => {
                                if (mat.name && (mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                                    setModelMaterials(prev => {
                                        if (prev.find(p => p.name === mat.name)) return prev;
                                        return [...prev, {
                                            name: mat.name,
                                            color: '#' + (mat as THREE.MeshStandardMaterial).color.getHexString(),
                                            material: mat as THREE.MeshStandardMaterial
                                        }];
                                    });
                                }
                            });
                        }
                    }
                });
                objectsRef.current = objects;

                // Initialize layers for Point 4
                const uniqueLayers = Array.from(new Set(objects.map(o => o.name.split('_')[0] || 'Generic')));
                setModelLayers(uniqueLayers.map(l => ({ name: l, visible: true })));

                updateCamera();
            }, undefined, (error) => {
                console.error("Failed to load model:", error);
                setModelError("Failed to load the 3D model. Please verify your connection or try again.");
            });
        } else if (modelUrl) {
            // Procedural fallback (e.g. for default scene)
            const group = new THREE.Group();
            loadedModel = group;
            scene.add(group);
            const objects: THREE.Mesh[] = [];

            const floor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.12, 9), makeMat(0xE8E4DE, 0.9));
            floor.position.set(0, -0.06, 0);
            floor.receiveShadow = true;
            group.add(floor);
            objects.push(floor);

            const ceil = new THREE.Mesh(new THREE.BoxGeometry(12, 0.1, 9), makeMat(0xF5F3EF, 0.95));
            ceil.position.set(0, 2.9, 0);
            group.add(ceil);
            objects.push(ceil);

            objectsRef.current = objects;
            updateCamera();
        }

        return () => {
            if (loadedModel) {
                scene.remove(loadedModel);
                loadedModel.traverse((o: any) => {
                    if (o.isMesh) {
                        o.geometry.dispose();
                        if (Array.isArray(o.material)) o.material.forEach((m: any) => m.dispose());
                        else o.material.dispose();
                    }
                });
            }
        };
    }, [modelUrl, updateCamera, retryCount]);

    // POINT 1: Comparison Model Loader (Model Diff Implementation)
    useEffect(() => {
        if (!compareModelUrl || !sceneRef.current) {
            if (compareGroupRef.current) {
                sceneRef.current?.remove(compareGroupRef.current);
                compareGroupRef.current = null;
            }
            return;
        }

        const scene = sceneRef.current;
        const loader = new GLTFLoader();
        let loadedComp: THREE.Group | null = null;

        loader.load(compareModelUrl, (gltf) => {
            const group = gltf.scene;
            // Apply a "Ghost" style to the old version
            group.traverse((o: any) => {
                if (o.isMesh) {
                    o.material = new THREE.MeshStandardMaterial({
                        color: 0x888888,
                        transparent: true,
                        opacity: 0.4,
                        wireframe: false
                    });
                }
            });

            if (compareGroupRef.current) scene.remove(compareGroupRef.current);
            compareGroupRef.current = group;
            scene.add(group);
            loadedComp = group;
        });

        return () => {
            if (loadedComp) {
                scene.remove(loadedComp);
                loadedComp.traverse((o: any) => {
                    if (o.isMesh) {
                        o.geometry.dispose();
                        o.material.dispose();
                    }
                });
            }
        };
    }, [compareModelUrl]);

    // Pins Management logic
    useEffect(() => {
        if (!sceneRef.current) return;
        const scene = sceneRef.current;

        // Cleanup old pins
        pinsRef.current.forEach(p => {
            scene.remove(p.mesh);
            scene.remove(p.ring);
            p.mesh.geometry.dispose();
            p.ring.geometry.dispose();
            p.ringMat.dispose();
        });
        pinsRef.current = [];

        // Create new pins
        const pinGeo = new THREE.SphereGeometry(0.08, 16, 16);
        const ringGeo = new THREE.RingGeometry(0.1, 0.14, 32);

        annotations.forEach(ann => {
            const pos = new THREE.Vector3(ann.positionX, ann.positionY, ann.positionZ);
            const color = 0x4F8EF7;
            const mesh = new THREE.Mesh(pinGeo, new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.4 }));
            mesh.position.copy(pos);
            scene.add(mesh);

            const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = -Math.PI / 2;
            ring.position.copy(pos);
            scene.add(ring);

            pinsRef.current.push({ id: ann.id, mesh, ring, ringMat });
        });
    }, [annotations]);

    // Section Clipping updates
    useEffect(() => {
        if (!sceneRef.current || !rendererRef.current) return;

        const next = sectionEnabled;
        if (sectionPlaneMeshRef.current) {
            sectionPlaneMeshRef.current.visible = next;
            sectionPlaneMeshRef.current.position.y = sectionHeight;
        }
        rendererRef.current.localClippingEnabled = next;

        const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), sectionHeight);
        objectsRef.current.forEach(o => {
            if (o.material) {
                const materials = Array.isArray(o.material) ? o.material : [o.material];
                materials.forEach(m => {
                    m.clippingPlanes = next ? [plane] : [];
                });
            }
        });
    }, [sectionEnabled, sectionHeight]);

    // Display Property Updates
    useEffect(() => {
        if (sceneRef.current) {
            sceneRef.current.background = new THREE.Color(bgColor);
            sceneRef.current.fog = new THREE.FogExp2(bgColor, 0.018);
        }
    }, [bgColor]);

    // Input handlers
    const onMouseDown = (e: React.MouseEvent) => {
        if (currentTool === 'measure' || currentTool === 'annotate' || currentTool === 'bim') {
            handleCanvasClick(e);
            return;
        }
        isDraggingRef.current = true;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleCanvasClick = async (e: React.MouseEvent) => {
        if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

        const intersects = raycaster.intersectObjects(objectsRef.current);
        if (intersects.length > 0) {
            const point = intersects[0].point;
            const object = intersects[0].object as THREE.Mesh;

            if (currentTool === 'measure') {
                setMeasurePoints(prev => {
                    const next = [...prev, point];
                    if (next.length > 2) return [point];
                    return next;
                });
            } else if (currentTool === 'annotate') {
                setAnnotateModalPos({ x: point.x, y: point.y, z: point.z });
                setAnnotateText('');
            } else if (currentTool === 'bim') {
                // Try real BIM data from backend first
                if (projectId) {
                    const realBim = await bimService.getMetadata(object.name || object.uuid, projectId);
                    if (realBim) {
                        const bim = {
                            name: realBim.name || realBim.externalId,
                            category: realBim.category,
                            material: realBim.material,
                            building: realBim.buildingName,
                            floor: realBim.floorName,
                            room: realBim.roomName,
                            area: realBim.area?.toFixed(2),
                            volume: realBim.volume?.toFixed(2),
                            point: { x: point.x, y: point.y, z: point.z }
                        };
                        setSelectedBimData(bim);
                        onObjectSelection?.(bim);
                        return;
                    }
                }
                // Fallback to calculated data
                const matName = object.material ? (Array.isArray(object.material) ? object.material[0].name : (object.material as any).name) : 'Generic Material';
                const bbox = new THREE.Box3().setFromObject(object);
                const size = bbox.getSize(new THREE.Vector3());
                const area = (size.x * size.z).toFixed(2);
                const volume = (size.x * size.y * size.z).toFixed(2);

                const bim = {
                    name: object.name || 'Structural Element',
                    category: object.name.includes('Wall') ? 'Wall' : object.name.includes('Floor') ? 'Floor' : 'Generic',
                    material: matName || 'Concrete',
                    area: area,
                    volume: volume,
                    point: { x: point.x, y: point.y, z: point.z }
                };
                setSelectedBimData(bim);
                onObjectSelection?.(bim);
            }
        } else if (currentTool === 'bim') {
            setSelectedBimData(null);
            onObjectSelection?.(null);
        }
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingRef.current) return;
        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };

        if (currentTool === 'orbit') {
            sphericalRef.current.theta -= dx * 0.006;
            sphericalRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, sphericalRef.current.phi + dy * 0.006));
        } else if (currentTool === 'pan') {
            const right = new THREE.Vector3();
            const up = new THREE.Vector3();
            const camDir = new THREE.Vector3();
            cameraRef.current?.getWorldDirection(camDir);
            right.crossVectors(camDir, cameraRef.current!.up).normalize();
            up.copy(cameraRef.current!.up);
            targetRef.current.addScaledVector(right, -dx * 0.02);
            targetRef.current.addScaledVector(up, dy * 0.02);
        }
        updateCamera();
    };

    const onMouseUp = () => {
        isDraggingRef.current = false;
    };

    const onWheel = (e: React.WheelEvent) => {
        sphericalRef.current.radius = Math.max(2, Math.min(50, sphericalRef.current.radius + e.deltaY * 0.02));
        updateCamera();
    };

    useEffect(() => {
        if (ambientLightRef.current) ambientLightRef.current.intensity = ambientIntensity / 100;
    }, [ambientIntensity]);

    useEffect(() => {
        if (sunLightRef.current) sunLightRef.current.intensity = sunIntensity / 100;
    }, [sunIntensity]);

    useEffect(() => {
        if (rendererRef.current) rendererRef.current.toneMappingExposure = exposure;
    }, [exposure]);

    const toggleWireframe = () => {
        const next = !wireframeOn;
        setWireframeOn(next);
        objectsRef.current.forEach(o => {
            if (o.material && 'wireframe' in o.material) {
                (o.material as any).wireframe = next;
            }
        });
    };

    const toggleXray = () => {
        const next = !xrayOn;
        setXrayOn(next);
        objectsRef.current.forEach(o => {
            if (o.material) {
                const materials = Array.isArray(o.material) ? o.material : [o.material];
                materials.forEach(m => {
                    m.transparent = next;
                    m.opacity = next ? 0.35 : 1;
                });
            }
        });
    };

    const toggleSection = () => {
        setSectionEnabled(!sectionEnabled);
    };

    const toggleHeatmap = async () => {
        const next = !heatmapEnabled;
        setHeatmapEnabled(next);
        if (!sceneRef.current || !projectId) return;

        if (!heatmapGroupRef.current) {
            heatmapGroupRef.current = new THREE.Group();
            sceneRef.current.add(heatmapGroupRef.current);

            try {
                // Fetch processed (grid-normalized) heatmap instead of raw points
                const response = await fetch(`/api/analytics/${projectId}/processed-heatmap?gridSize=0.8`);
                const cells = await response.json();

                cells.forEach((cell: { x: number, z: number, avgY: number, intensity: number }) => {
                    const dotMat = new THREE.MeshBasicMaterial({
                        transparent: true,
                        opacity: Math.max(0.15, cell.intensity * 0.6),
                        blending: THREE.AdditiveBlending,
                        depthWrite: false,
                        side: THREE.DoubleSide
                    });
                    // Intensity-based color: 0.0 = blue/cool, 0.5 = yellow, 1.0 = red/hot
                    const hue = (1.0 - cell.intensity) * 0.33; // Maps: 1.0→red(0), 0.5→yellow(0.16), 0→green(0.33)
                    dotMat.color.setHSL(hue, 1.0, 0.5);

                    const size = 0.5 + cell.intensity * 0.5; // Hotter = bigger
                    const point = new THREE.Mesh(new THREE.PlaneGeometry(size, size), dotMat);
                    point.position.set(cell.x, (cell.avgY || 0) + 0.05, cell.z);
                    point.rotation.x = -Math.PI / 2;
                    heatmapGroupRef.current?.add(point);
                });
            } catch (err) {
                console.error("Failed to load heatmap:", err);
            }
        }
        heatmapGroupRef.current.visible = next;
    };

    const toggleVoiceChat = async () => {
        if (!voiceConnected) {
            try {
                await webrtcService.startLocalAudio();
                setVoiceConnected(true);
                setMicMuted(false);
                webrtcService.setMuted(false);
                if (projectId) {
                    sendVoiceSignal(projectId, "all", { type: "join" });
                    // WebRTC signals speak-start/speak-end to show animation
                    sendVoiceSignal(projectId, "all", { type: "speak-start" });
                }
            } catch (err) {
                console.error("Microphone access denied", err);
                alert("Please allow microphone access to join voice chat.");
            }
        } else {
            webrtcService.stopLocalAudio();
            setVoiceConnected(false);
            if (projectId) {
                sendVoiceSignal(projectId, "all", { type: "leave" });
                sendVoiceSignal(projectId, "all", { type: "speak-end" });
            }
        }
    };

    return (
        <div className="viewer-body">
            {modelError && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(13, 12, 11, 0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000, color: '#F5F3EF', borderRadius: '12px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚠️</div>
                    <div style={{ marginBottom: '24px', textAlign: 'center', maxWidth: '300px', lineHeight: 1.5, fontSize: '14px', color: 'var(--ink-2)' }}>{modelError}</div>
                    <button className="btn btn-primary" onClick={() => setRetryCount(c => c + 1)}>Try Again</button>
                </div>
            )}
            <div className="left-toolbar">
                <div className={`tool-btn ${currentTool === 'orbit' ? 'active' : ''}`} onClick={() => setCurrentTool('orbit')}>⟳</div>
                <div className={`tool-btn ${currentTool === 'pan' ? 'active' : ''}`} onClick={() => setCurrentTool('pan')}>✥</div>
                <div className={`tool-btn ${currentTool === 'zoom' ? 'active' : ''}`} onClick={() => setCurrentTool('zoom')}>⊕</div>
                <div className="tool-sep"></div>
                <div className={`tool-btn ${currentTool === 'measure' ? 'active' : ''}`} onClick={() => setCurrentTool('measure')}>📐</div>
                <div className={`tool-btn ${currentTool === 'annotate' ? 'active' : ''}`} onClick={() => setCurrentTool('annotate')}>✎</div>
                <div className={`tool-btn ${currentTool === 'bim' ? 'active' : ''}`} title="Inspect BIM Data" onClick={() => setCurrentTool('bim')}>ℹ️</div>
                <div className="tool-sep"></div>
                {isStudio && (
                    <>
                        <div className={`tool-btn ${sectionEnabled ? 'active' : ''}`} onClick={toggleSection}>◫</div>
                        <div className={`tool-btn ${wireframeOn ? 'active' : ''}`} onClick={toggleWireframe}>⬡</div>
                        <div className={`tool-btn ${xrayOn ? 'active' : ''}`} onClick={toggleXray}>◌</div>
                        <div className={`tool-btn ${heatmapEnabled ? 'active' : ''}`} title="VR Focus Heatmap" style={{ color: heatmapEnabled ? '#FF3300' : '' }} onClick={toggleHeatmap}>🔥</div>
                    </>
                )}
                <div className="tool-sep"></div>
                <div className="tool-btn" onClick={resetView}>⊙</div>
                <div className="tool-btn" onClick={() => setView('top')}>⊤</div>
                <div className="tool-btn" onClick={() => setView('front')}>□</div>
                <div className="tool-sep"></div>
                <div className={`tool-btn ${isPresenter ? 'active' : ''}`} title="Become Presenter" onClick={() => { setIsPresenter(!isPresenter); setIsFollowingPresenter(false); }}>📢</div>
                <div className={`tool-btn ${isFollowingPresenter ? 'active' : ''}`} title="Follow Presenter" onClick={() => { setIsFollowingPresenter(!isFollowingPresenter); setIsPresenter(false); }}>👥</div>
                <div className="tool-sep"></div>
                <div className={`tool-btn ${voiceConnected ? 'active' : ''}`} title="Voice Chat" onClick={toggleVoiceChat}>
                    {voiceConnected ? (micMuted ? '🔇' : '🎙️') : '📞'}
                </div>
                {isStudio && (
                    <>
                        <div className="tool-sep"></div>
                        <div className={`tool-btn ${laserActive ? 'active' : ''}`} title="Laser Pointer"
                            style={{ color: laserActive ? '#FF5722' : '' }}
                            onClick={() => { setLaserActive(!laserActive); if (projectId) sendLaser(projectId, { active: !laserActive }); }}>
                            ✦
                        </div>
                        <div className="tool-btn" title="Summon All Here"
                            onClick={() => {
                                if (!cameraRef.current || !projectId) return;
                                const pos = targetRef.current;
                                summonParticipants(projectId, { x: pos.x, y: pos.y, z: pos.z }, 'Look here!');
                                setSummonToast('Summon sent!');
                                setTimeout(() => setSummonToast(null), 2000);
                            }}>
                            📍
                        </div>
                        <div className={`tool-btn ${highlightedObjId ? 'active' : ''}`} title="Toggle Highlight on selected"
                            onClick={() => {
                                if (!projectId || !selectedBimData) return;
                                const newState = !highlightedObjId;
                                const objName = selectedBimData.name;
                                setHighlightedObjId(newState ? objName : null);
                                highlightObject(projectId, objName, !!newState);
                            }}>
                            💡
                        </div>
                    </>
                )}
            </div>

            <div className="active-users-overlay">
                <div className="au-list">
                    <div className="au-badge you" title={`You (${user?.username})`}>
                        {user?.username?.substring(0, 1).toUpperCase() || 'U'}
                    </div>
                    {activeUsers.map(u => (
                        <div key={u.connectionId}
                            className={`au-badge ${followingUserId === u.connectionId ? 'active' : ''} ${u.isSpeaking ? 'speaking' : ''}`}
                            title={`${u.userName} ${u.isSpeaking ? '(Sıcak Mikrofon)' : ''} - Click to follow`}
                            onClick={() => setFollowingUserId(followingUserId === u.connectionId ? null : u.connectionId)}
                        >
                            {u.userName.substring(0, 1).toUpperCase()}
                            {followingUserId === u.connectionId && <div className="following-dot" />}
                            {u.isSpeaking && <div className="voice-pulse" />}
                        </div>
                    ))}
                    {activeUsers.length > 0 && (
                        <div className="au-count">+{activeUsers.length} extra</div>
                    )}
                </div>
                {isFollowingPresenter && (
                    <div className="following-tag">Following Presenter</div>
                )}
                {voiceConnected && (
                    <div className="following-tag" style={{ background: micMuted ? 'var(--bg-inset)' : 'var(--green)', color: micMuted ? 'var(--ink)' : 'white', cursor: 'pointer' }}
                        onClick={() => {
                            const nextState = !micMuted;
                            setMicMuted(nextState);
                            webrtcService.setMuted(nextState);
                            if (projectId) sendVoiceSignal(projectId, "all", { type: nextState ? "speak-end" : "speak-start" });
                        }}>
                        {micMuted ? 'Muted' : 'Voice Active 🔊'}
                    </div>
                )}
            </div>

            <canvas
                ref={canvasRef}
                className="three-canvas"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onWheel={onWheel}
            />

            {measurePoints.length === 2 && (
                <div className="measure-overlay">
                    Distance: {measurePoints[0].distanceTo(measurePoints[1]).toFixed(2)}m
                </div>
            )}

            {selectedBimData && (
                <div className="bim-overlay" style={{ position: 'absolute', right: isPanelOpen ? '280px' : '20px', top: '20px', background: 'var(--bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', width: '250px', zIndex: 10, transition: 'right 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, color: 'var(--ink)', fontSize: '14px' }}>BIM Data</h4>
                        <button onClick={() => setSelectedBimData(null)} style={{ background: 'transparent', border: 'none', color: 'var(--ink-3)', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                    </div>
                    <div className="prop-row"><div className="pr-label">Element</div><div className="pr-val" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>{selectedBimData.name}</div></div>
                    <div className="prop-row"><div className="pr-label">Category</div><div className="pr-val">{selectedBimData.category}</div></div>
                    <div className="prop-row"><div className="pr-label">Material</div><div className="pr-val" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>{selectedBimData.material}</div></div>
                    <div className="prop-row"><div className="pr-label">Area</div><div className="pr-val">{selectedBimData.area} m²</div></div>
                    <div className="prop-row"><div className="pr-label">Volume</div><div className="pr-val">{selectedBimData.volume} m³</div></div>
                </div>
            )}

            {pinPositions.map(p => {
                const annot = annotations.find(a => a.id === p.id);
                if (!annot || !p.visible) return null;
                return (
                    <div key={p.id} className="pin-label" style={{ left: p.x, top: p.y }}>
                        {annot.text} ✎
                    </div>
                );
            })}

            <div className="float-controls">
                <div className="fc-btn" onClick={() => { sphericalRef.current.radius = Math.max(2, sphericalRef.current.radius - 2); updateCamera(); }}>+</div>
                <div className="fc-btn" onClick={() => { sphericalRef.current.radius = Math.min(50, sphericalRef.current.radius + 2); updateCamera(); }}>−</div>
                <div className="fc-btn" onClick={resetView}>⊙</div>
            </div>

            <div className="statusbar">
                <div className="sb-item"><span>Zoom</span><span className="sb-val">{zoomPct}%</span></div>
                <div className="sb-sep"></div>
                <div className="sb-item"><span>Polys</span><span className="sb-val">{projectDetail ? '48,320' : '...'}</span></div>
                <div className="sb-sep"></div>
                <div className="sb-item"><span>Objects</span><span className="sb-val">{objectsRef.current.length}</span></div>
                <div className="sb-sep"></div>
                <div className="sb-item"><span>Mode</span><span className="sb-val">{currentTool.charAt(0).toUpperCase() + currentTool.slice(1)}</span></div>
                <div className="sb-sep"></div>
                <div className="sb-item"><span>FPS</span><span className="sb-val">{fps}</span></div>
                <div className="sb-sep"></div>
                <div className="sb-item">
                    <span>Active Users</span>
                    <span className="sb-val" style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
                        <div className="user-dot active" />
                        {activeUsers.length + 1}
                    </span>
                </div>
            </div>

            <div className="panel-toggle" onClick={() => setIsPanelOpen(!isPanelOpen)}>
                {isPanelOpen ? '›' : '‹'}
            </div>

            <div className={`right-panel ${isPanelOpen ? '' : 'collapsed'}`}>
                <div className="rp-header">
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>Inspector</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--ink-3)' }}>{projectDetail?.title || 'Loading...'}</div>
                </div>

                <div className="rp-tabs">
                    <div className={`rpt ${panelTab === 'props' ? 'active' : ''}`} onClick={() => setPanelTab('props')}>Properties</div>
                    <div className={`rpt ${panelTab === 'views' ? 'active' : ''}`} onClick={() => setPanelTab('views')}>Views</div>
                    <div className={`rpt ${panelTab === 'notes' ? 'active' : ''}`} onClick={() => setPanelTab('notes')}>Notes <span className="mono-label">{annotations.length}</span></div>
                    <div className={`rpt ${panelTab === 'ai' ? 'active' : ''}`} onClick={() => setPanelTab('ai')}>AI Consultant</div>
                    {isStudio && <div className={`rpt ${panelTab === 'mats' ? 'active' : ''}`} onClick={() => setPanelTab('mats')}>Materials</div>}
                    {isStudio && <div className={`rpt ${panelTab === 'layers' ? 'active' : ''}`} onClick={() => setPanelTab('layers')}>Layers</div>}
                </div>

                <div className="rp-body">
                    {panelTab === 'props' && projectDetail && (
                        <>
                            <div className="panel-sh">Model info</div>
                            <div className="prop-row"><div className="pr-label">File</div><div className="pr-val">{projectDetail.modelUrl.split('/').pop()?.split('?')[0] || 'Skyline.glb'}</div></div>
                            <div className="prop-row"><div className="pr-label">Client</div><div className="pr-val">{projectDetail.clientName}</div></div>
                            <div className="prop-row"><div className="pr-label">Category</div><div className="pr-val">{projectDetail.category}</div></div>

                            <div className="panel-sh" style={{ marginTop: '16px' }}>Display</div>
                            <div className="prop-row">
                                <div className="pr-label">Background</div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {['#0D0C0B', '#F5F3EF', '#1A2744', '#E8EFF5'].map(c => (
                                        <div key={c} className={`color-swatch ${bgColor === c ? 'sel' : ''}`} style={{ background: c }} onClick={() => setBgColor(c)} />
                                    ))}
                                </div>
                            </div>

                            <div className="panel-sh" style={{ marginTop: '16px' }}>Lighting</div>
                            <div className="slider-group">
                                <div className="slider-item">
                                    <div className="sl-top"><span>Ambient</span><span className="mono">{ambientIntensity}%</span></div>
                                    <input type="range" min="0" max="100" value={ambientIntensity} onChange={(e) => setAmbientIntensity(Number(e.target.value))} />
                                </div>
                                <div className="slider-item">
                                    <div className="sl-top"><span>Sun</span><span className="mono">{sunIntensity}%</span></div>
                                    <input type="range" min="0" max="100" value={sunIntensity} onChange={(e) => setSunIntensity(Number(e.target.value))} />
                                </div>
                                <div className="slider-item">
                                    <div className="sl-top"><span>Exposure</span><span className="mono">{exposure.toFixed(2)}</span></div>
                                    <input type="range" min="0" max="200" value={exposure * 100} onChange={(e) => setExposure(Number(e.target.value) / 100)} />
                                </div>
                            </div>

                            <div className="panel-sh" style={{ marginTop: '16px' }}>Section cut</div>
                            <div className="slider-item">
                                <div className="sl-top"><span>Height</span><span className="mono">{sectionHeight.toFixed(2)} m</span></div>
                                <input type="range" min="0" max="100" value={(sectionHeight / 3.2) * 100} onChange={(e) => setSectionHeight(Number(e.target.value) / 100 * 3.2)} />
                            </div>
                        </>
                    )}

                    {panelTab === 'views' && projectDetail && (
                        <div id="tab-views">
                            {projectDetail.waypoints.length === 0 && (
                                <div className="empty-tab">No preset views defined.</div>
                            )}
                            {projectDetail.waypoints.map(wp => (
                                <div key={wp.id} className="annot-item" onClick={() => flyToWaypoint(wp)}>
                                    <div className="ai-av" style={{ background: 'var(--bg-inset)', color: 'var(--ink-2)' }}>👁</div>
                                    <div className="ai-body">
                                        <div className="ai-text">{wp.title}</div>
                                        <div className="ai-meta">{wp.description || 'Preset View'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {panelTab === 'notes' && (
                        <div id="tab-notes">
                            {annotations.length === 0 && (
                                <div className="empty-tab">No annotations yet.</div>
                            )}
                            {annotations.map(note => (
                                <div key={note.id} className="annot-item" onClick={() => flyToAnnotation(note)}>
                                    <div className="ai-av" style={{ background: 'linear-gradient(135deg,#1A7A4A,#22A05A)' }}>{note.authorName?.substring(0, 2).toUpperCase() || '??'}</div>
                                    <div className="ai-body">
                                        <div className="ai-text">{note.text}</div>
                                        <div className="ai-meta">{note.authorName} · {new Date(note.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {panelTab === 'ai' && (
                        <div id="tab-ai" style={{ padding: '4px' }}>
                            <div className="panel-sh">Architectural Critique</div>
                            {!critiqueResult && !isCritiquing && (
                                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                    <p style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '16px' }}>Let AI analyze your BIM model for structural, ergonomic and safety insights.</p>
                                    <button className="btn btn-primary" onClick={async () => {
                                        setIsCritiquing(true);
                                        try {
                                            const res = await aiService.critiqueProject(projectId || '', "BIM L0/L1 Summary Sample Data");
                                            setCritiqueResult(res);
                                        } finally {
                                            setIsCritiquing(false);
                                        }
                                    }}>Run AI Consultant</button>
                                </div>
                            )}
                            {isCritiquing && (
                                <div className="loading-state" style={{ padding: '20px', textAlign: 'center' }}>
                                    <div className="skeleton sk-line" style={{ width: '80%', marginBottom: '10px' }} />
                                    <div className="skeleton sk-line" style={{ width: '60%', marginBottom: '10px' }} />
                                    <div style={{ fontSize: '11px', color: 'var(--ink-4)', fontFamily: 'var(--mono)' }}>Analyzing spatial data...</div>
                                </div>
                            )}
                            {critiqueResult && (
                                <div style={{ animation: 'fadeIn 0.5s ease' }}>
                                    <div style={{ padding: '12px', background: 'var(--bg-inset)', borderRadius: '8px', marginBottom: '16px', borderLeft: '3px solid var(--blue)' }}>
                                        <div style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--ink)' }}>{critiqueResult.summary}</div>
                                    </div>
                                    <div className="panel-sh">Core Findings</div>
                                    {critiqueResult.findings.map((f: string, i: number) => (
                                        <div key={i} className="prop-row" style={{ height: 'auto', padding: '10px 0', borderBottom: '1px solid var(--border)', display: 'block' }}>
                                            <div style={{ fontSize: '12px', color: 'var(--ink)', lineHeight: '1.4' }}>• {f}</div>
                                        </div>
                                    ))}
                                    <div className="prop-row" style={{ marginTop: '16px' }}>
                                        <div className="pr-label">Theme</div>
                                        <div className="pr-val" style={{ color: 'var(--blue)', fontWeight: 600 }}>{critiqueResult.suggestedTheme}</div>
                                    </div>
                                    {critiqueResult.safetyWarning && (
                                        <div style={{ marginTop: '16px', padding: '10px', background: 'rgba(255,160,0,0.1)', border: '1px solid var(--amber)', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span style={{ fontSize: '18px' }}>⚠️</span>
                                            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--amber)' }}>SAFETY COMPLIANCE WARNING DETECTED</div>
                                        </div>
                                    )}
                                    <button className="btn btn-secondary" style={{ width: '100%', marginTop: '20px' }} onClick={() => setCritiqueResult(null)}>Recalculate</button>
                                </div>
                            )}
                        </div>
                    )}

                    {panelTab === 'mats' && (
                        <div id="tab-mats">
                            <div className="panel-sh">Model Materials</div>
                            {modelMaterials.length === 0 && <div className="empty-tab">No specific materials found.</div>}
                            {modelMaterials.map((m, idx) => (
                                <div key={idx} className="material-item">
                                    <div className="mi-header">
                                        <div className="mi-name">{m.name}</div>
                                        <div className="mi-color-code">{m.color.toUpperCase()}</div>
                                    </div>
                                    <div className="mi-swatches">
                                        {['#FFFFFF', '#E8E4DE', '#8B7355', '#4A4A4A', '#2D5BE3', '#1A7A4A', '#B91C1C'].map(c => (
                                            <div
                                                key={c}
                                                className={`mi-swatch ${m.color.toUpperCase() === c.toUpperCase() ? 'active' : ''}`}
                                                style={{ background: c }}
                                                onClick={() => {
                                                    m.material.color.set(c);
                                                    setModelMaterials(prev => prev.map(p => p.name === m.name ? { ...p, color: c } : p));
                                                }}
                                            />
                                        ))}
                                        <div className="mi-custom">
                                            <input
                                                type="color"
                                                value={m.color}
                                                onChange={(e) => {
                                                    const newColor = e.target.value;
                                                    m.material.color.set(newColor);
                                                    setModelMaterials(prev => prev.map(p => p.name === m.name ? { ...p, color: newColor } : p));
                                                }}
                                            />
                                            <span>+</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {panelTab === 'layers' && (
                        <div id="tab-layers">
                            <div className="panel-sh">Model Layers (BIM)</div>
                            {modelLayers.length === 0 && <div className="empty-tab">No layers detected.</div>}
                            {modelLayers.map(layer => (
                                <div key={layer.name} className="prop-row" style={{ cursor: 'pointer' }} onClick={() => {
                                    const nextVisible = !layer.visible;
                                    objectsRef.current.forEach(o => {
                                        if (o.name.startsWith(layer.name)) o.visible = nextVisible;
                                    });
                                    setModelLayers(prev => prev.map(l => l.name === layer.name ? { ...l, visible: nextVisible } : l));
                                }}>
                                    <div className="pr-label" style={{ color: layer.visible ? 'var(--ink)' : 'var(--ink-4)' }}>{layer.name}</div>
                                    <div className={`toggle-pill ${layer.visible ? 'active' : ''}`}>{layer.visible ? 'Visible' : 'Hidden'}</div>
                                </div>
                            ))}

                            {projectId && (
                                <div style={{ marginTop: '24px' }}>
                                    <HeatmapStats projectId={projectId} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Annotation Creation Modal */}
            {annotateModalPos && (
                <div style={{
                    position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(13, 12, 11, 0.95)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
                    padding: 16, width: 340, zIndex: 2000, color: '#F5F3EF'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>Add Annotation</div>
                        <div style={{ cursor: 'pointer', fontSize: 18, lineHeight: 1, opacity: 0.6 }}
                            onClick={() => { setAnnotateModalPos(null); onAnnotationModalClosed?.(); }}>&times;</div>
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                        Position: ({annotateModalPos.x.toFixed(2)}, {annotateModalPos.y.toFixed(2)}, {annotateModalPos.z.toFixed(2)})
                    </div>
                    <textarea
                        value={annotateText}
                        onChange={(e) => setAnnotateText(e.target.value)}
                        placeholder="Describe the issue or note..."
                        style={{
                            width: '100%', height: 60, background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                            color: '#F5F3EF', padding: 8, fontSize: 12, resize: 'none', outline: 'none'
                        }}
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                        <button
                            className="btn"
                            style={{
                                flex: 1, background: 'rgba(255,255,255,0.06)', color: '#F5F3EF',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                                padding: '6px 0', fontSize: 11, cursor: 'pointer'
                            }}
                            disabled={isTranscribing}
                            onClick={async () => {
                                setIsTranscribing(true);
                                try {
                                    const result = await aiService.transcribeAudio('sample-audio-data');
                                    setAnnotateText(prev => prev + (prev ? '\n' : '') + result.text);
                                } catch (err) { console.error('STT failed:', err); }
                                finally { setIsTranscribing(false); }
                            }}
                        >
                            {isTranscribing ? '⏳ Listening...' : '🎤 Voice Note'}
                        </button>
                        <button
                            className="btn"
                            style={{
                                flex: 1, background: '#2D5BE3', color: '#fff',
                                border: 'none', borderRadius: 8,
                                padding: '6px 0', fontSize: 11, cursor: 'pointer', fontWeight: 600
                            }}
                            disabled={!annotateText.trim()}
                            onClick={async () => {
                                if (!projectId || !annotateText.trim()) return;
                                try {
                                    await annotationService.createAnnotation({
                                        text: annotateText,
                                        positionX: annotateModalPos.x,
                                        positionY: annotateModalPos.y,
                                        positionZ: annotateModalPos.z,
                                        projectId
                                    });
                                    setAnnotateModalPos(null);
                                    setAnnotateText('');
                                    onAnnotationModalClosed?.();
                                } catch (err) { console.error('Failed to create annotation:', err); }
                            }}
                        >
                            Save Annotation
                        </button>
                    </div>
                </div>
            )}

            {/* Summon Toast */}
            {summonToast && (
                <div style={{
                    position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(45, 91, 227, 0.95)', color: 'white', padding: '8px 20px',
                    borderRadius: 8, fontSize: 12, fontWeight: 600, zIndex: 3000,
                    animation: 'fadeInDown 0.3s ease'
                }}>
                    📍 {summonToast}
                </div>
            )}
        </div>
    );
};

export default ThreeDViewer;
