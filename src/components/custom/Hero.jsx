import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Hero() {

  return (

    <div className='flex flex-col items-center justify-center px-5 sm:px-10 md:px-20 lg:px-32 xl:px-56 gap-8 text-center'>

      <h1 className='font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight mt-12 md:mt-16 max-w-5xl'>

        <span className='text-blue-500 block'>
          Travel is a journey of discovering self.
        </span>

        <span className='block mt-2'>
          Start your journey here
        </span>

      </h1>

      <p className='text-base sm:text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl'>

        Plan smarter, travel better! Let Rover craft the perfect itinerary just for you.

      </p>

      <Link to={'/create-trip'}>

        <Button className="mt-2 mb-10 px-6 sm:px-8 py-5 text-base sm:text-lg font-semibold rounded-xl text-white hover:cursor-pointer w-full sm:w-auto">
          Get Your Itinerary for Free!
        </Button>

      </Link>

    </div>

  )
}

export default Hero