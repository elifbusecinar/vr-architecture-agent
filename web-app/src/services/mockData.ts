import { ProjectStatus } from '@/types/project.types';

export const MOCK_PROJECTS = {
    data: [
        {
            id: 'p1',
            title: 'Skyline Tower',
            description: 'A 45-story residential tower with glass facade and sustainable energy systems.',
            modelUrl: '/models/skyline.glb',
            clientName: 'Skyline Realty',
            category: 'Commercial',
            status: 'VRActive' as ProjectStatus,
            progress: 78,
            deadline: '2026-06-15',
            createdAt: '2026-01-10',
            workspaceId: 'w1',
            ownerId: 'u1',
            isPublic: true
        },
        {
            id: 'p2',
            title: 'Villa Azura',
            description: 'Luxury villa on the coast with emphasis on open space and natural lighting.',
            modelUrl: '/models/villa.glb',
            clientName: 'Azura Holdings',
            category: 'Residential',
            status: 'Approved' as ProjectStatus,
            progress: 100,
            deadline: '2025-12-20',
            createdAt: '2025-11-05',
            workspaceId: 'w1',
            ownerId: 'u1',
            isPublic: false
        },
        {
            id: 'p3',
            title: 'Metro Nexus Hub',
            description: 'Central transportation hub with integrated retail and office spaces.',
            modelUrl: '/models/metro.glb',
            clientName: 'City Transport Authority',
            category: 'Commercial',
            status: 'InReview' as ProjectStatus,
            progress: 45,
            deadline: '2026-09-30',
            createdAt: '2026-02-15',
            workspaceId: 'w1',
            ownerId: 'u1',
            isPublic: true
        },
        {
            id: 'p4',
            title: 'Nordic Cabin',
            description: 'Compact eco-friendly cabin design for snowy climates.',
            modelUrl: '/models/cabin.glb',
            clientName: 'Private Client',
            category: 'Residential',
            status: 'Draft' as ProjectStatus,
            progress: 15,
            deadline: '2026-05-01',
            createdAt: '2026-03-01',
            workspaceId: 'w1',
            ownerId: 'u1',
            isPublic: false
        },
        {
            id: 'p5',
            title: 'Solaris Plaza',
            description: 'Urban shopping center powered by integrated PV panels.',
            modelUrl: '/models/plaza.glb',
            clientName: 'EcoDevelop Inc.',
            category: 'Commercial',
            status: 'VRActive' as ProjectStatus,
            progress: 85,
            deadline: '2026-08-20',
            createdAt: '2026-01-25',
            workspaceId: 'w1',
            ownerId: 'u1',
            isPublic: true
        }
    ],
    total: 5,
    page: 1,
    limit: 12
};

export const MOCK_PROJECT_DETAIL = {
    ...MOCK_PROJECTS.data[0],
    waypoints: [
        { id: 'wp1', title: 'Main Entrance', positionX: 0, positionY: 1.6, positionZ: 5, yaw: 0, pitch: 0 },
        { id: 'wp2', title: 'Living Room', positionX: 2, positionY: 1.6, positionZ: -2, yaw: 45, pitch: 0 },
        { id: 'wp3', title: 'Roof Garden', positionX: 0, positionY: 150, positionZ: 0, yaw: 180, pitch: -10 }
    ],
    assets: [
        { id: 'a1', fileName: 'v1.0_Final.glb', url: '/models/skyline_v1.glb', versionNumber: 1, createdAt: '2026-01-10' },
        { id: 'a2', fileName: 'v1.1_Revision.glb', url: '/models/skyline_v1_1.glb', versionNumber: 2, createdAt: '2026-02-15' },
        { id: 'a3', fileName: 'Texture_Pack.zip', url: '/assets/textures.zip', versionNumber: 1, createdAt: '2026-02-20' }
    ]
};

export const MOCK_SESSIONS = [
    { id: 's1', projectId: 'p1', projectTitle: 'Skyline Tower', hostName: 'Architect Alex', startTime: '2026-03-04T10:00:00', durationMinutes: 45, participantCount: 3, status: 'Active' },
    { id: 's2', projectId: 'p2', projectTitle: 'Villa Azura', hostName: 'Lead Designer', startTime: '2026-03-03T14:30:00', durationMinutes: 60, participantCount: 2, status: 'Completed' },
    { id: 's3', projectId: 'p3', projectTitle: 'Metro Nexus Hub', hostName: 'Architect Alex', startTime: '2026-03-05T09:00:00', durationMinutes: 30, participantCount: 5, status: 'Scheduled' }
];

export const MOCK_ANNOTATIONS = [
    { id: 'an1', projectId: 'p1', authorName: 'Client John', text: 'Change marble texture to Calacatta in the lobby.', createdAt: '2026-03-04T10:15:00', position: { x: 1, y: 1, z: 1 } },
    { id: 'an2', projectId: 'p1', authorName: 'Architect Alex', text: 'Check HVAC spacing in North Wall.', createdAt: '2026-03-04T10:45:00', position: { x: -2, y: 3, z: 5 } },
    { id: 'an3', projectId: 'p3', authorName: 'Structural Eng.', text: 'Column C4 needs reinforcement analysis.', createdAt: '2026-03-02T16:20:00', position: { x: 10, y: 0, z: -4 } }
];

export const MOCK_APPROVALS = [
    { id: 'ap1', projectId: 'p1', title: 'Foundation Sign-off', status: 'approved', createdAt: '2026-01-20', reviewedByName: 'City Eng.', reviewedAt: '2026-01-22' },
    { id: 'ap2', projectId: 'p1', title: 'Façade Material Approval', status: 'pending', createdAt: '2026-02-28', description: 'Requires review of the glass tinting level.' },
    { id: 'ap3', projectId: 'p2', title: 'Interior Design Package', status: 'approved', createdAt: '2026-02-10', reviewedByName: 'Owner Sarah', reviewedAt: '2026-02-12' }
];

export const MOCK_ACTIVITIES = [
    { id: 'act1', type: 1, userId: 'u1', userName: 'Architect Alex', projectId: 'p1', projectTitle: 'Skyline Tower', message: 'Architect Alex uploaded a new model version', createdAt: '2026-03-04T11:20:00' },
    { id: 'act2', type: 2, userId: 'u2', userName: 'Client John', projectId: 'p1', projectTitle: 'Skyline Tower', message: 'Client John joined VR session', createdAt: '2026-03-04T10:05:00' },
    { id: 'act3', type: 4, userId: 'u2', userName: 'Client John', projectId: 'p1', projectTitle: 'Skyline Tower', message: 'Client John added a comment', createdAt: '2026-03-04T10:15:00' },
    { id: 'act4', type: 3, userId: 'u1', userName: 'Architect Alex', projectId: 'p3', projectTitle: 'Metro Nexus Hub', message: 'Architect Alex shared the project with City Authority', createdAt: '2026-03-03T15:40:00' },
    { id: 'act5', type: 1, userId: 'u3', userName: 'Designer Mia', projectId: 'p4', projectTitle: 'Nordic Cabin', message: 'Designer Mia updated the floor plan', createdAt: '2026-03-02T09:12:00' }
];

export const MOCK_NOTIFICATIONS = [
    { id: 'n1', title: 'New Comment', message: 'Client John commented on Skyline Tower', type: 'info', read: false, createdAt: '2026-03-04T10:16:00' },
    { id: 'n2', title: 'Session Starting', message: 'VR Session for Villa Azura starts in 10 minutes', type: 'warning', read: false, createdAt: '2026-03-03T14:20:00' },
    { id: 'n3', title: 'Project Approved', message: 'Interior Design Package for Villa Azura was approved', type: 'success', read: true, createdAt: '2026-02-12T11:00:00' }
];
