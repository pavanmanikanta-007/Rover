import React from 'react';
import { Button } from '../../components/ui/button';
import { GrMapLocation } from 'react-icons/gr';
import { Link } from 'react-router-dom';

const PLACE_PLACEHOLDER =
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800';

function PlaceItemCard({ place, tripLocation }) {

  // DIRECTLY FROM FIRESTORE
  const imgSrc =
    place?.placeImageUrl ||
    PLACE_PLACEHOLDER;

  // BETTER GOOGLE MAPS SEARCH
  const mapQuery = encodeURIComponent(
    `${place?.placeName || ""} ${tripLocation || ""}`
  );

  return (

    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
      target='_blank'
      className='block'
    >

      <div className='shadow-md border rounded-xl p-3 mt-2 flex gap-5 hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-white h-full hover:shadow-xl'>

        <img
          src={imgSrc}
          className='w-[100px] h-[100px] md:w-[130px] md:h-[130px] rounded-xl object-cover flex-shrink-0 transition-opacity duration-500'
          alt={place.placeName || 'Place'}
          onError={(e) => {
            e.target.src =
              PLACE_PLACEHOLDER;
          }}
        />

        <div className='flex flex-col flex-grow gap-1'>

          <h2 className='font-bold text-lg line-clamp-1'>
            {place.placeName}
          </h2>

          <p className='text-sm text-gray-500 line-clamp-2 min-h-[40px]'>
            {place.placeDetails}
          </p>

          <div className='mt-auto flex items-center justify-between pt-2'>

            <h2 className='text-sm font-medium text-slate-700'>
              ⏱️ {place.travelTime}
            </h2>

            <Button
              size="sm"
              className='h-8 w-8 p-0 rounded-full'
            >
              <GrMapLocation />
            </Button>

          </div>

        </div>

      </div>

    </Link>
  );
}

export default PlaceItemCard;