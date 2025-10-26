import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='h-screen w-screen bg-gray-900 relative'>
        <video className='h-full w-full object-cover' autoPlay loop muted>
            <source src="/videos/HomeScreen.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 h-full w-full">
            <div className="flex flex-col justify-center items-center h-full text-white">
                <h1 className="bg-orange-400 p-2 rounded-lg font-[Montserrat] text-center text-5xl font-bold mb-4 text-white">Welcome to FlightFocus</h1>
                <Link to="/book" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white text-lg font-semibold">
                    Get Started
                </Link>
            </div>
        </div>
    </div>
  )
}

export default Home
