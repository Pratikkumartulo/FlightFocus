import React, { useEffect, useState } from 'react'
import WorldAirportsMap from './WorldAirportsMap'
import Seats from './Seats'
import PlaneRoute from './PlaneRoute'
import SeatView from './SeatView'
import Cockpit from './Cockpit'
import TaskFinish from './TaskFinish'
import { useNavigate } from 'react-router-dom'

const Travel = () => {
  const navigate = useNavigate();

  // Check for bookings on mount, redirect if none
  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    if (!bookings.length) {
      navigate('/book');
    }
    // eslint-disable-next-line
  }, []);

  // Timer state
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const booking = bookings.length ? bookings[bookings.length - 1] : {};

  const initialSeconds =
    (Number(booking.hours) || 0) * 3600 +
    (Number(booking.minutes) || 0) * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [viewIndex, setViewIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [taskFinished, setTaskFinished] = useState(false);

  // Timer effect: show TaskFinish when timer ends
  useEffect(() => {
    if (secondsLeft === 0 && initialSeconds > 0) {
      // Remove booking and show finish page
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      if (bookings.length > 0) {
        bookings.pop();
        localStorage.setItem('bookings', JSON.stringify(bookings));
      }
      setTaskFinished(true);
      return;
    }
    if (secondsLeft > 0) {
      const timer = setInterval(() => {
        setSecondsLeft((s) => s > 0 ? s - 1 : 0);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [secondsLeft, initialSeconds]);

  // Format timer as hh:mm:ss
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // View switcher
  const views = [
    <PlaneRoute secondsLeft={secondsLeft} totalSeconds={initialSeconds} key="plane" />,
    <SeatView muted={muted} key="seat" />,
    <Cockpit muted={muted} key="cockpit" />
  ];

  const handleSwitchView = () => {
    setViewIndex((prev) => (prev + 1) % views.length);
  };

  const showMuteButton = viewIndex === 1 || viewIndex === 2;

  const handleLandEarly = () => {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    if (bookings.length > 0) {
      bookings.pop();
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
    setTaskFinished(true);
  };

  return (
    <div className='overflow-x-hidden h-screen w-screen'>
      <div className="h-full w-full bg-gray-900 flex flex-col justify-center items-center">
        {taskFinished ? (
          <TaskFinish />
        ) : (
          <>
            {/* Top Info Box */}
            <div className="w-full px-2 sm:px-6 py-4 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 shadow-lg rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 relative">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-white rounded-full shadow w-10 h-10">
                  <img src="https://cdn-icons-png.flaticon.com/128/984/984233.png" alt="plane" className="w-7 h-7" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-300 font-semibold">Time left</span>
                  <span className="text-lg font-mono text-white font-bold">{secondsLeft > 0 ? formatTime(secondsLeft) : "---"}</span>
                </div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs text-gray-300 font-semibold">Route</span>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-white">{booking.departure?.name || 'Not selected'}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-base sm:text-lg font-bold text-white">{booking.arrival?.name || 'Not selected'}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-300 font-semibold">Distance</span>
                <span className="text-lg font-mono text-white font-bold">{booking.distance || '---'} <span className="text-sm">km</span></span>
              </div>
              {/* Buttons moved inside info box, right-aligned and always visible */}
              <div className="flex items-center gap-2 ml-0 sm:ml-6 mt-4 sm:mt-0">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm font-semibold shadow"
                  onClick={handleSwitchView}
                >
                  Switch View
                </button>
                {showMuteButton && (
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm font-semibold shadow"
                    onClick={() => setMuted(m => !m)}
                  >
                    {muted ? "Unmute" : "Mute"}
                  </button>
                )}
              </div>
            </div>
            {/* Main View */}
            <div className='flex-grow bg-red-300 w-full overflow-hidden'>
              {views[viewIndex]}
            </div>
            {/* Bottom Bar */}
            <div className='h-15 w-full bg-gray-600 flex flex-col items-center justify-center'>
              <div className='space-x-4'>
                  <button
                    className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer'
                    onClick={handleLandEarly}
                  >
                    Land Early
                  </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Travel
