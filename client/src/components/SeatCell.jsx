import { motion } from 'framer-motion';

export default function SeatCell({ seat, onSelect, isSelected }) {
  const getSeatStatus = () => {
    if (isSelected) return 'selected';
    if (seat.lockedByMe) return 'locked-by-me';
    return seat.status;
  };

  const seatStatus = getSeatStatus();

  const statusClasses = {
    available: 'bg-green-500/20 border-green-500 hover:bg-green-500/40 text-green-300',
    locked: 'bg-red-500/20 border-red-500 cursor-not-allowed text-red-300',
    booked: 'bg-gray-700/50 border-gray-600 cursor-not-allowed text-gray-500',
    selected: 'bg-purple-600 border-purple-400 ring-2 ring-purple-400 text-white',
    'locked-by-me': 'bg-blue-500/20 border-blue-400 ring-2 ring-blue-400 text-blue-300',
  };

  const classes = `w-12 h-12 flex items-center justify-center font-mono text-sm rounded-md border transition-all ${statusClasses[seatStatus]}`;

  const handleClick = () => {
    if (seat.status === 'available' || seat.lockedByMe || isSelected) {
      onSelect(seat._id); // CRITICAL FIX: Use seat._id, not seat.label
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={seat.status === 'locked' && !seat.lockedByMe}
      className={classes}
      whileHover={{ scale: (seat.status === 'available' || isSelected || seat.lockedByMe) ? 1.1 : 1 }}
      whileTap={{ scale: (seat.status === 'available' || isSelected || seat.lockedByMe) ? 0.9 : 1 }}
    >
      {seat.label}
    </motion.button>
  );
}