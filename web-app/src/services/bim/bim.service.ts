export interface BimMetadata {
    id: string;
    externalId: string;
    projectId: string;
    name: string;
    category: string;
    material: string;
    dimensions: string;
    area: number;
    volume: number;
    buildingName?: string;
    floorName?: string;
    roomName?: string;
    cost?: number;
    manufacturer?: string;
    properties: Record<string, string>;
}

export const bimService = {
    getMetadata: async (objectId: string, projectId: string): Promise<BimMetadata | null> => {
        // Simple logic to return different metadata based on ID
        const idInt = parseInt(objectId.replace(/\D/g, '')) || 100;

        const categories = ['Column', 'Wall', 'Window', 'Slab', 'Door'];
        const materials = ['Reinforced Concrete', 'Brick', 'Glass', 'Steel', 'Timber'];
        const category = categories[idInt % categories.length];

        return {
            id: objectId,
            externalId: 'REVIT-' + idInt.toString(16).toUpperCase(),
            projectId,
            name: `${category} [ID: ${idInt}]`,
            category,
            material: materials[idInt % materials.length],
            dimensions: `${(idInt % 5) + 1}m x ${(idInt % 3) + 2}m`,
            area: (idInt % 20) + 5,
            volume: (idInt % 50) + 10,
            buildingName: 'Skyline Tower',
            floorName: `Floor ${(idInt % 40) + 1}`,
            roomName: `Zone ${(idInt % 10) + 100}`,
            manufacturer: 'BuildRight Industries',
            properties: {
                'Thermal Transmittance': '0.24 W/m²K',
                'Fire Rating': '120 min',
                'Acoustic Rating': '45 dB',
                'Assembly Description': 'Standard Structural Element'
            }
        };
    },

    triggerExtraction: async (_projectId: string, _modelUrl: string): Promise<{ extractedElements: number }> => {
        return { extractedElements: 1245 };
    }
};
