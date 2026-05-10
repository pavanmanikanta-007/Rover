import React from 'react';
import PlaceItemCard from './PlaceItemCard';

function PlacesToVisit({ trip }) {

  const itinerary =
    trip?.tripData?.itinerary || [];

  // USE FULL LOCATION STRING
  const tripLocation =
    trip?.userChoice?.location?.full || "";

  return (

    <div>

      <h2 className='font-bold text-lg mt-5'>
        Places To Visit
      </h2>

      <div>

        {itinerary.map((item, index) => (

          <div
            className='mt-5'
            key={index}
          >

            {/* Day Header */}
            <div className='mb-3'>

              <h2 className='font-medium text-lg'>
                Day - {item.day}
              </h2>

              <p className='text-sm text-gray-500'>
                {item.theme}
              </p>

              <p className='text-xs text-orange-600 mt-1'>
                Best Time: {item.bestTimeToVisit}
              </p>

            </div>

            {/* Places Grid */}
            <div className='grid md:grid-cols-2 gap-5'>

              {item.places?.map((place, index) => (

                <div
                  className='my-3'
                  key={index}
                >

                  <h2 className='font-medium text-sm text-orange-600 mb-2'>
                    {place.bestVisitTime}
                  </h2>

                  <PlaceItemCard
                    place={place}
                    tripLocation={tripLocation}
                  />

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default PlacesToVisit;