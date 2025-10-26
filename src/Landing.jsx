import React, { useEffect, useState } from 'react'
import WorldAirportsMap from './WorldAirportsMap'
import Seats from './Seats'

const Landing = () => {
    const [departure, setDeparture] = useState(null);
    const [arrival, setArrival] = useState(null)
    const [distance, setDistance] = useState(null);
    const [hours, setHours] = useState(null);
    const [minutes, setMinutes] = useState(null);
    const [bookSeatLayout, setBookSeatLayout] = useState(false);

  const handleAirportClick = (airport) => {
    if (!departure) {
      setDeparture(airport)
    } else if (!arrival) {
      setArrival(airport)
    } else {
      // Reset if both are already selected
      setDeparture(airport)
      setArrival(null)
    }
  }

 useEffect(() => {
  if (departure && arrival) {
    // ensure both lat and lng are numbers
    const depLat = Number(departure.lat);
    const depLng = Number(departure.lon);
    const arrLat = Number(arrival.lat);
    const arrLng = Number(arrival.lon);
    console.log("Departure coords:", depLat, depLng);
    console.log("Arrival coords:", arrLat, arrLng);

    if (!isNaN(depLat) && !isNaN(depLng) && !isNaN(arrLat) && !isNaN(arrLng)) {
        const from = L.latLng(depLat, depLng);
        const to = L.latLng(arrLat, arrLng);
        const distInMeters = from.distanceTo(to); // in meters
        setDistance((distInMeters / 1000).toFixed(2)); // km

        const averageSpeed = 900; // km/h for commercial jet
        const takeoffLandingBuffer = 30; // minutes
        const distance = distInMeters / 1000; // convert to km
        const timeInHours = distance / averageSpeed;
        const totalMinutes = timeInHours * 60 + takeoffLandingBuffer;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        setHours(hours);
        setMinutes(minutes);

    }else{
        console.log("Invalid latitude or longitude values.");
    }
  }
}, [departure, arrival]);

  const ClearSelection = () => {
    setDeparture(null)
    setArrival(null)
    setDistance(null);
  }
  return (
    <div className='overflow-x-hidden h-screen w-screen relative'>
      <div className={`${bookSeatLayout?'hidden':''} h-full w-full bg-gray-900 flex flex-col justify-center items-center`}>
        <div className='h-20 w-full bg-gray-600 flex justify-center items-center'>
          <div className='text-white text-center'>
              <h2 className='text-4xl font-[Montserrat] mb-2'>Flight Focus</h2>
              <p className='text-lg font-[roboto]'>Click on an airport marker to choose your departure or arrival location.</p>
          </div>
        </div>
        <div className='flex-grow bg-red-300 w-full'>
          <WorldAirportsMap onAirportClick={handleAirportClick} departure={departure} arrival={arrival} />
        </div>
        <div className='h-30 w-full bg-gray-600 flex flex-col items-center'>
          <div className='text-center'>
              <p className='mt-2 text-lg font-[roboto] text-white'>
                  <span className='font-bold'>✈️Departure:</span> {departure?.name || 'Not selected'} | 
                  <span className='font-bold'>✈️Arrival:</span> {arrival?.name || 'Not selected'}
              </p>
              <p className='mb-2 text-sm font-[roboto] text-white'>{distance && <span>Distance: {distance} km  | Estimated Flight Time: {hours}h:{minutes}m</span>}</p>
          </div>
          <div className='space-x-4'>
              <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer' 
              onClick={()=>{
                if(departure && arrival){
                  setBookSeatLayout(true);
                }else{
                  alert("Please select a Destination or Arrival location")
                }
              }}
              >Confirm</button>
              <button className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer' onClick={ClearSelection}>Reset</button>
          </div>
          
        </div>
      </div>
      <Seats setBookSeatLayout={setBookSeatLayout} departure={departure} arrival={arrival} hours={hours} minutes={minutes} distance={distance} bookSeatLayout={bookSeatLayout}/>
    </div>
  )
}

export default Landing
