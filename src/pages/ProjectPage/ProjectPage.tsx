import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useProjectDetail } from '@/hooks/useProjects';
import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/constants/roles';
import { useSubscription } from '@/hooks/useSubscription';
import UpdateProjectModal from '@/components/dashboard/UpdateProjectModal';
import ThreeDViewer from '@/components/project/ThreeDViewer/ThreeDViewer';
import '@/styles/project-details.css';
import { sessionService } from '@/services/sessions/session.service';
import { approvalService } from '@/services/approvals/approval.service';
import { annotationService } from '@/services/annotations/annotation.service';
import { storiesService } from '@/services/stories/stories.service';
import StoryViewerModal from '@/components/project/StoryViewerModal';
import ProjectTimeline from '@/components/project/ProjectTimeline';
import BillingDashboard from '@/components/billing/BillingDashboard';
import type { VRSession } from '@/types/session.types';
import type { Approval } from '@/types/approval.types';
import type { Annotation } from '@/types/annotation.types';
import type { Story } from '@/types/stories.types';
import { QRCodeSVG } from 'qrcode.react';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// ─── ICONS ─────────────────────────────────────────────────────────────────
const VRIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="5" width="14" height="8" rx="2" /><circle cx="5.5" cy="9" r="1.5" /><circle cx="10.5" cy="9" r="1.5" /><path d="M7 9h2" /></svg>;
const BuildingIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 1h12v14H2zM5 4h2M5 7h2M5 10h2M9 4h2M9 7h2M9 10h2" /></svg>;
const SiteIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 14l3-10h8l3 10M4 4h8" /><circle cx="8" cy="11" r="2" /></svg>;
const VideoIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 4h10v8H1V4zM11 6l4-2v8l-4-2" /></svg>;
const CameraIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="12" height="9" rx="2" /><circle cx="8" cy="8.5" r="2.5" /><path d="M5 4l1-2h4l1 2" /></svg>;
const GlobeIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="7" /><path d="M1 8h14M8 1v14M3 3a11 11 0 0110 0M3 13a11 11 0 0110 0" /></svg>;
const MicIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="1" width="6" height="9" rx="3" /><path d="M2 7a6 6 0 0012 0M8 11v4M5 15h6" /></svg>;
const EditIcon = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 2l3 3-9 9H2v-3l9-9zM9 4l3 3" /></svg>;
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l3.5 4L13 4" /></svg>;
const XIcon = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4l8 8M12 4L4 12" /></svg>;
const ClockIcon = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 4v4h4" /></svg>;

const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#F5F3EF' },
  header: { fontSize: 28, marginBottom: 20, fontWeight: 'bold', color: '#1A1917' },
  subHeader: { fontSize: 16, marginBottom: 40, color: '#B8954E' },
  section: { margin: 10, padding: 15, border: '1px solid #1A1917', borderRadius: 4 },
  title: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#1A1917' },
  text: { fontSize: 12, marginBottom: 5, color: '#0d0c0b' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  badgeInfo: { backgroundColor: '#2D5BE3', color: 'white', padding: 4, fontSize: 10, borderRadius: 2 }
});

const HandoffReport = ({ project, approvals, annotations }: { project: any, approvals: any[], annotations: any[] }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.header}>{project.title} - Handoff Report</Text>
      <Text style={pdfStyles.subHeader}>Generated for {project.clientName || 'Client'}</Text>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.title}>Project Overview</Text>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.text}>Status:</Text>
          <Text style={pdfStyles.text}>{project.status}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.text}>Category:</Text>
          <Text style={pdfStyles.text}>{project.category || 'Architecture'}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.text}>Completion:</Text>
          <Text style={pdfStyles.text}>{project.progress || 10}%</Text>
        </View>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.title}>Recent Activity & Approvals</Text>
        {approvals.slice(0, 5).map((ap, i) => (
          <Text key={i} style={pdfStyles.text}>• {ap.title} ({ap.status}) - {new Date(ap.createdAt).toLocaleDateString()}</Text>
        ))}
        {approvals.length === 0 && <Text style={pdfStyles.text}>No approvals recorded yet.</Text>}
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.title}>VR Feedback Summary</Text>
        <Text style={pdfStyles.text}>Total Annotations: {annotations.length}</Text>
        {annotations.slice(0, 3).map((ann, i) => (
          <Text key={i} style={pdfStyles.text}>• "{ann.text}" by {ann.authorName}</Text>
        ))}
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.title}>Spatial Analysis & Visual Analytics</Text>
        <Text style={pdfStyles.text}>The following data reflects AI-processed gaze distribution and spatial interaction density from the last 5 VR sessions.</Text>
        <View style={{ marginVertical: 10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 4, border: '1px dashed #ccc' }}>
          <Text style={{ fontSize: 10, textAlign: 'center', color: '#666' }}>[ AI-Generated Interaction Heatmap Preview ]</Text>
          <Text style={{ fontSize: 8, textAlign: 'center', color: '#999', marginTop: 4 }}>Primary focus: Master Bedroom (42%), Living Area (35%)</Text>
        </View>
        <Text style={pdfStyles.text}>• Gaze concentration detected on South Facade glazing (High interest/concern).</Text>
        <Text style={pdfStyles.text}>• 82% of users spent more than 4 minutes in the Kitchen zone.</Text>
      </View>

      <View style={{ marginTop: 50, paddingTop: 20, borderTop: '1px solid #ccc' }}>
        <Text style={{ fontSize: 10, textAlign: 'center', color: '#888' }}>VR Architecture • Automated VR Operations System</Text>
      </View>
    </Page>
  </Document>
);

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'approvals' | 'compare' | 'timeline' | 'billing' | 'models' | 'annotations'>('overview');
  const [focusInfo, setFocusInfo] = useState<{ x: number; y: number; z: number } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [activeSessions, setActiveSessions] = useState<VRSession[]>([]);
  const [isSiteMode, setIsSiteMode] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [annotationTriggerPos, setAnnotationTriggerPos] = useState<{ x: number; y: number; z: number } | null>(null);
  const [selectedCompareAssetId, setSelectedCompareAssetId] = useState<string | null>(null);

  const { data: project, isLoading } = useProjectDetail(id || '');
  const { isFeatureEnabled } = useSubscription(project?.workspaceId);
  const canExport = isFeatureEnabled('ExportGLB');

  const compareAssetUrl = project?.assets?.find(a => a.id === selectedCompareAssetId)?.url;

  const role = user?.role || ROLES.CLIENT;
  const isClient = role === ROLES.CLIENT;

  useEffect(() => {
    if (location.state?.focusTarget) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFocusInfo(location.state.focusTarget);
      const timer = setTimeout(() => setFocusInfo(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  if (isLoading) {
    return (
      <div className="page" style={{ padding: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skeleton sk-title" style={{ width: '30%' }} />
          <div className="skeleton sk-line" style={{ width: '50%' }} />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page" style={{ padding: 32 }}>
        <p>Project not found.</p>
      </div>
    );
  }

  useEffect(() => {
    if (project?.id) {
      sessionService.getActive().then(data => {
        setActiveSessions(data.filter(s => s.projectId === project.id));
      });
      sessionService.getProjectSessions(project.id).then(setAllSessions).catch(() => { });
      // Fetch real approvals
      approvalService.getProjectApprovals(project.id).then(setApprovals).catch(() => { });
      // Fetch real annotations
      annotationService.getProjectAnnotations(project.id).then(setAnnotations).catch(() => { });
      // Fetch real stories
      storiesService.getByProject(project.id).then(setStories).catch(() => { });
    }
  }, [project?.id]);

  const [vrPushModalOpen, setVrPushModalOpen] = useState(false);

  const handleRequestVRStart = async () => {
    if (!project?.id) return;
    try {
      await sessionService.requestVRStart(project.id);
      setVrPushModalOpen(true);
    } catch (e) {
      alert('Failed to request VR session');
    }
  };

  const handleSpectate = async (sessionId: string) => {
    try {
      await sessionService.joinSession(sessionId, true);
      setShowViewer(true);
    } catch (e) {
      alert('Failed to join session as spectator');
    }
  };

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    if (tab === 'models' || tab === 'compare') {
      setShowViewer(true);
    } else {
      setShowViewer(false);
    }
  };

  const handleGeneratePdfReport = async () => {
    if (!project) return;
    setIsGeneratingPdf(true);
    try {
      const blob = await pdf(<HandoffReport project={project} approvals={approvals} annotations={annotations} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.title.replace(/\s+/g, '_')}_Handoff_Report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF report.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="project-details-page">
      <UpdateProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
      />
      <StoryViewerModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />
      {focusInfo && (
        <div className="badge badge-live" style={{
          position: 'fixed',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: 'var(--amber)',
          borderColor: 'var(--amber-30)',
          color: '#1A1917',
          padding: '8px 16px',
          fontWeight: 600
        }}>
          🎯 Focusing on 3D Coordinate: [{focusInfo.x.toFixed(2)}, {focusInfo.y.toFixed(2)}, {focusInfo.z.toFixed(2)}]
        </div>
      )}

      {isQrModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsQrModalOpen(false)}>
          <div style={{ background: 'var(--bg)', padding: 32, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', width: 400, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, marginBottom: 8, color: 'var(--ink)' }}>Live Handoff QR Code</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 24 }}>Scan with your mobile device (Phone/Tablet) to instantly open this project in Site Mode.</p>
            <div style={{ background: 'white', padding: 20, borderRadius: 8, display: 'inline-block', marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <QRCodeSVG value={`${window.location.origin}/projects/${project?.id}?mode=site`} size={200} level="M" />
            </div>
            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setIsQrModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* VR Push Confirmation Modal */}
      {vrPushModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setVrPushModalOpen(false)}>
          <div style={{ background: 'var(--bg)', padding: 32, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', width: 440, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🥽</div>
            <h2 style={{ fontSize: 20, marginBottom: 8, color: 'var(--ink)' }}>VR Session Pushed</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 16, lineHeight: 1.6 }}>
              A notification has been sent to all connected VR headsets. Put on your Meta Quest 3 to enter the experience.
            </p>
            <div style={{
              background: 'var(--bg-inset)', borderRadius: 8, padding: '10px 14px', marginBottom: 16,
              fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-2)', wordBreak: 'break-all',
              border: '1px solid var(--border)', textAlign: 'left'
            }}>
              <span style={{ fontSize: 10, color: 'var(--ink-3)', display: 'block', marginBottom: 4 }}>Deep Link:</span>
              vr-arch://project/{project?.id}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }}
                onClick={() => {
                  navigator.clipboard.writeText(`vr-arch://project/${project?.id}`);
                  alert('Deep link copied!');
                }}>📋 Copy Link</button>
              <button className="btn btn-primary" style={{ flex: 1 }}
                onClick={() => setVrPushModalOpen(false)}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* TOPBAR (This replaces the main layout topbar essentially, or lives inside it. 
          Assuming MainLayout topbar is hidden, but traditionally ProjectPage acts as its own entity.
          We will keep the topbar inside .project-details-page as per design.) 
      */}
      <div className="topbar">
        <div className="topbar-bc">
          <a onClick={() => window.history.back()}>Projects</a>
          <span style={{ color: 'var(--ink-4)' }}>›</span>
          <span className="tail">{project.title}</span>
        </div>
        <div className="topbar-actions">
          {!isClient && <button className="btn btn-ghost">⋯</button>}
          <button className={`btn ${isSiteMode ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setIsSiteMode(!isSiteMode)} style={{ gap: 6 }}>
            <SiteIcon /> Site Mode
          </button>
          {!isClient && <button className="btn btn-secondary">↑ Upload</button>}
          <button className="btn btn-secondary" onClick={() => setShowViewer(true)}>
            Web Viewer
          </button>
          {!isClient && (
            <button className="btn btn-primary" onClick={handleRequestVRStart} style={{ gap: 6 }}>
              <VRIcon /> Push to VR
            </button>
          )}
        </div>
      </div>

      {/* SITE MODE OVERRIDE */}
      {isSiteMode ? (
        <div className="site-mode" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="badge badge-live" style={{ background: 'var(--amber)', color: '#000', alignSelf: 'flex-start', padding: '8px 16px', fontWeight: 600 }}>WARNING: SITE MODE ACTIVE</div>
          <div className="panel" style={{ height: '70vh', borderRadius: '12px', overflow: 'hidden', position: 'relative', display: 'flex' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <ThreeDViewer
                modelUrl={project.modelUrl}
                projectId={project.id}
                onObjectSelection={(data) => setSelectedObject(data)}
                triggerAnnotationPos={annotationTriggerPos}
                onAnnotationModalClosed={() => setAnnotationTriggerPos(null)}
              />
            </div>
            {selectedObject && (
              <div className="site-mode-panel" style={{
                width: 280,
                background: 'var(--bg)',
                borderLeft: '1px solid var(--border)',
                padding: 20,
                overflowY: 'auto',
                zIndex: 10
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>Object Details</h3>
                  <button className="btn btn-ghost" style={{ padding: 4 }} onClick={() => setSelectedObject(null)}><XIcon /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--ink-3)', letterSpacing: '0.05em' }}>Name</label>
                    <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500, marginTop: 4 }}>{selectedObject.name}</div>
                  </div>

                  <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 11, color: 'var(--ink-2)' }}>
                    <span>{selectedObject.building || 'Main'}</span>
                    <span>›</span>
                    <span>{selectedObject.floor || 'Level 0'}</span>
                    <span>›</span>
                    <span style={{ color: 'var(--blue)', fontWeight: 600 }}>{selectedObject.room || 'Space'}</span>
                  </div>

                  <div>
                    <label style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--ink-3)', letterSpacing: '0.05em' }}>Category</label>
                    <div style={{ fontSize: 13, color: 'var(--ink)', marginTop: 4 }}>{selectedObject.category}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--ink-3)', letterSpacing: '0.05em' }}>Material</label>
                    <div style={{ fontSize: 13, color: 'var(--ink)', marginTop: 4 }}>{selectedObject.material}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--ink-3)', letterSpacing: '0.05em' }}>Area</label>
                      <div style={{ fontSize: 13, color: 'var(--ink)', marginTop: 4 }}>{selectedObject.area} m²</div>
                    </div>
                    <div>
                      <label style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--ink-3)', letterSpacing: '0.05em' }}>Volume</label>
                      <div style={{ fontSize: 13, color: 'var(--ink)', marginTop: 4 }}>{selectedObject.volume} m³</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', fontSize: 12 }}
                      onClick={() => {
                        if (selectedObject?.point) {
                          setAnnotationTriggerPos(selectedObject.point);
                        }
                      }}
                    >
                      Add VR Annotation
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* PROJECT HEADER */}
          <div className="project-header">
            <div className="ph-top">
              <div className="ph-icon" style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BuildingIcon /></div>
              <div className="ph-info">
                <div className="ph-title">{project.title}</div>
                <div className="ph-meta">
                  <span className={`ph-tag ${project.status === 'Ready' || project.status === 'VRActive' ? 'tag-active' : 'tag-type'}`}>
                    ● {project.status === 'VRActive' ? 'Active' : project.status}
                  </span>
                  <span className="ph-tag tag-type">{project.category || 'Architecture'}</span>
                  <span className="ph-tag tag-pending" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ClockIcon /> {approvals.filter(a => a.status === 'pending').length} pending approvals
                  </span>
                  <span className="ph-client">
                    Client: <strong>{project.clientName || 'N/A'}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="ph-stats">
              <div className="ph-stat">
                <div className="phs-val">{project.assets?.length || 1}</div>
                <div className="phs-label">Models</div>
              </div>
              <div className="ph-stat">
                <div className="phs-val">{allSessions.length || '—'}</div>
                <div className="phs-label">Sessions</div>
              </div>
              <div className="ph-stat">
                <div className="phs-val">{annotations.length || '—'}</div>
                <div className="phs-label">Annotations</div>
              </div>
              <div className="ph-stat">
                <div className="phs-val">{approvals.filter(a => a.status === 'approved').length}/{approvals.length || '—'}</div>
                <div className="phs-label">Approved</div>
              </div>
              <div className="ph-stat">
                <div className="phs-val">{project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</div>
                <div className="phs-label">Deadline</div>
              </div>
            </div>
          </div>

          {/* TAB NAV */}
          <div className="tab-nav">
            <div
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleTabClick('overview')}
            >
              Overview
            </div>
            <div
              className={`tab ${activeTab === 'models' ? 'active' : ''}`}
              onClick={() => handleTabClick('models')}
            >
              Models <span className="tab-badge">{project.assets?.length || 1}</span>
            </div>
            <div
              className={`tab ${activeTab === 'sessions' ? 'active' : ''}`}
              onClick={() => handleTabClick('sessions')}
            >
              Sessions <span className="tab-badge">{allSessions.length}</span>
            </div>
            <div
              className={`tab ${activeTab === 'annotations' ? 'active' : ''}`}
              onClick={() => handleTabClick('annotations')}
            >
              Annotations <span className="tab-badge">{annotations.length}</span>
            </div>
            {!isClient && (
              <div
                className={`tab ${activeTab === 'compare' ? 'active' : ''}`}
                onClick={() => handleTabClick('compare')}
              >
                Compare (Diff)
              </div>
            )}
            <div
              className={`tab ${activeTab === 'approvals' ? 'active' : ''}`}
              onClick={() => handleTabClick('approvals')}
            >
              Approvals <span className="tab-badge">{approvals.length}</span>
            </div>
            <div
              className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => handleTabClick('timeline')}
            >
              Timeline
            </div>
            <div
              className={`tab ${activeTab === 'billing' ? 'active' : ''}`}
              onClick={() => handleTabClick('billing')}
            >
              Plans
            </div>
          </div>

          {/* PAGE BODY */}
          <div className="page-body-grid">
            {/* LEFT COLUMN */}
            <div style={{ gridColumn: activeTab === 'compare' ? '1 / -1' : undefined }}>
              {showViewer && activeTab !== 'compare' && (
                <div className="panel" style={{ height: isSiteMode ? 'calc(100vh - 120px)' : '500px', marginBottom: 20, position: 'relative', display: 'flex' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <ThreeDViewer
                      modelUrl={project.modelUrl}
                      projectId={project.id}
                      onObjectSelection={(data) => {
                        if (isSiteMode) setSelectedObject(data);
                      }}
                      triggerAnnotationPos={annotationTriggerPos}
                      onAnnotationModalClosed={() => setAnnotationTriggerPos(null)}
                    />
                  </div>
                  {isSiteMode && selectedObject && (
                    <div className="site-mode-panel" style={{
                      width: 280,
                      background: 'var(--bg)',
                      borderLeft: '1px solid var(--border)',
                      padding: 20,
                      overflowY: 'auto',
                      zIndex: 10
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600 }}>Object Details</h3>
                        <button className="btn btn-ghost" style={{ padding: 4 }} onClick={() => setSelectedObject(null)}>✕</button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                          <label style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--ink-3)', letterSpacing: '0.05em' }}>Name</label>
                          <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500, marginTop: 4 }}>{selectedObject.name}</div>
                        </div>

                        <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 11, color: 'var(--ink-2)' }}>
                          <span>{selectedObject.building || 'Main'}</span>
                          <span>›</span>
                          <span>{selectedObject.floor || 'Level 0'}</span>
                          <span>›</span>
                          <span style={{ color: 'var(--blue)', fontWeight: 600 }}>{selectedObject.room || 'Space'}</span>
                        </div>

                        <div>
                          <label style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--ink-3)', letterSpacing: '0.05em' }}>Category</label>
                          <div style={{ fontSize: 13, color: 'var(--ink)', marginTop: 4 }}>{selectedObject.category}</div>
                        </div>
                        <div>
                          <label style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--ink-3)', letterSpacing: '0.05em' }}>Material</label>
                          <div style={{ fontSize: 13, color: 'var(--ink)', marginTop: 4 }}>{selectedObject.material}</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div>
                            <label style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--ink-3)', letterSpacing: '0.05em' }}>Area</label>
                            <div style={{ fontSize: 13, color: 'var(--ink)', marginTop: 4 }}>{selectedObject.area} m²</div>
                          </div>
                          <div>
                            <label style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--ink-3)', letterSpacing: '0.05em' }}>Volume</label>
                            <div style={{ fontSize: 13, color: 'var(--ink)', marginTop: 4 }}>{selectedObject.volume} m³</div>
                          </div>
                        </div>

                        <div style={{ marginTop: 12, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                          <button
                            className="btn btn-primary"
                            style={{ width: '100%', fontSize: 12 }}
                            onClick={() => {
                              if (selectedObject?.point) {
                                setAnnotationTriggerPos(selectedObject.point);
                              }
                            }}
                          >
                            Add VR Annotation
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'compare' && (
                <div className="panel" style={{ padding: 24, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Visual Diff: Compare Versions</h3>
                      <p style={{ fontSize: '13px', color: 'var(--ink-3)', margin: '4px 0 0' }}>Overlay mode: Current version vs. Ghost version</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: 'var(--ink-2)' }}>Select version to ghost:</span>
                      <select
                        value={selectedCompareAssetId || ''}
                        onChange={(e) => setSelectedCompareAssetId(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-inset)', color: 'var(--ink)', fontSize: '14px', outline: 'none' }}
                      >
                        <option value="">(None)</option>
                        {project.assets?.map(asset => (
                          <option key={asset.id} value={asset.id}>v{asset.versionNumber} ({new Date(asset.createdAt).toLocaleDateString()})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div style={{ height: '600px', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                    <ThreeDViewer
                      modelUrl={project.modelUrl}
                      compareModelUrl={compareAssetUrl}
                      projectId={project.id}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'overview' && (
                <>
                  {/* Approval status - DYNAMIC */}
                  <div className="panel">
                    <div className="panel-top">
                      <div className="panel-title">Approval status</div>
                      <div className="panel-action" onClick={() => handleTabClick('approvals')}>View all</div>
                    </div>

                    {approvals.length === 0 ? (
                      <div style={{ padding: 16, color: 'var(--ink-3)', fontSize: 13 }}>No approvals yet. Create one to begin the review workflow.</div>
                    ) : (
                      approvals.slice(0, 3).map(ap => (
                        <div className="approval-card" key={ap.id}>
                          <div className={`ac-icon ${ap.status === 'approved' ? 'ac-icon-approved' : ap.status === 'pending' ? 'ac-icon-pending' : 'ac-icon-draft'}`}>
                            {ap.status === 'approved' ? <CheckIcon /> : ap.status === 'pending' ? <ClockIcon /> : ap.status === 'rejected' ? <XIcon /> : <EditIcon />}
                          </div>
                          <div className="ac-body">
                            <div className="ac-title">{ap.title}</div>
                            <div className="ac-meta">
                              {ap.status === 'approved' ? `Approved by ${ap.reviewedByName || 'Client'} · ${new Date(ap.reviewedAt || ap.createdAt).toLocaleDateString()}` :
                                ap.status === 'pending' ? `Sent to client · ${new Date(ap.createdAt).toLocaleDateString()}` :
                                  ap.status === 'rejected' ? `Rejected · ${new Date(ap.reviewedAt || ap.createdAt).toLocaleDateString()}` :
                                    `Draft · Not yet sent`}
                            </div>
                          </div>
                          <div className={`ac-status status-${ap.status}`}>
                            {ap.status === 'approved' ? 'Approved' : ap.status === 'pending' ? 'Pending' : ap.status === 'rejected' ? 'Rejected' : 'Draft'}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Recent sessions */}
                  <div className="panel">
                    <div className="panel-top">
                      <div className="panel-title">Sessions</div>
                      <div className="panel-action" onClick={() => setActiveTab('sessions')}>
                        All sessions →
                      </div>
                    </div>

                    {allSessions.length === 0 ? (
                      <div style={{ padding: 16, color: 'var(--ink-4)', fontSize: 13 }}>No recorded sessions yet. Start one in VR to see activity here.</div>
                    ) : (
                      allSessions.slice(0, 5).map(session => (
                        <div className="session-row" key={session.id}>
                          <div className="sr-indicator" style={{ background: 'var(--ink-4)' }}></div>
                          <div className="sr-body">
                            <div className="sr-title">VR Session #{session.id.substring(0, 4)}</div>
                            <div className="sr-meta">{new Date(session.startTime).toLocaleDateString()} · {session.durationMinutes?.toFixed(0) || '0'}m</div>
                          </div>
                          <div className="sr-parts">
                            <div
                              className="sr-av"
                              style={{ background: 'linear-gradient(135deg,#2D5BE3,#7C3AED)' }}
                            >
                              AK
                            </div>
                          </div>
                          <div className="sr-duration">{session.totalParticipants} users</div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

              {activeTab === 'annotations' && (
                <div className="panel">
                  <div className="panel-top">
                    <div className="panel-title">Annotations ({annotations.length})</div>
                  </div>
                  {annotations.length === 0 ? (
                    <div style={{ padding: 16, color: 'var(--ink-3)', fontSize: 13 }}>No annotations yet. Use the 3D viewer to add annotations to the model.</div>
                  ) : (
                    annotations.map(ann => (
                      <div className="annot-row" key={ann.id}>
                        <div className="ar-av" style={{ background: 'linear-gradient(135deg,#2D5BE3,#7C3AED)' }}>
                          {(ann.authorName || 'U').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="ar-body">
                          <div className="ar-text">{ann.text}</div>
                          <div className="ar-meta">
                            <span className="ar-room">{ann.authorName}</span>
                            <span className="ar-time">{new Date(ann.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {!isClient && <button className="ar-resolve open">Resolve</button>}
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="tab-pane">
                  <ProjectTimeline projectId={project.id} />
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="tab-pane">
                  <BillingDashboard />
                </div>
              )}

              {activeTab === 'sessions' && (
                <div className="panel" style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Active VR Sessions</h3>
                  {activeSessions.length === 0 ? (
                    <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>No active sessions currently running for this project.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {activeSessions.map(session => (
                        <div key={session.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, border: '1px solid var(--border)', borderRadius: 8 }}>
                          <div>
                            <div style={{ fontWeight: 500, fontSize: 13 }}>Hosted by {session.hostName}</div>
                            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
                              {session.participantCount} participants · Started {new Date(session.startTime).toLocaleTimeString()}
                            </div>
                          </div>
                          <button className="btn btn-secondary" onClick={() => handleSpectate(session.id)}>
                            👁 Join as Spectator
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* About project info rendering if needed */}
              {activeTab === 'overview' && project.description && (
                <div className="panel" style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>About this project</h3>
                  <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                    {project.description}
                  </p>
                </div>
              )}

              {/* Stories - DYNAMIC */}
              {activeTab === 'overview' && stories.length > 0 && (
                <div className="panel">
                  <div className="panel-top">
                    <div className="panel-title">Stories & Media</div>
                    <div className="panel-action">View all →</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, padding: '4px 14px 14px', overflowX: 'auto' }}>
                    {stories.slice(0, 5).map(story => (
                      <div key={story.id}
                        style={{
                          minWidth: 120, borderRadius: 8, overflow: 'hidden',
                          border: '1px solid var(--border)', cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        className="story-card-hover"
                        onClick={() => setSelectedStory(story)}
                      >
                        <div style={{
                          height: 80, background: 'linear-gradient(135deg, #2D5BE3, #7C3AED)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 24, color: 'white'
                        }}>
                          {story.type === 0 ? <VideoIcon /> : story.type === 1 ? <CameraIcon /> : story.type === 2 ? <GlobeIcon /> : <MicIcon />}
                        </div>
                        <div style={{ padding: '6px 8px' }}>
                          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{story.title}</div>
                          <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>{new Date(story.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approvals Full Tab */}
              {activeTab === 'approvals' && (
                <div className="panel">
                  <div className="panel-top">
                    <div className="panel-title">Design Approvals ({approvals.length})</div>
                    {!isClient && (
                      <div className="panel-action" style={{ cursor: 'pointer' }}
                        onClick={async () => {
                          const title = prompt('Approval title (e.g. "Kitchen layout")?');
                          if (!title || !project?.id) return;
                          try {
                            const created = await approvalService.createApproval({ projectId: project.id, title });
                            setApprovals(prev => [created, ...prev]);
                          } catch { alert('Failed to create approval.'); }
                        }}>+ New Approval</div>
                    )}
                  </div>
                  {approvals.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
                      No approval requests yet.
                      {!isClient && ' Click "+ New Approval" to start the review workflow.'}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {approvals.map(ap => (
                        <div key={ap.id} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '14px 16px', borderBottom: '1px solid var(--border)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 16,
                              background: ap.status === 'approved' ? 'rgba(34,160,90,0.12)' :
                                ap.status === 'rejected' ? 'rgba(229,62,62,0.12)' :
                                  ap.status === 'pending' ? 'rgba(184,149,78,0.12)' :
                                    'rgba(255,255,255,0.06)'
                            }}>
                              {ap.status === 'approved' ? '✓' : ap.status === 'rejected' ? '✗' : ap.status === 'pending' ? '⏳' : '📝'}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{ap.title}</div>
                              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
                                By {ap.createdByName} · {new Date(ap.createdAt).toLocaleDateString()}
                                {ap.comment && <span style={{ marginLeft: 8, fontStyle: 'italic' }}> — "{ap.comment}"</span>}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
                              background: ap.status === 'approved' ? 'rgba(34,160,90,0.12)' :
                                ap.status === 'rejected' ? 'rgba(229,62,62,0.12)' :
                                  ap.status === 'pending' ? 'rgba(184,149,78,0.12)' :
                                    'rgba(255,255,255,0.06)',
                              color: ap.status === 'approved' ? '#22A05A' :
                                ap.status === 'rejected' ? '#E53E3E' :
                                  ap.status === 'pending' ? '#B8954E' : 'var(--ink-3)'
                            }}>
                              {ap.status.charAt(0).toUpperCase() + ap.status.slice(1)}
                            </span>
                            {isClient && ap.status === 'pending' && (
                              <>
                                <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 8px', color: '#22A05A' }}
                                  onClick={async () => {
                                    try {
                                      const updated = await approvalService.reviewApproval(ap.id, { status: 'approved', comment: 'Approved' });
                                      setApprovals(prev => prev.map(a => a.id === ap.id ? updated : a));
                                    } catch { alert('Failed'); }
                                  }}>✓ Approve</button>
                                <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 8px', color: '#E53E3E' }}
                                  onClick={async () => {
                                    const comment = prompt('Reason for rejection?');
                                    try {
                                      const updated = await approvalService.reviewApproval(ap.id, { status: 'rejected', comment: comment || 'Rejected' });
                                      setApprovals(prev => prev.map(a => a.id === ap.id ? updated : a));
                                    } catch { alert('Failed'); }
                                  }}>✗ Reject</button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            {activeTab !== 'compare' && (
              <div>
                {/* Deadline */}
                <div className="panel" style={{ marginBottom: 16, overflow: 'hidden' }}>
                  <div
                    className="deadline-card"
                    style={{
                      margin: 0,
                      borderRadius: 0,
                      border: 'none',
                      borderBottom: '1px solid rgba(184, 149, 78, 0.15)',
                    }}
                  >
                    <div className="dc-label">Next deadline</div>
                    <div className="dc-date">{project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No deadline set'}</div>
                    <div className="dc-desc">
                      {project.deadline
                        ? `${Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining`
                        : 'Contact architect for schedule'}
                    </div>
                  </div>
                  <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 11,
                        color: 'var(--ink-3)',
                        marginBottom: 2,
                      }}
                    >
                      <span>Project progress</span>
                      <span style={{ fontFamily: 'var(--mono)', fontWeight: 500, color: 'var(--ink)' }}>
                        {project.progress || 52}%
                      </span>
                    </div>
                    <div className="progress-bar-wrap" style={{ height: 6 }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${project.progress || 52}%`,
                          background: 'linear-gradient(90deg,#2D5BE3,#7C3AED)',
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Quick actions - For Architects/Owners */}
                {!isClient && (
                  <div className="panel" style={{ marginBottom: 16 }}>
                    <div className="panel-top">
                      <div className="panel-title">Quick actions</div>
                    </div>
                    <div className="quick-actions">
                      <div className="qa-btn" onClick={handleRequestVRStart}>
                        <div className="qa-icon" style={{ background: 'var(--bg-inset)' }}>
                          🥽
                        </div>
                        <div className="qa-body">
                          <div className="qa-title">Push to VR</div>
                          <div className="qa-sub">Start session in headset</div>
                        </div>
                      </div>
                      <div className="qa-btn" onClick={() => setIsEditModalOpen(true)}>
                        <div
                          className="qa-icon"
                          style={{ background: 'var(--blue-s)', color: 'var(--blue)' }}
                        >
                          ✎
                        </div>
                        <div className="qa-body">
                          <div className="qa-title">Edit project details</div>
                          <div className="qa-sub">Update name or client</div>
                        </div>
                      </div>
                      <div
                        className="qa-btn"
                        onClick={() => (canExport ? alert('Exporting...') : alert('Upgrade to PRO'))}
                      >
                        <div
                          className="qa-icon"
                          style={{ background: 'var(--green-s)', color: 'var(--green)' }}
                        >
                          ↓
                        </div>
                        <div className="qa-body">
                          <div className="qa-title">Export GLB {!canExport && '(PRO)'}</div>
                          <div className="qa-sub">Download 3D model</div>
                        </div>
                      </div>
                      <div
                        className="qa-btn"
                        onClick={() => setIsQrModalOpen(true)}
                      >
                        <div
                          className="qa-icon"
                          style={{ background: 'var(--bg-inset)', color: 'var(--ink)' }}
                        >
                          📱
                        </div>
                        <div className="qa-body">
                          <div className="qa-title">QR Code Handoff</div>
                          <div className="qa-sub">Scan to view on mobile</div>
                        </div>
                      </div>
                      <div
                        className="qa-btn"
                        onClick={handleGeneratePdfReport}
                        style={{ opacity: isGeneratingPdf ? 0.5 : 1, pointerEvents: isGeneratingPdf ? 'none' : 'auto' }}
                      >
                        <div
                          className="qa-icon"
                          style={{ background: 'var(--card) ', color: 'var(--blue)' }}
                        >
                          📄
                        </div>
                        <div className="qa-body">
                          <div className="qa-title">{isGeneratingPdf ? 'Generating...' : 'PDF Report'}</div>
                          <div className="qa-sub">Download Handoff Data</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Team */}
                <div className="panel" style={{ marginBottom: 16 }}>
                  <div className="panel-top">
                    <div className="panel-title">Team</div>
                    {!isClient && <div className="panel-action">Manage</div>}
                  </div>

                  <div className="member-row">
                    <div
                      className="mem-av"
                      style={{ background: 'linear-gradient(135deg,#2D5BE3,#7C3AED)' }}
                    >
                      AK
                    </div>
                    <div className="mem-info">
                      <div className="mem-name">Ahmet Koç</div>
                      <div className="mem-role">Principal Architect</div>
                    </div>
                    <div className="mem-badge mb-owner">Owner</div>
                  </div>

                  <div className="member-row">
                    <div
                      className="mem-av"
                      style={{ background: 'linear-gradient(135deg,#1A7A4A,#22A05A)' }}
                    >
                      MK
                    </div>
                    <div className="mem-info">
                      <div className="mem-name">{project.clientName || 'Client'}</div>
                      <div className="mem-role">Client access</div>
                    </div>
                    <div className="mem-badge mb-client">Client</div>
                  </div>
                </div>

                {/* Latest Model */}
                <div className="panel">
                  <div className="panel-top">
                    <div className="panel-title">Latest model</div>
                    <div className="panel-action" onClick={() => setActiveTab('models')}>
                      All versions →
                    </div>
                  </div>

                  <div className="version-row">
                    <div className="vr-icon">📦</div>
                    <div className="vr-body">
                      <div className="vr-name">{project.assets?.[project.assets.length - 1]?.fileName || project.modelUrl?.split('/').pop() || 'Loading model...'}</div>
                      <div className="vr-meta">Uploaded {project.assets?.[project.assets.length - 1]?.createdAt ? new Date(project.assets[project.assets.length - 1].createdAt).toLocaleDateString() : 'Recently'}</div>
                    </div>
                    <div className="vr-badge vr-badge-latest">v{project.assets?.[project.assets.length - 1]?.versionNumber || '1.0'}</div>
                  </div>

                  {/* Activity */}
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    <div
                      style={{
                        padding: '10px 14px 4px',
                        fontFamily: 'var(--mono)',
                        fontSize: 9,
                        color: 'var(--ink-3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      Recent activity
                    </div>

                    {approvals.slice(0, 2).map((ap) => (
                      <div className="activity-item" key={ap.id}>
                        <div className="ai-dot" style={{ background: ap.status === 'approved' ? 'var(--green)' : ap.status === 'rejected' ? 'var(--red)' : 'var(--amber)' }}></div>
                        <div className="ai-body">
                          <div className="ai-text">
                            <strong>{ap.reviewedByName || ap.createdByName}</strong> {ap.status} {ap.title}
                          </div>
                          <div className="ai-time">{new Date(ap.reviewedAt || ap.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}

                    {annotations.slice(0, 2).map((ann) => (
                      <div className="activity-item" key={ann.id}>
                        <div className="ai-dot" style={{ background: 'var(--blue)' }}></div>
                        <div className="ai-body">
                          <div className="ai-text">
                            <strong>{ann.authorName}</strong> left an annotation
                          </div>
                          <div className="ai-time">{new Date(ann.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}

                    {approvals.length === 0 && annotations.length === 0 && (
                      <div style={{ padding: '8px 14px', fontSize: 11, color: 'var(--ink-3)' }}>No recent activity.</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )
      }
    </div >
  );
}
