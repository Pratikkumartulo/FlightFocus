import React from 'react'

const SeatView = ({ muted }) => {
  return (
    <div className='h-full w-screen overflow-hidden relative'>
      <img
        className='z-10 w-full h-full max-h-[45rem] object-cover absolute top-0 left-0'
        src="seat4.png"
        alt=""
      />
      <video autoPlay loop muted={muted} className='w-full h-full max-h-[45rem] object-cover absolute top-0 left-0'>
        <source src="https://files.catbox.moe/0rkped.mp4" type="video/mp4" />
      </video>
    </div>
  )
}

export default SeatView
