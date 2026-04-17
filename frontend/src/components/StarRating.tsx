import { Star } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: number;
}

export default function StarRating({ value, onChange, readonly = false, size = 24 }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          disabled={readonly}
          whileHover={readonly ? {} : { scale: 1.2 }}
          whileTap={readonly ? {} : { scale: 0.9 }}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(0)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <Star
            size={size}
            fill={(hoverValue || value) >= star ? '#3ecf8e' : 'transparent'}
            stroke={(hoverValue || value) >= star ? '#3ecf8e' : '#4d4d4d'}
            className="transition-colors"
          />
        </motion.button>
      ))}
    </div>
  );
}
