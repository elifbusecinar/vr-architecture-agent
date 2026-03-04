import { useState, useCallback } from 'react';
import CreateProjectModal from '@/components/dashboard/CreateProjectModal';

export default function UploadPanel() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [droppedFile, setDroppedFile] = useState<File | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files.length > 0) {
            setDroppedFile(e.dataTransfer.files[0]);
            setIsModalOpen(true);
        }
    }, []);

    const handleClose = useCallback(() => {
        setIsModalOpen(false);
        setDroppedFile(null);
    }, []);

    return (
        <>
            <div
                className="panel"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => setIsModalOpen(true)}
                style={{ cursor: 'pointer' }}
            >
                <div className="panel-top">
                    <div className="panel-title">Upload Model</div>
                    <span className="tag">GLB · GLTF</span>
                </div>
                <div className={`upload-area ${isDragOver ? 'drag-over' : ''}`}>
                    <div className="upload-icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M8 11V1M4 4l4-3 4 3M2 12v2a1 1 0 001 1h10a1 1 0 001-1v-2" />
                        </svg>
                    </div>
                    <div className="upload-text">{isDragOver ? 'Release to upload' : 'Drop your model here'}</div>
                    <div className="upload-sub">GLB · GLTF · OBJ — up to 500 MB</div>
                </div>
            </div>

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={handleClose}
                initialFile={droppedFile}
            />
        </>
    );
}
