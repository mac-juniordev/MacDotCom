// ============================================
// SKILLS OVERVIEW COMPONENT - FIXED
// Lucide icons + theme aware
// ============================================

import { motion } from 'framer-motion';
import { Atom, Code2, Server, Database, Boxes, Palette } from 'lucide-react';
import { ComponentType, CSSProperties } from 'react';

interface Skill {
  id: number;
  name: string;
  proficiency: number;
  icon: ComponentType<{
    className?: string;
    style?: CSSProperties;
  }>;
  color: string;
}

const SkillsOverview = () => {
  const skills: Skill[] = [
    { id: 1, name: 'React', proficiency: 95, icon: Atom, color: '#61dafb' },
    { id: 2, name: 'TypeScript', proficiency: 90, icon: Code2, color: '#3178c6' },
    { id: 3, name: 'Node.js', proficiency: 92, icon: Server, color: '#68a063' },
    { id: 4, name: 'MongoDB', proficiency: 88, icon: Database, color: '#47a248' },
    { id: 5, name: 'Express', proficiency: 85, icon: Boxes, color: '#ffffff' },
    { id: 6, name: 'Tailwind CSS', proficiency: 93, icon: Palette, color: '#38bdf8' },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated background lines */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(45deg, #3b82f6 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
        animate={{ backgroundPosition: ['0px 0px', '30px 30px'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-black mb-4 text-primary">
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Technical Skills
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Animated icon */}
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: skill.color }} />
                    </motion.div>
                    <span className="font-semibold text-primary">{skill.name}</span>
                  </div>
                  <motion.span
                    className="font-bold"
                    style={{ color: skill.color }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {skill.proficiency}%
                  </motion.span>
                </div>

                {/* Progress bar */}
                <div className="relative h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  {/* Animated fill */}
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: skill.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    transition={{
                      duration: 2,
                      delay: index * 0.2,
                      ease: 'easeOut',
                    }}
                  >
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1, repeat: Infinity, delay: index * 0.1 }}
                    />
                  </motion.div>

                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      boxShadow: `0 0 20px ${skill.color}`,
                    }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsOverview;
