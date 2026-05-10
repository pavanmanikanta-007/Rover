import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const HOTEL_PLACEHOLDER =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

const ProportionateStars = ({ ratingStr }) => {

  const rating = parseFloat(
    String(ratingStr || '0').split('/')[0]
  ) || 0;

  const fillPercentage = (rating / 5) * 100;

  return (

    <div className='flex items-center gap-2'>

      <div className="relative inline-block leading-none">

        {/* Empty Stars */}
        <div className="flex text-gray-200">

          {[...Array(5)].map((_, i) => (

            <Star
              key={i}
              size={16}
              fill="currentColor"
              stroke="none"
            />

          ))}

        </div>

        {/* Filled Stars */}
        <div
          className="absolute top-0 left-0 h-full overflow-hidden flex text-yellow-500"
          style={{ width: `${fillPercentage}%` }}
        >

          <div className="flex">

            {[...Array(5)].map((_, i) => (

              <Star
                key={i}
                size={16}
                fill="currentColor"
                stroke="none"
                className="flex-shrink-0"
              />

            ))}

          </div>

        </div>

      </div>

      <span className='text-xs font-medium text-gray-400'>
        {ratingStr || 'No rating'}
      </span>

    </div>
  );
};

function Hotels({ trip }) {

  const hotels =
    trip?.tripData?.hotels || [];

  if (!hotels.length) return null;

  return (

    <div className='mt-10'>

      <h2 className='font-bold text-2xl mb-5'>
        Hotel Recommendation
      </h2>

      <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>

        {hotels.map((hotel, index) => {

          // DIRECTLY FROM FIRESTORE
          const imgSrc =
            hotel?.hotelImageUrl ||
            HOTEL_PLACEHOLDER;

          return (

            <Link
              key={index}
              to={`https://www.google.com/maps/search/?api=1&query=${hotel.hotelName},${hotel.hotelAddress}`}
              target='_blank'
              className="h-full"
            >

              <div className='flex flex-col h-full hover:scale-105 transition-all cursor-pointer border rounded-xl p-3 shadow-sm bg-white'>

                <img
                  src={imgSrc}
                  className='rounded-xl h-[180px] w-full object-cover flex-shrink-0 transition-opacity duration-500'
                  alt={hotel?.hotelName || 'Hotel'}
                  onError={(e) => {
                    e.target.src =
                      HOTEL_PLACEHOLDER;
                  }}
                />

                <div className='mt-3 flex flex-col flex-grow gap-1'>

                  <h2 className='font-bold text-base text-slate-900 line-clamp-1'>
                    {hotel?.hotelName}
                  </h2>

                  <h2 className='text-xs text-gray-500 flex items-start gap-1 line-clamp-2 min-h-[32px]'>
                    📍 {hotel?.hotelAddress}
                  </h2>

                  <div className='mt-auto pt-2'>

                    <h2 className='text-xs font-bold text-green-700 mb-1'>
                      💵 {hotel?.price}
                    </h2>

                    <ProportionateStars
                      ratingStr={hotel?.rating}
                    />

                  </div>

                </div>

              </div>

            </Link>
          );
        })}

      </div>

    </div>
  );
}

export default Hotels;