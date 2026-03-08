import { Link } from 'react-router-dom';
import type { Project } from '@/types/project.types';
import { formatDate } from '@/utils/date';

interface ProjectCardProps {
    project: Project;
}

const statusColor: Record<string, string> = {
    Draft: 'bg-slate-100 text-slate-800',
    InReview: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    VRActive: 'bg-blue-100 text-blue-800',
    Processing: 'bg-indigo-100 text-indigo-800',
};

export default function ProjectCard({ project }: ProjectCardProps) {
    const { id, title, thumbnailUrl, status, createdAt, clientName, category, progress } = project;

    const isProcessing = status === 'Processing';

    return (
        <Link to={`/project/${id}`} className="group block relative overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {isProcessing && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                                <div className="w-full max-w-[120px]">
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Processing</span>
                                        <span className="text-[10px] font-bold text-indigo-600">{progress}%</span>
                                    </div>
                                    <div className="h-1 bg-indigo-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                                <p className="mt-3 text-[10px] text-slate-500 font-medium">Applying VR Optimizations...</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Status Badge */}
                <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${statusColor[status] || 'bg-gray-100 text-gray-800'}`}>
                    {status}
                </span>
            </div>

            <div className="p-4 space-y-3">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-1 mt-1">
                        {clientName ? `${clientName} • ` : ''}{category}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(createdAt)}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
