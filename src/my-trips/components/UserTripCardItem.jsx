import React from 'react';
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip, loading }) {

  // Skeleton Loading UI
  if (loading) {
    return (
      <div className='animate-pulse'>

        <div className='h-[220px] w-full bg-gray-300 rounded-xl'></div>

        <div className='mt-2 space-y-2'>
          <div className='h-5 w-3/4 bg-gray-300 rounded'></div>
          <div className='h-4 w-1/2 bg-gray-300 rounded'></div>
        </div>

      </div>
    );
  }

  const tripData = trip?.tripData || {};

  return (
    <Link to={`/viewTrip/${trip.id}`}>
      
      <div className='cursor-pointer hover:scale-105 transition-all'>

        <img
          src={tripData?.destinationImageUrl}
          alt={tripData?.location || 'Destination'}
          className="object-cover rounded-xl h-[220px] w-full"
        />

        <div className='mt-2'>

          <h2 className='font-bold text-lg'>
            {trip?.userChoice?.location?.full}
          </h2>

          <h2 className='text-gray-500 text-xs'>
            A {trip?.userChoice?.travelers?.title},{' '}
            {trip?.userChoice?.days} Days trip
            with {trip?.userChoice?.budget?.title} budget
          </h2>

        </div>

      </div>

    </Link>
  );
}

export default UserTripCardItem;