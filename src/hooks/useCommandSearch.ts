import { useState, useEffect } from 'react';
import { annotationService } from '../services/annotations/annotation.service';
import { assetService } from '../services/assets/asset.service';
import { useNavigate } from 'react-router-dom';

export interface CommandPaletteItem {
    type: string;
    icon: string;
    title: string;
    meta: string;
    tags: string[];
    cls?: string;
    action?: () => void;
    kbd?: string;
}

export function useCommandSearch(query: string) {
    const [results, setResults] = useState<CommandPaletteItem[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                // Parallel search
                const [assets, annotations] = await Promise.all([
                    assetService.searchAssets({ query }),
                    annotationService.searchAnnotations(query)
                ]);

                const formattedResults = [
                    ...assets.map(a => ({
                        type: 'Model',
                        icon: '📦',
                        title: a.fileName,
                        meta: `${(a.sizeInBytes / (1024 * 1024)).toFixed(1)} MB · ${a.projectTitle}`,
                        tags: [a.extension, 'model'],
                        action: () => navigate(`/project/${a.projectId}`)
                    })),
                    ...annotations.map(ann => ({
                        type: 'Annotation',
                        icon: '💬',
                        title: ann.text,
                        meta: `at [${ann.positionX.toFixed(2)}, ${ann.positionY.toFixed(2)}, ${ann.positionZ.toFixed(2)}] · ${ann.authorName}`,
                        tags: ['note', 'comment', '3d'],
                        action: () => {
                            // Navigation logic: go to project and pass coordinates as state/params
                            navigate(`/project/${ann.projectId}`, {
                                state: { focusTarget: { x: ann.positionX, y: ann.positionY, z: ann.positionZ } }
                            });
                        }
                    }))
                ];

                setResults(formattedResults);
            } catch (err) {
                console.error('Search failed', err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return { results, loading };
}
