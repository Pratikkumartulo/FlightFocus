import React from 'react'

const Cockpit = ({ muted }) => {
  return (
    <div className='h-full w-screen overflow-hidden relative'>
      <img
        className='z-10 w-full h-full max-h-[45rem] object-cover absolute top-0 left-0'
        src="cockpit.png"
        alt=""
      />
      <video autoPlay loop className='w-full h-full max-h-[45rem] object-cover absolute top-0 left-0' muted={muted}>
        <source src="https://files.catbox.moe/sxywha.mp4" type="video/mp4" />
      </video>
    </div>
  )
}

export default Cockpit
