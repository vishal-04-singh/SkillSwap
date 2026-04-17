import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Star, Bell } from 'lucide-react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { sessionsApi, notificationsApi } from '../services/api';
import { DashboardStats, Notification } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, notifRes] = await Promise.all([
          sessionsApi.getStats(),
          notificationsApi.getAll(),
        ]);
        setStats(statsRes.data.data);
        setNotifications(notifRes.data.data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#3ecf8e', borderTopColor: 'transparent' }} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-normal mb-2" style={{ letterSpacing: '-0.02em' }}>
            Welcome back, {user?.full_name?.split(' ')[0]}
          </h1>
          <p style={{ color: '#898989' }}>
            {user?.role === 'faculty' 
              ? 'Manage your mentoring sessions and help students learn.'
              : 'Continue your learning journey with SkillSwap.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="My Skills"
            value={stats?.total_skills || 0}
            icon={<BookOpen size={24} />}
          />
          <StatCard
            title="Upcoming Sessions"
            value={stats?.upcoming_sessions || 0}
            icon={<Calendar size={24} />}
          />
          <StatCard
            title="Avg Rating"
            value={stats?.avg_rating ? Number(stats.avg_rating).toFixed(1) : 'N/A'}
            icon={<Star size={24} />}
            variant="brand"
          />
          <StatCard
            title="Notifications"
            value={stats?.unread_notifications || 0}
            icon={<Bell size={24} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-normal mb-4" style={{ letterSpacing: '-0.02em' }}>Recent Notifications</h2>
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.notification_id}
                    className="p-4 rounded-lg"
                    style={{ 
                      background: notif.is_read ? '#0f0f0f' : 'rgba(62, 207, 142, 0.1)',
                      border: notif.is_read ? '1px solid #2e2e2e' : '1px solid rgba(62, 207, 142, 0.3)'
                    }}
                  >
                    <p className="text-sm">{notif.message}</p>
                    <p className="text-xs mt-1" style={{ color: '#898989' }}>
                      {new Date(notif.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8" style={{ color: '#898989' }}>No notifications yet</p>
            )}
          </div>

          <div className="card">
            <h2 className="text-xl font-normal mb-4" style={{ letterSpacing: '-0.02em' }}>Quick Actions</h2>
            <div className="space-y-3">
              <a
                href="/skills"
                className="block p-4 rounded-lg transition-colors"
                style={{ background: '#0f0f0f' }}
              >
                <h3 className="font-medium">Manage My Skills</h3>
                <p className="text-sm mt-1" style={{ color: '#898989' }}>Add or update your expertise</p>
              </a>
              <a
                href="/browse"
                className="block p-4 rounded-lg transition-colors"
                style={{ background: '#0f0f0f' }}
              >
                <h3 className="font-medium">Browse Mentors</h3>
                <p className="text-sm mt-1" style={{ color: '#898989' }}>Find experts to learn from</p>
              </a>
              <a
                href="/sessions"
                className="block p-4 rounded-lg transition-colors"
                style={{ background: '#0f0f0f' }}
              >
                <h3 className="font-medium">My Sessions</h3>
                <p className="text-sm mt-1" style={{ color: '#898989' }}>View and manage your bookings</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
