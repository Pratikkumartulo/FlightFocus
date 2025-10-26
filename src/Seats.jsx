import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Seats({bookSeatLayout, setBookSeatLayout, departure, arrival, hours, minutes, distance }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats] = useState([]);
  const [todo, setTodo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check for valid booking context (e.g., departure/arrival)
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    if (!bookings.length && (!departure || !arrival)) {
      navigate('/book');
    }
    // eslint-disable-next-line
  }, [departure, arrival, navigate]);

  // Define the exact layout - 2 sections: ABC and DEF
  const rows = 20;
  const seatsConfig = {
    columns: ['A', 'B', 'C', 'D', 'E', 'F'],
    leftSection: ['A', 'B', 'C'],
    rightSection: ['D', 'E', 'F']
  };

  const toggleSeat = (seatNumber) => {
    setSelectedSeats([seatNumber]);
  };

  const getSeatStatus = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return 'booked';
    if (selectedSeats.includes(seatNumber)) return 'selected';
    return 'available';
  };

  const getSeatColor = (status) => {
    switch(status) {
      case 'booked':
        return 'bg-red-600 cursor-not-allowed border-red-500';
      case 'selected':
        return 'bg-green-500 hover:bg-green-600 cursor-pointer border-green-400';
      case 'available':
        return 'bg-gray-600 hover:bg-gray-500 cursor-pointer border-gray-500';
      default:
        return 'bg-gray-600';
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedSeats.length || !todo) return;
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push({
      seat: selectedSeats[0],
      todo: todo,
      departure,
      arrival,
      hours,
      minutes,
      distance
    });
    localStorage.setItem('bookings', JSON.stringify(bookings));
    setSelectedSeats([]);
    setTodo("");
    navigate('/ticket');
  };

  return (
    <div className={`${bookSeatLayout ? '' : 'hidden'} overflow-hidden overflow-x-hidden min-h-screen bg-gray-900 p-2 sm:p-4 flex items-center justify-center`}>
      <div className="max-w-md w-full">
        {/* Back button */}
        <button className="text-white mb-4 hover:text-gray-300"
        onClick={()=>{
            setBookSeatLayout(false);
        }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {/* Airplane shape container */}
        <div className="relative">
          {/* ...existing airplane code... */}
        </div>

        
        {/* Airplane shape container */}
        <div className="relative">
          {/* Airplane body - pointed top (cockpit) */}
          <div className="bg-gray-800 pt-64 sm:pt-80 md:pt-96 pb-8 px-4 sm:px-6 md:px-8 relative" style={{
            borderTopLeftRadius: '50% 80%',
            borderTopRightRadius: '50% 80%'
          }}>
            {/* Cockpit window */}
            <div className="absolute top-16 sm:top-20 md:top-24 left-1/2 -translate-x-1/2 w-20 sm:w-24 md:w-28 h-10 sm:h-12 md:h-14 bg-gray-700" style={{
              borderTopLeftRadius: '50% 70%',
              borderTopRightRadius: '50% 70%'
            }}></div>
            
            {/* Column headers */}
            <div className="flex justify-center gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4">
              <div className="flex gap-1 sm:gap-2">
                {seatsConfig.leftSection.map(letter => (
                  <div key={letter} className="w-7 sm:w-8 md:w-9 text-center text-gray-400 text-xs font-semibold">
                    {letter}
                  </div>
                ))}
              </div>
              <div className="flex gap-1 sm:gap-2">
                {seatsConfig.rightSection.map(letter => (
                  <div key={letter} className="w-7 sm:w-8 md:w-9 text-center text-gray-400 text-xs font-semibold">
                    {letter}
                  </div>
                ))}
              </div>
            </div>

            {/* Seat rows */}
            <div className="space-y-1.5 sm:space-y-2">
              {Array.from({ length: rows }, (_, rowIndex) => {
                const rowNumber = rowIndex + 1;
                return (
                  <div key={rowNumber} className="flex justify-center gap-4 sm:gap-6 md:gap-8 items-center relative">
                    {/* Left section (A, B, C) */}
                    <div className="flex gap-1 sm:gap-2">
                      {seatsConfig.leftSection.map(letter => {
                        const seatNumber = `${rowNumber}${letter}`;
                        const status = getSeatStatus(seatNumber);
                        return (
                          <button
                            key={seatNumber}
                            onClick={() => toggleSeat(seatNumber)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded border-2 transition-all flex items-center justify-center text-[9px] sm:text-[10px] font-bold ${getSeatColor(status)}`}
                            disabled={status === 'booked'}
                          >
                            <span className="text-white">{seatNumber}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Aisle with row number */}
                    <div className="text-gray-500 text-[10px] sm:text-xs font-bold">
                      {rowNumber}
                    </div>

                    {/* Right section (D, E, F) */}
                    <div className="flex gap-1 sm:gap-2">
                      {seatsConfig.rightSection.map(letter => {
                        const seatNumber = `${rowNumber}${letter}`;
                        const status = getSeatStatus(seatNumber);
                        return (
                          <button
                            key={seatNumber}
                            onClick={() => toggleSeat(seatNumber)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded border-2 transition-all flex items-center justify-center text-[9px] sm:text-[10px] font-bold ${getSeatColor(status)}`}
                            disabled={status === 'booked'}
                          >
                            <span className="text-white">{seatNumber}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Airplane bottom - rounded */}
          <div className="bg-gray-800 rounded-b-full h-12 sm:h-14 md:h-16"></div>
        </div>

        {/* Legend */}
        <div className="mt-4 sm:mt-6 flex justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 border-2 border-gray-500 rounded"></div>
            <span className="text-gray-300">Available</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 border-2 border-green-400 rounded"></div>
            <span className="text-gray-300">Selected</span>
          </div>
        </div>

        {/* Selected seats display at bottom */}
        {selectedSeats.length > 0 && (
          <div className="w-full mt-6 mb-4 bg-gray-800 rounded-lg p-3 sm:p-4">
            <h3 className="text-white font-bold mb-2 text-sm sm:text-base">Selected Seats:</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedSeats.map(seat => (
                <span key={seat} className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold">
                  {seat}
                </span>
              ))}
            </div>
            <button
              className="mb-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs sm:text-sm font-semibold"
              onClick={() => setSelectedSeats([])}
            >
              Clear Selected Seats
            </button>
            {/* Todo input box */}
            <input
              type="text"
              placeholder="Enter your todo task..."
              value={todo}
              onChange={e => setTodo(e.target.value)}
              className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              className={`w-full mt-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${!todo ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!todo}
              onClick={handleConfirmBooking}
            >
              Confirm Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}