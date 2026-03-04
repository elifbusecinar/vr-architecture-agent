import { useState, type ReactNode } from 'react';

// ─── ICONS ──────────────────────────────────────────────────────────────────
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 8l3.5 4L13 4" /></svg>;
const VRIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9h18M3 15h18M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" /><path d="M12 9v6" /></svg>;
const PencilIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 2l3 3-9 9H2v-3l9-9zM9 4l3 3" /></svg>;
const UserIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="5" r="3" /><path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" /></svg>;
const WarningIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2.5l6.5 11H1.5l6.5-11z" /><path d="M8 6v4m0 2h.01" /></svg>;
const BillingIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="2" width="10" height="12" rx="1" /><path d="M6 5h4M6 8h4M6 11h2" /></svg>;
const BellIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>;
const ArrowRight = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 8h14M8 1l7 7-7 7" /></svg>;

interface NotifDetail {
  icon: ReactNode;
  cls: string;
  title: string;
  meta: string;
  body: string;
  cards: { label: string; value: string }[];
  cta: string;
}

const TABS = ['All', 'Sessions', 'Approvals', 'Team', 'System'];

const NOTIFICATIONS: {
  day: string;
  items: {
    icon: ReactNode;
    cls: string;
    title: string;
    time: string;
    text: string;
    unread?: boolean;
    detail: NotifDetail;
  }[];
}[] = [
    {
      day: 'Today',
      items: [
        {
          icon: <CheckIcon />,
          cls: 'av-green',
          title: 'Design approved — Unit 14B',
          time: '15:17',
          unread: true,
          text: 'Martin & Co. signed off on the Skyline Tower Unit 14B design.',
          detail: {
            icon: <CheckIcon />,
            cls: 'av-green',
            title: 'Design approved — Unit 14B',
            meta: 'Today · 15:17 · Skyline Tower project',
            body: 'Martin & Co. has reviewed and signed off on the Skyline Tower Unit 14B design. Their digital approval has been recorded with a timestamp and is attached to the project timeline.',
            cards: [
              { label: 'Project', value: 'Skyline Tower — Unit 14B' },
              { label: 'Approved by', value: 'Martin & Co. · 15:17 UTC+3' },
              { label: 'Next step', value: 'Final drawings to be issued by Mar 15' },
            ],
            cta: 'View project',
          },
        },
        {
          icon: <VRIcon />,
          cls: 'av-blue',
          title: 'Session started — Bebek Villa',
          time: '14:02',
          unread: true,
          text: 'Elif Kaya and the client joined a VR session on BebbeVilla_Exterior_Final.',
          detail: {
            icon: <VRIcon />,
            cls: 'av-blue',
            title: 'Session started — Bebek Villa',
            meta: 'Today · 14:02 · Bebek Villa project',
            body: 'Elif Kaya and the client started a live VR session on BebbeVilla_Exterior_Final.gltf. 2 participants are currently active.',
            cards: [
              { label: 'Model', value: 'BebbeVilla_Exterior_Final.gltf' },
              { label: 'Participants', value: 'Elif Kaya + 1 client' },
              { label: 'Started', value: '14:02 · still active' },
            ],
            cta: 'Join session',
          },
        },
        {
          icon: <PencilIcon />,
          cls: 'av-amber',
          title: '3 new annotations — Skyline Tower',
          time: '13:45',
          unread: true,
          text: 'Martin left notes on the living room window and kitchen counter height.',
          detail: {
            icon: <PencilIcon />,
            cls: 'av-amber',
            title: '3 new annotations',
            meta: 'Today · 13:45 · Skyline Tower project',
            body: 'Martin left 3 annotations during the walkthrough session: one on the living room window sill height, one on the kitchen counter, and one approving the master bedroom.',
            cards: [
              { label: 'Session', value: 'Client walkthrough #3' },
              { label: 'Annotated by', value: 'Martin (client)' },
              { label: 'Unresolved', value: '2 of 3 need action' },
            ],
            cta: 'Review annotations',
          },
        },
        {
          icon: <UserIcon />,
          cls: 'av-blue',
          title: 'New team member joined',
          time: '10:30',
          unread: true,
          text: 'Jonas Veld accepted your invitation and joined Studio Koç.',
          detail: {
            icon: <UserIcon />,
            cls: 'av-blue',
            title: 'New team member joined',
            meta: 'Today · 10:30',
            body: 'Jonas Veld accepted your invitation and joined the Studio Koç workspace with the role "Designer".',
            cards: [
              { label: 'Name', value: 'Jonas Veld' },
              { label: 'Role', value: 'Designer' },
              { label: 'Joined', value: 'Today at 10:30' },
            ],
            cta: 'View team',
          },
        },
      ],
    },
    {
      day: 'Yesterday',
      items: [
        {
          icon: <WarningIcon />,
          cls: 'av-amber',
          title: 'Storage at 80% capacity',
          time: '18:55',
          text: 'Your workspace is using 40.1 GB of 50 GB. Consider upgrading or archiving old models.',
          detail: {
            icon: <WarningIcon />,
            cls: 'av-amber',
            title: 'Storage at 80% capacity',
            meta: 'Yesterday · 18:55',
            body: 'Your workspace is currently using 40.1 GB of your 50 GB storage limit. To avoid disruption, consider upgrading your plan or archiving models you no longer need.',
            cards: [
              { label: 'Used', value: '40.1 GB of 50 GB' },
              { label: 'Largest folder', value: 'Bodrum Resort (12.3 GB)' },
              { label: 'Recommendation', value: 'Archive or upgrade' },
            ],
            cta: 'Manage storage',
          },
        },
        {
          icon: <VRIcon />,
          cls: 'av-green',
          title: 'Session completed — Nişantaşı Office',
          time: '16:10',
          text: '47-minute session with 2 participants. 5 annotations recorded.',
          detail: {
            icon: <VRIcon />,
            cls: 'av-green',
            title: 'Session completed — Nişantaşı Office',
            meta: 'Yesterday · 16:10',
            body: 'A 47-minute session was completed with 2 participants. 5 annotations were left during the walkthrough.',
            cards: [
              { label: 'Duration', value: '47 minutes' },
              { label: 'Participants', value: '2' },
              { label: 'Annotations', value: '5 notes recorded' },
            ],
            cta: 'View replay',
          },
        },
        {
          icon: <BillingIcon />,
          cls: 'av-inset',
          title: 'Invoice #INV-0024 generated',
          time: '09:00',
          text: 'Your February invoice of €149 is ready. Due Mar 5, 2026.',
          detail: {
            icon: <BillingIcon />,
            cls: 'av-inset',
            title: 'Invoice #INV-0024 generated',
            meta: 'Yesterday · 09:00',
            body: 'Your February 2026 invoice has been generated and is ready for review. Payment is due on March 5, 2026.',
            cards: [
              { label: 'Amount', value: '€149.00' },
              { label: 'Plan', value: 'Pro · 5 seats' },
              { label: 'Due date', value: 'March 5, 2026' },
            ],
            cta: 'View invoice',
          },
        },
      ],
    },
  ];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedKey, setSelectedKey] = useState('0-0');
  const [readItems, setReadItems] = useState<Set<string>>(new Set());
  const [allRead, setAllRead] = useState(false);

  const selected = (() => {
    const [dayIdx, itemIdx] = selectedKey.split('-').map(Number);
    return NOTIFICATIONS[dayIdx]?.items[itemIdx]?.detail;
  })();

  const unreadCount = allRead
    ? 0
    : NOTIFICATIONS.flatMap((g, di) =>
      g.items.filter((n, ni) => n.unread && !readItems.has(`${di}-${ni}`)),
    ).length;

  const handleSelect = (dayIdx: number, itemIdx: number) => {
    const key = `${dayIdx}-${itemIdx}`;
    setSelectedKey(key);
    setReadItems(prev => new Set(prev).add(key));
  };

  const markAllRead = () => setAllRead(true);

  return (
    <div className="notif-page-body">
      <div className="notif-list">
        <div className="notif-tabs">
          {TABS.map((tab, i) => (
            <div
              key={tab}
              className={`ntab${activeTab === i ? ' active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
              {i === 0 && unreadCount > 0 && <span className="ntab-count">{unreadCount}</span>}
            </div>
          ))}
        </div>

        {NOTIFICATIONS.map((group, dayIdx) => (
          <div key={group.day} className="day-group">
            <div className="day-label">{group.day}</div>
            {group.items.map((item, itemIdx) => {
              const key = `${dayIdx}-${itemIdx}`;
              const isUnread = item.unread && !readItems.has(key) && !allRead;
              return (
                <div
                  key={key}
                  className={`notif-item${isUnread ? ' unread' : ''}${selectedKey === key ? ' selected' : ''}`}
                  onClick={() => handleSelect(dayIdx, itemIdx)}
                >
                  <div className={`ni-icon ${item.cls}`}>{item.icon}</div>
                  <div className="ni-body">
                    <div className="ni-top">
                      <div className="ni-title">{item.title}</div>
                      <div className="ni-time">{item.time}</div>
                    </div>
                    <div className="ni-text">{item.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="notif-detail">
        {selected ? (
          <div style={{ animation: 'fadeUp 0.15s ease' }}>
            <div className="nd-header">
              <div className={`nd-big-icon ${selected.cls}`}>{selected.icon}</div>
              <div>
                <div className="nd-title">{selected.title}</div>
                <div className="nd-meta">{selected.meta}</div>
              </div>
            </div>
            <div className="nd-body">{selected.body}</div>
            {selected.cards.map(c => (
              <div key={c.label} className="nd-card">
                <div className="ndc-label">{c.label}</div>
                <div className="ndc-val">{c.value}</div>
              </div>
            ))}
            <div className="nd-actions">
              <button className="nd-btn nd-btn-primary">
                {selected.cta}
                <ArrowRight />
              </button>
              <button className="nd-btn nd-btn-secondary" onClick={markAllRead}>
                Dismiss
              </button>
            </div>
          </div>
        ) : (
          <div className="nd-empty">
            <div className="nd-empty-icon"><BellIcon /></div>
            <div className="nd-empty-text">Select a notification to view details</div>
          </div>
        )}
      </div>
    </div>
  );
}
