import { motion } from 'framer-motion';
import { Star, MapPin, BookOpen } from 'lucide-react';
import { User, UserSkill } from '../types';

interface MentorCardProps {
  mentor: User & { user_skills?: UserSkill[] };
  onSelect?: () => void;
  showSkills?: boolean;
}

export default function MentorCard({ mentor, onSelect, showSkills = true }: MentorCardProps) {
  const skills = mentor.user_skills?.slice(0, 3) || [];

  return (
    <motion.div
      whileHover={{ scale: 1.02, borderColor: 'rgba(62, 207, 142, 0.5)' }}
      className="card card-hover cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-medium" style={{ background: '#3ecf8e', color: '#0f0f0f' }}>
          {mentor.full_name.split(' ').map(n => n[0]).join('')}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-normal text-lg" style={{ letterSpacing: '-0.02em' }}>{mentor.full_name}</h3>
          
          <div className="flex items-center gap-4 mt-1 text-sm" style={{ color: '#898989' }}>
            {mentor.department && (
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {mentor.department}
              </span>
            )}
            {mentor.avg_rating ? (
              <span className="flex items-center gap-1" style={{ color: '#3ecf8e' }}>
                <Star size={14} fill="#3ecf8e" />
                {Number(mentor.avg_rating).toFixed(1)}
              </span>
            ) : null}
          </div>

          {showSkills && skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((us) => (
                <span
                  key={us.user_skill_id}
                  className="px-2 py-1 rounded-full text-xs flex items-center gap-1"
                  style={{ background: '#0f0f0f', color: '#b4b4b4' }}
                >
                  <BookOpen size={10} />
                  {us.skill.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
