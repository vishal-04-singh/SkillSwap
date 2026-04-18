import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import Layout from '../components/Layout';
import SessionCard from '../components/SessionCard';
import Modal from '../components/Modal';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import { sessionsApi, reviewsApi } from '../services/api';
import toast from 'react-hot-toast';
import { SkillSession } from '../types';

export default function Sessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SkillSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'pending'>('upcoming');
  const [reviewModal, setReviewModal] = useState<{ open: boolean; session: SkillSession | null }>({
    open: false,
    session: null,
  });
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await sessionsApi.getAll();
      setSessions(res.data.data);
    } catch (error) {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (sessionId: string, status: string) => {
    try {
      await sessionsApi.updateStatus(sessionId, status);
      toast.success(`Session ${status}!`);
      fetchSessions();
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.message || 'Failed to update session';
      toast.error(message);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModal.session) return;

    try {
      await reviewsApi.create({
        session_id: reviewModal.session.session_id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      toast.success('Review submitted!');
      setReviewModal({ open: false, session: null });
      setReviewData({ rating: 5, comment: '' });
      fetchSessions();
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.message || 'Failed to submit review';
      toast.error(message);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (activeTab === 'upcoming') return ['pending', 'confirmed'].includes(s.status);
    if (activeTab === 'past') return ['completed', 'cancelled'].includes(s.status);
    if (activeTab === 'pending') return s.status === 'pending';
    return true;
  });

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: sessions.filter(s => ['pending', 'confirmed'].includes(s.status)).length },
    { id: 'past', label: 'Past', count: sessions.filter(s => ['completed', 'cancelled'].includes(s.status)).length },
    { id: 'pending', label: 'Pending', count: sessions.filter(s => s.status === 'pending').length },
  ] as const;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-normal mb-2" style={{ letterSpacing: '-0.02em' }}>My Sessions</h1>
          <p style={{ color: '#898989' }}>Manage your learning and mentoring sessions.</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              style={
                activeTab === tab.id
                  ? { background: '#3ecf8e', color: '#0f0f0f' }
                  : { background: '#0f0f0f', color: '#b4b4b4' }
              }
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#3ecf8e', borderTopColor: 'transparent' }} />
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.session_id}
                session={session}
                currentUserId={user!.user_id}
                onAccept={() => handleStatusUpdate(session.session_id, 'confirmed')}
                onReject={() => handleStatusUpdate(session.session_id, 'cancelled')}
                onComplete={() => handleStatusUpdate(session.session_id, 'completed')}
                onReview={() => setReviewModal({ open: true, session })}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-16">
            <Calendar size={48} className="mx-auto mb-4" style={{ color: '#4d4d4d' }} />
            <h3 className="text-xl font-normal mb-2">No {activeTab} sessions</h3>
            <p style={{ color: '#898989' }}>
              {activeTab === 'upcoming'
                ? 'Browse mentors and book your first session!'
                : 'Your session history will appear here.'}
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={reviewModal.open}
        onClose={() => setReviewModal({ open: false, session: null })}
        title="Leave a Review"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="label">Rating</label>
            <StarRating value={reviewData.rating} onChange={(v) => setReviewData({ ...reviewData, rating: v })} />
          </div>

          <div>
            <label className="label">Comment (optional)</label>
            <textarea
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              className="input-field min-h-[100px] resize-none"
              placeholder="Share your experience..."
            />
          </div>

          <button type="submit" className="pill-btn pill-btn-primary w-full mt-4">
            Submit Review
          </button>
        </form>
      </Modal>
    </Layout>
  );
}
