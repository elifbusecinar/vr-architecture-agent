import type { Asset, AssetSearchDto } from '@/types/asset.types';

const MOCK_ASSETS: Asset[] = [
    { id: 'a1', fileName: 'FloorPlan_Level1.pdf', url: '/files/fp1.pdf', fileSize: 1024 * 1024 * 2.5, uploadedBy: 'Architect Alex', createdAt: '2026-01-10T09:00:00', type: 'doc' },
    { id: 'a2', fileName: 'MainModel_V2.glb', url: '/models/skyline_v2.glb', fileSize: 1024 * 1024 * 45, uploadedBy: 'Architect Alex', createdAt: '2026-02-15T11:30:00', type: 'model' },
    { id: 'a3', fileName: 'Meeting_Notes.docx', url: '/files/notes.docx', fileSize: 1024 * 512, uploadedBy: 'Designer Mia', createdAt: '2026-03-01T15:00:00', type: 'doc' },
    { id: 'a4', fileName: 'Lobby_Render.png', url: '/images/render1.png', fileSize: 1024 * 1024 * 5, uploadedBy: 'Designer Mia', createdAt: '2026-03-02T10:00:00', type: 'image' }
] as any;

export const assetService = {
    searchAssets: async (params: AssetSearchDto): Promise<Asset[]> => {
        let filtered = MOCK_ASSETS;
        if (params.query) {
            filtered = filtered.filter(a => a.fileName.toLowerCase().includes(params.query!.toLowerCase()));
        }
        return filtered;
    }
};
