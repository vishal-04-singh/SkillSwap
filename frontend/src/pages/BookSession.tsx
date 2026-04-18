import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';

import { skillsApi, sessionsApi } from '../services/api';
import toast from 'react-hot-toast';
import { UserSkill } from '../types';

export default function BookSession() {
  const { mentorId } = useParams<{ mentorId: string }>();
  const [mentorSkills, setMentorSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<UserSkill | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_date: '',
    scheduled_time: '',
  });

  useEffect(() => {
    fetchData();
  }, [mentorId]);

  const fetchData = async () => {
    try {
      const skillsRes = await skillsApi.getUserSkills(mentorId as string);
      setMentorSkills(skillsRes.data.data);
    } catch (error) {
      toast.error('Failed to load mentor data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkill) return;

    try {
      const scheduledDate = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`);
      await sessionsApi.create({
        mentor_id: mentorId as string,
        skillId: selectedSkill.skillId,
        title: formData.title,
        description: formData.description,
        scheduled_date: scheduledDate.toISOString(),
      });
      toast.success('Session request sent!');
      setModalOpen(false);
      setFormData({ title: '', description: '', scheduled_date: '', scheduled_time: '' });
      setTimeout(() => window.location.href = '/sessions', 1500);
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.message || 'Failed to book session';
      toast.error(message);
    }
  };

  

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <Link to="/browse" className="flex items-center gap-2 text-zinc-400 hover:text-white mb-4">
            <ArrowLeft size={18} />
            Back to Browse
          </Link>
          <h1 className="text-3xl font-bold">Book a Session</h1>
          <p className="text-zinc-400 mt-1">Select a skill and schedule your learning session.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-semibold mb-4">Available Skills</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mentorSkills.map((us) => (
                  <motion.div
                    key={us.id}
                    whileHover={{ scale: 1.02 }}
                    className="card card-hover cursor-pointer"
                    onClick={() => {
                      setSelectedSkill(us);
                      setFormData({ ...formData, title: `${us.skill.name} Session` });
                      setModalOpen(true);
                    }}
                  >
                    <h3 className="font-semibold text-lg">{us.skill.name}</h3>
                    <p className="text-sm text-zinc-400">{us.skill.category?.name}</p>
                    <div className="mt-3 flex items-center gap-3 text-sm">
                      <span className="px-2 py-1 bg-surface rounded-full capitalize">
                        {us.proficiency_level}
                      </span>
                      <span className="text-zinc-400">
                        {us.years_of_experience} years
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Book: ${selectedSkill?.skill.name}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Session Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="e.g., Introduction to Python"
              required
            />
          </div>

          <div>
            <label className="label">Description (optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field min-h-[80px] resize-none"
              placeholder="What would you like to learn?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label flex items-center gap-2">
                <Calendar size={14} />
                Date
              </label>
              <input
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <label className="label flex items-center gap-2">
                <Clock size={14} />
                Time
              </label>
              <input
                type="time"
                value={formData.scheduled_time}
                onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>

          <button type="submit" className="pill-btn pill-btn-primary w-full mt-6">
            Request Session
          </button>
        </form>
      </Modal>
    </Layout>
  );
}
