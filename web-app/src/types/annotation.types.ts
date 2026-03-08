export interface Annotation {
    id: string;
    text: string;
    positionX: number;
    positionY: number;
    positionZ: number;
    projectId: string;
    authorId: string;
    authorName: string;
    parentId?: string;
    createdAt: string;
    replies: Annotation[];
}

export interface CreateAnnotation {
    text: string;
    positionX: number;
    positionY: number;
    positionZ: number;
    projectId: string;
    parentId?: string;
}
