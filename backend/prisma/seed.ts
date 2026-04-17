import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.notification.deleteMany({});
  await prisma.sessionReview.deleteMany({});
  await prisma.skillSession.deleteMany({});
  await prisma.userSkill.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.skillCategory.deleteMany({});
  await prisma.user.deleteMany({});

  // Create Skill Categories
  const categories = await Promise.all([
    prisma.skillCategory.create({ data: { name: 'Programming' } }),
    prisma.skillCategory.create({ data: { name: 'Web Development' } }),
    prisma.skillCategory.create({ data: { name: 'Data Science' } }),
    prisma.skillCategory.create({ data: { name: 'Design' } }),
    prisma.skillCategory.create({ data: { name: 'Mobile Development' } }),
    prisma.skillCategory.create({ data: { name: 'DevOps' } }),
    prisma.skillCategory.create({ data: { name: 'Machine Learning' } }),
    prisma.skillCategory.create({ data: { name: 'Database' } }),
    prisma.skillCategory.create({ data: { name: 'Cloud Computing' } }),
  ]);

  // Create Skills
  const skills = await Promise.all([
    // Programming
    prisma.skill.create({ data: { name: 'Python', categoryId: categories[0].id } }),
    prisma.skill.create({ data: { name: 'JavaScript', categoryId: categories[0].id } }),
    prisma.skill.create({ data: { name: 'TypeScript', categoryId: categories[0].id } }),
    prisma.skill.create({ data: { name: 'Java', categoryId: categories[0].id } }),
    prisma.skill.create({ data: { name: 'C++', categoryId: categories[0].id } }),
    prisma.skill.create({ data: { name: 'Go', categoryId: categories[0].id } }),
    // Web Development
    prisma.skill.create({ data: { name: 'React', categoryId: categories[1].id } }),
    prisma.skill.create({ data: { name: 'Node.js', categoryId: categories[1].id } }),
    prisma.skill.create({ data: { name: 'Vue.js', categoryId: categories[1].id } }),
    prisma.skill.create({ data: { name: 'CSS/SCSS', categoryId: categories[1].id } }),
    // Data Science
    prisma.skill.create({ data: { name: 'Pandas', categoryId: categories[2].id } }),
    prisma.skill.create({ data: { name: 'NumPy', categoryId: categories[2].id } }),
    prisma.skill.create({ data: { name: 'Data Visualization', categoryId: categories[2].id } }),
    // Design
    prisma.skill.create({ data: { name: 'UI/UX Design', categoryId: categories[3].id } }),
    prisma.skill.create({ data: { name: 'Figma', categoryId: categories[3].id } }),
    // Mobile Development
    prisma.skill.create({ data: { name: 'React Native', categoryId: categories[4].id } }),
    prisma.skill.create({ data: { name: 'Flutter', categoryId: categories[4].id } }),
    // DevOps
    prisma.skill.create({ data: { name: 'Docker', categoryId: categories[5].id } }),
    prisma.skill.create({ data: { name: 'Kubernetes', categoryId: categories[5].id } }),
    prisma.skill.create({ data: { name: 'Git', categoryId: categories[5].id } }),
    // Machine Learning
    prisma.skill.create({ data: { name: 'TensorFlow', categoryId: categories[6].id } }),
    prisma.skill.create({ data: { name: 'PyTorch', categoryId: categories[6].id } }),
    prisma.skill.create({ data: { name: 'NLP', categoryId: categories[6].id } }),
    // Database
    prisma.skill.create({ data: { name: 'MySQL', categoryId: categories[7].id } }),
    prisma.skill.create({ data: { name: 'PostgreSQL', categoryId: categories[7].id } }),
    prisma.skill.create({ data: { name: 'MongoDB', categoryId: categories[7].id } }),
    // Cloud Computing
    prisma.skill.create({ data: { name: 'AWS', categoryId: categories[8].id } }),
    prisma.skill.create({ data: { name: 'GCP', categoryId: categories[8].id } }),
    prisma.skill.create({ data: { name: 'Azure', categoryId: categories[8].id } }),
  ]);

  const passwordHash = await bcrypt.hash('password123', 10);

  // Create Users
  const faculty = await Promise.all([
    prisma.user.create({
      data: {
        roll_number: 'FAC001',
        full_name: 'Dr. Priya Sharma',
        email: 'priya.sharma@university.edu',
        password_hash: passwordHash,
        role: 'faculty',
        department: 'Computer Science',
        avg_rating: 5.0,
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'FAC002',
        full_name: 'Prof. Rajesh Kumar',
        email: 'rajesh.kumar@university.edu',
        password_hash: passwordHash,
        role: 'faculty',
        department: 'Information Technology',
        avg_rating: 4.5,
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'FAC003',
        full_name: 'Dr. Anita Patel',
        email: 'anita.patel@university.edu',
        password_hash: passwordHash,
        role: 'faculty',
        department: 'Computer Applications',
        avg_rating: 4.0,
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'FAC004',
        full_name: 'Prof. Vikram Singh',
        email: 'vikram.singh@university.edu',
        password_hash: passwordHash,
        role: 'faculty',
        department: 'Computer Science',
        avg_rating: 4.5,
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'FAC005',
        full_name: 'Dr. Meera Joshi',
        email: 'meera.joshi@university.edu',
        password_hash: passwordHash,
        role: 'faculty',
        department: 'Information Technology',
        avg_rating: 5.0,
      },
    }),
  ]);

  const students = await Promise.all([
    prisma.user.create({
      data: {
        roll_number: 'MCA2024001',
        full_name: 'Aarav Gupta',
        email: 'aarav.gupta@student.edu',
        password_hash: passwordHash,
        role: 'student',
        department: 'MCA',
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'MCA2024002',
        full_name: 'Ananya Reddy',
        email: 'ananya.reddy@student.edu',
        password_hash: passwordHash,
        role: 'student',
        department: 'MCA',
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'MCA2024003',
        full_name: 'Arjun Nair',
        email: 'arjun.nair@student.edu',
        password_hash: passwordHash,
        role: 'student',
        department: 'MCA',
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'MCA2024004',
        full_name: 'Diya Sharma',
        email: 'diya.sharma@student.edu',
        password_hash: passwordHash,
        role: 'student',
        department: 'MCA',
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'MCA2024005',
        full_name: 'Ishaan Mehta',
        email: 'ishaan.mehta@student.edu',
        password_hash: passwordHash,
        role: 'student',
        department: 'MCA',
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'MCA2024006',
        full_name: 'Kavya Iyer',
        email: 'kavya.iyer@student.edu',
        password_hash: passwordHash,
        role: 'student',
        department: 'MCA',
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'MCA2024007',
        full_name: 'Lakshay Verma',
        email: 'lakshay.verma@student.edu',
        password_hash: passwordHash,
        role: 'student',
        department: 'MCA',
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'MCA2024008',
        full_name: 'Myra Shah',
        email: 'myra.shah@student.edu',
        password_hash: passwordHash,
        role: 'student',
        department: 'MCA',
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'MCA2024009',
        full_name: 'Neel Patel',
        email: 'neel.patel@student.edu',
        password_hash: passwordHash,
        role: 'student',
        department: 'MCA',
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'MCA2024010',
        full_name: 'Prisha Das',
        email: 'prisha.das@student.edu',
        password_hash: passwordHash,
        role: 'student',
        department: 'MCA',
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'MCA2024011',
        full_name: 'Reyansh Kumar',
        email: 'reyansh.kumar@student.edu',
        password_hash: passwordHash,
        role: 'student',
        department: 'MCA',
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'MCA2024012',
        full_name: 'Saanvi Mishra',
        email: 'saanvi.mishra@student.edu',
        password_hash: passwordHash,
        role: 'student',
        department: 'MCA',
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'MCA2024013',
        full_name: 'Vihaan Choudhary',
        email: 'vihaan.choudhary@student.edu',
        password_hash: passwordHash,
        role: 'student',
        department: 'MCA',
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'MCA2024014',
        full_name: 'Yashika Bhatt',
        email: 'yashika.bhatt@student.edu',
        password_hash: passwordHash,
        role: 'student',
        department: 'MCA',
      },
    }),
    prisma.user.create({
      data: {
        roll_number: 'MCA2024015',
        full_name: 'Zara Khan',
        email: 'zara.khan@student.edu',
        password_hash: passwordHash,
        role: 'student',
        department: 'MCA',
      },
    }),
  ]);

  // Create User Skills (Faculty)
  await Promise.all([
    prisma.userSkill.create({ data: { userId: faculty[0].id, skillId: skills[0].id, proficiency_level: 'expert', years_of_experience: 8 } }),
    prisma.userSkill.create({ data: { userId: faculty[0].id, skillId: skills[10].id, proficiency_level: 'expert', years_of_experience: 7 } }),
    prisma.userSkill.create({ data: { userId: faculty[0].id, skillId: skills[11].id, proficiency_level: 'expert', years_of_experience: 6 } }),
    prisma.userSkill.create({ data: { userId: faculty[1].id, skillId: skills[1].id, proficiency_level: 'expert', years_of_experience: 10 } }),
    prisma.userSkill.create({ data: { userId: faculty[1].id, skillId: skills[6].id, proficiency_level: 'expert', years_of_experience: 8 } }),
    prisma.userSkill.create({ data: { userId: faculty[1].id, skillId: skills[7].id, proficiency_level: 'advanced', years_of_experience: 6 } }),
    prisma.userSkill.create({ data: { userId: faculty[2].id, skillId: skills[15].id, proficiency_level: 'expert', years_of_experience: 7 } }),
    prisma.userSkill.create({ data: { userId: faculty[2].id, skillId: skills[16].id, proficiency_level: 'expert', years_of_experience: 6 } }),
    prisma.userSkill.create({ data: { userId: faculty[3].id, skillId: skills[17].id, proficiency_level: 'expert', years_of_experience: 9 } }),
    prisma.userSkill.create({ data: { userId: faculty[3].id, skillId: skills[18].id, proficiency_level: 'advanced', years_of_experience: 6 } }),
    prisma.userSkill.create({ data: { userId: faculty[3].id, skillId: skills[20].id, proficiency_level: 'expert', years_of_experience: 8 } }),
    prisma.userSkill.create({ data: { userId: faculty[4].id, skillId: skills[0].id, proficiency_level: 'expert', years_of_experience: 7 } }),
    prisma.userSkill.create({ data: { userId: faculty[4].id, skillId: skills[21].id, proficiency_level: 'expert', years_of_experience: 6 } }),
    prisma.userSkill.create({ data: { userId: faculty[4].id, skillId: skills[22].id, proficiency_level: 'advanced', years_of_experience: 5 } }),
    // Student skills
    prisma.userSkill.create({ data: { userId: students[0].id, skillId: skills[0].id, proficiency_level: 'intermediate', years_of_experience: 1 } }),
    prisma.userSkill.create({ data: { userId: students[0].id, skillId: skills[1].id, proficiency_level: 'intermediate', years_of_experience: 1 } }),
    prisma.userSkill.create({ data: { userId: students[1].id, skillId: skills[1].id, proficiency_level: 'intermediate', years_of_experience: 1 } }),
    prisma.userSkill.create({ data: { userId: students[1].id, skillId: skills[6].id, proficiency_level: 'intermediate', years_of_experience: 1 } }),
  ]);

  // Create Sessions
  const sessions = await Promise.all([
    prisma.skillSession.create({
      data: {
        mentorId: faculty[0].id,
        menteeId: students[0].id,
        skillId: skills[0].id,
        title: 'Python Fundamentals',
        description: 'Introduction to Python programming basics',
        scheduled_date: new Date('2026-03-01T10:00:00Z'),
        status: 'completed',
      },
    }),
    prisma.skillSession.create({
      data: {
        mentorId: faculty[1].id,
        menteeId: students[1].id,
        skillId: skills[6].id,
        title: 'React Hooks Deep Dive',
        description: 'Understanding React hooks and state management',
        scheduled_date: new Date('2026-03-05T14:00:00Z'),
        status: 'completed',
      },
    }),
    prisma.skillSession.create({
      data: {
        mentorId: faculty[0].id,
        menteeId: students[5].id,
        skillId: skills[10].id,
        title: 'Pandas for Data Analysis',
        description: 'Working with DataFrames and data manipulation',
        scheduled_date: new Date('2026-03-10T11:00:00Z'),
        status: 'completed',
      },
    }),
    prisma.skillSession.create({
      data: {
        mentorId: faculty[2].id,
        menteeId: students[6].id,
        skillId: skills[15].id,
        title: 'React Native Basics',
        description: 'Getting started with mobile app development',
        scheduled_date: new Date('2026-03-12T15:00:00Z'),
        status: 'completed',
      },
    }),
    prisma.skillSession.create({
      data: {
        mentorId: faculty[3].id,
        menteeId: students[4].id,
        skillId: skills[17].id,
        title: 'Docker Containerization',
        description: 'Introduction to Docker and container orchestration',
        scheduled_date: new Date('2026-03-15T09:00:00Z'),
        status: 'completed',
      },
    }),
    prisma.skillSession.create({
      data: {
        mentorId: faculty[4].id,
        menteeId: students[8].id,
        skillId: skills[0].id,
        title: 'Machine Learning Intro',
        description: 'Introduction to ML concepts and algorithms',
        scheduled_date: new Date('2026-03-18T10:30:00Z'),
        status: 'completed',
      },
    }),
    prisma.skillSession.create({
      data: {
        mentorId: faculty[0].id,
        menteeId: students[2].id,
        skillId: skills[0].id,
        title: 'Python for Beginners',
        description: 'Basic Python syntax and concepts',
        scheduled_date: new Date('2026-03-20T14:00:00Z'),
        status: 'completed',
      },
    }),
    prisma.skillSession.create({
      data: {
        mentorId: faculty[1].id,
        menteeId: students[9].id,
        skillId: skills[6].id,
        title: 'Building Web Apps with React',
        description: 'Modern React development practices',
        scheduled_date: new Date('2026-03-22T11:00:00Z'),
        status: 'completed',
      },
    }),
    // Upcoming sessions
    prisma.skillSession.create({
      data: {
        mentorId: faculty[0].id,
        menteeId: students[10].id,
        skillId: skills[0].id,
        title: 'Advanced Python Techniques',
        description: 'Decorators, generators, and more',
        scheduled_date: new Date('2026-04-18T10:00:00Z'),
        status: 'confirmed',
      },
    }),
    prisma.skillSession.create({
      data: {
        mentorId: faculty[1].id,
        menteeId: students[13].id,
        skillId: skills[14].id,
        title: 'UI Design Principles',
        description: 'Fundamentals of user interface design',
        scheduled_date: new Date('2026-04-19T14:00:00Z'),
        status: 'confirmed',
      },
    }),
    prisma.skillSession.create({
      data: {
        mentorId: faculty[3].id,
        menteeId: students[7].id,
        skillId: skills[26].id,
        title: 'AWS Cloud Fundamentals',
        description: 'Introduction to Amazon Web Services',
        scheduled_date: new Date('2026-04-20T09:00:00Z'),
        status: 'confirmed',
      },
    }),
    // Pending sessions
    prisma.skillSession.create({
      data: {
        mentorId: faculty[2].id,
        menteeId: students[0].id,
        skillId: skills[16].id,
        title: 'Flutter App Development',
        description: 'Cross-platform mobile app development',
        scheduled_date: new Date('2026-04-21T11:00:00Z'),
        status: 'pending',
      },
    }),
    prisma.skillSession.create({
      data: {
        mentorId: faculty[4].id,
        menteeId: students[1].id,
        skillId: skills[21].id,
        title: 'TensorFlow Basics',
        description: 'Getting started with TensorFlow for ML',
        scheduled_date: new Date('2026-04-22T15:00:00Z'),
        status: 'pending',
      },
    }),
  ]);

  // Create Reviews
  await Promise.all([
    prisma.sessionReview.create({
      data: { sessionId: sessions[0].id, reviewerId: students[0].id, rating: 5.0, comment: 'Excellent teaching! Dr. Sharma explained concepts very clearly.' },
    }),
    prisma.sessionReview.create({
      data: { sessionId: sessions[1].id, reviewerId: students[1].id, rating: 4.5, comment: 'Great session on React hooks. Would recommend to others.' },
    }),
    prisma.sessionReview.create({
      data: { sessionId: sessions[2].id, reviewerId: students[5].id, rating: 5.0, comment: 'The pandas session was very practical and hands-on.' },
    }),
    prisma.sessionReview.create({
      data: { sessionId: sessions[3].id, reviewerId: students[6].id, rating: 4.0, comment: 'Good introduction to React Native. Covered the basics well.' },
    }),
    prisma.sessionReview.create({
      data: { sessionId: sessions[4].id, reviewerId: students[4].id, rating: 4.5, comment: 'Docker concepts were explained perfectly. Very helpful.' },
    }),
    prisma.sessionReview.create({
      data: { sessionId: sessions[5].id, reviewerId: students[8].id, rating: 5.0, comment: 'Dr. Joshi is an amazing instructor! ML concepts were made simple.' },
    }),
    prisma.sessionReview.create({
      data: { sessionId: sessions[6].id, reviewerId: students[2].id, rating: 4.0, comment: 'Good session, covered all the fundamentals of Python.' },
    }),
    prisma.sessionReview.create({
      data: { sessionId: sessions[7].id, reviewerId: students[9].id, rating: 4.5, comment: 'Learned a lot about modern React patterns.' },
    }),
  ]);

  // Create Notifications
  await Promise.all([
    prisma.notification.create({ data: { userId: faculty[0].id, message: 'Welcome to SkillSwap! Start by adding your skills to your profile.', is_read: true } }),
    prisma.notification.create({ data: { userId: faculty[0].id, message: 'Aarav Gupta requested a session: Python Fundamentals', is_read: true } }),
    prisma.notification.create({ data: { userId: faculty[0].id, message: 'Aarav Gupta left you a 5-star review!', is_read: false } }),
    prisma.notification.create({ data: { userId: faculty[1].id, message: 'New session request from Ananya Reddy for React Hooks Deep Dive', is_read: true } }),
    prisma.notification.create({ data: { userId: faculty[1].id, message: 'Ananya Reddy left you a 4.5-star review!', is_read: false } }),
    prisma.notification.create({ data: { userId: students[0].id, message: 'Your session request has been confirmed!', is_read: false } }),
    prisma.notification.create({ data: { userId: students[1].id, message: 'Your session with Prof. Rajesh Kumar has been confirmed.', is_read: false } }),
    prisma.notification.create({ data: { userId: students[2].id, message: 'Your session request is pending approval.', is_read: false } }),
  ]);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
