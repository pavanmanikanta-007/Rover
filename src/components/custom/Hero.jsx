import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-9'>
        <h1 className='font-extrabold text-[50px] text-center mt-16'>
            <span className='text-blue-500'>Travel is a journey of discovering self.</span><br/>Start your journey here</h1>
        <p className='text-xl text-gray-500'>Plan smarter, travel better! Let Rover craft the perfect itinerary just for you</p>

<Link to = {'/create-trip'}>
        <Button className="mt-6 px-8 py-4 text-lg font-semibold rounded-xl text-white hover:cursor-pointer">Get Your Itinerary for Free!</Button>
        </Link>
    </div>
  )
}

export default Hero