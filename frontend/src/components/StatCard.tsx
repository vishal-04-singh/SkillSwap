import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: 'default' | 'brand';
}

export default function StatCard({ title, value, icon, variant = 'default' }: StatCardProps) {
  const styles = variant === 'brand' 
    ? { borderColor: 'rgba(62, 207, 142, 0.3)', background: 'rgba(62, 207, 142, 0.05)' }
    : { borderColor: '#2e2e2e', background: '#171717' };

  return (
    <motion.div
      whileHover={{ scale: 1.02, borderColor: 'rgba(62, 207, 142, 0.5)' }}
      className="card card-hover"
      style={styles}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: '#898989' }}>{title}</p>
          <p className="text-3xl font-normal mt-2" style={{ letterSpacing: '-0.02em' }}>{value}</p>
        </div>
        <div className="p-3 rounded-lg" style={{ background: variant === 'brand' ? 'rgba(62, 207, 142, 0.15)' : '#0f0f0f' }}>
          <div style={{ color: '#3ecf8e' }}>{icon}</div>
        </div>
      </div>
    </motion.div>
  );
}
