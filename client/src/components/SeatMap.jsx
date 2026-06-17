import SeatCell from './SeatCell';
import { motion } from 'framer-motion';

const SeatLegend = () => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-8 text-sm">
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded bg-green-500/20 border border-green-500"></div>
      <span className="text-gray-400">Available</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded bg-purple-600 border border-purple-400"></div>
      <span className="text-gray-400">Selected</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded bg-blue-500/20 border border-blue-400"></div>
      <span className="text-gray-400">Your Lock</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded bg-red-500/20 border border-red-500"></div>
      <span className="text-gray-400">Locked</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded bg-gray-700/50 border border-gray-600"></div>
      <span className="text-gray-400">Booked</span>
    </div>
  </div>
);

export default function SeatMap({ seats, selectedSeats, onSeatSelect }) {
  if (!seats || seats.length === 0) {
    return <p className="text-center text-gray-500">No seat map available for this event.</p>;
  }

  // Group seats by row
  const rows = seats.reduce((acc, seat) => {
    acc[seat.row] = acc[seat.row] || [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  // Sort rows alphabetically
  const sortedRowKeys = Object.keys(rows).sort();

  return (
    <div className="card-glass rounded-xl p-6 lg:p-8">
      <h3 className="text-2xl font-bold text-white text-center mb-8">Choose Your Seat</h3>
      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-lg bg-gray-700 text-white text-center py-2 rounded-md font-bold text-sm tracking-widest">
          STAGE
        </div>
        <div className="flex flex-col gap-3">
          {sortedRowKeys.map((rowKey, index) => (
            <motion.div
              key={rowKey}
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="w-8 text-center font-bold text-gray-400">{rowKey}</div>
              <div className="flex gap-2">
                {rows[rowKey].map(seat => (
                  <SeatCell
                    key={seat._id}
                    seat={seat}
                    onSelect={onSeatSelect} // Pass the handler down
                    isSelected={selectedSeats.includes(seat._id)}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <SeatLegend />
    </div>
  );
}