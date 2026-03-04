export type AssetType = 'Model' | 'Texture' | 'Documentation' | 'Other';

export interface Asset {
    id: string;
    fileName: string;
    url: string;
    extension: string;
    sizeInBytes: number;
    type: AssetType;
    versionNumber: number;
    isCurrentVersion: boolean;
    projectId: string;
    projectTitle: string;
    createdAt: string;
}

export interface AssetSearchDto {
    query?: string;
    type?: AssetType;
    projectId?: string;
    workspaceId?: string;
}
