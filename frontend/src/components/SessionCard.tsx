import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Clock, User } from 'lucide-react';
import { SkillSession } from '../types';

interface SessionCardProps {
  session: SkillSession;
  currentUserId: string;
  onAccept?: () => void;
  onReject?: () => void;
  onComplete?: () => void;
  onReview?: () => void;
}

const statusStyles = {
  pending: { bg: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' },
  confirmed: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
  completed: { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', border: 'rgba(62, 207, 142, 0.3)' },
  cancelled: { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
};

export default function SessionCard({
  session,
  currentUserId,
  onAccept,
  onReject,
  onComplete,
  onReview,
}: SessionCardProps) {
  const isMentor = session.mentor_id === currentUserId;
  const isMentee = session.mentee_id === currentUserId;
  const otherPerson = isMentor ? session.mentee : session.mentor;
  const statusStyle = statusStyles[session.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-normal text-lg" style={{ letterSpacing: '-0.02em' }}>{session.title}</h3>
          <p className="text-sm" style={{ color: '#898989' }}>{session.skill.name}</p>
        </div>
        <span 
          className="px-3 py-1 rounded-full text-xs font-medium border"
          style={statusStyle}
        >
          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
        </span>
      </div>

      <div className="space-y-2 text-sm" style={{ color: '#898989' }}>
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>{isMentor ? 'With: ' : 'Mentor: '}{otherPerson.full_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{format(new Date(session.scheduled_date), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>{format(new Date(session.scheduled_date), 'hh:mm a')}</span>
        </div>
      </div>

      {session.description && (
        <p className="mt-4 text-sm line-clamp-2" style={{ color: '#898989' }}>{session.description}</p>
      )}

      {session.review && (
        <div className="mt-4 p-3 rounded-lg" style={{ background: '#0f0f0f' }}>
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="text-sm"
                style={{ color: star <= session.review!.rating ? '#3ecf8e' : '#4d4d4d' }}
              >
                ★
              </span>
            ))}
          </div>
          {session.review.comment && (
            <p className="text-sm" style={{ color: '#b4b4b4' }}>{session.review.comment}</p>
          )}
        </div>
      )}

      {session.status === 'pending' && isMentor && (
        <div className="flex gap-2 mt-4">
          <button onClick={onAccept} className="pill-btn pill-btn-primary flex-1">
            Accept
          </button>
          <button onClick={onReject} className="pill-btn pill-btn-secondary flex-1">
            Reject
          </button>
        </div>
      )}

      {session.status === 'confirmed' && isMentor && (
        <button onClick={onComplete} className="pill-btn pill-btn-primary w-full mt-4">
          Mark as Completed
        </button>
      )}

      {session.status === 'completed' && isMentee && !session.review && (
        <button onClick={onReview} className="pill-btn pill-btn-primary w-full mt-4">
          Leave a Review
        </button>
      )}
    </motion.div>
  );
}
