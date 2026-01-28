'use client';

interface ConnectionStrengthProps {
  strength: number;
  size?: 'sm' | 'md';
}

export default function ConnectionStrength({ strength, size = 'md' }: ConnectionStrengthProps) {
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';
  const gap = size === 'sm' ? 'gap-1' : 'gap-1.5';

  return (
    <div className={`flex items-center ${gap}`} title={`Connection strength: ${strength}/5`}>
      {[1, 2, 3, 4, 5].map((level) => (
        <div
          key={level}
          className={`${dotSize} rounded-full transition-colors ${
            level <= strength
              ? strength >= 4
                ? 'bg-success'
                : strength >= 2
                ? 'bg-accent'
                : 'bg-warning'
              : 'bg-border'
          }`}
        />
      ))}
    </div>
  );
}
