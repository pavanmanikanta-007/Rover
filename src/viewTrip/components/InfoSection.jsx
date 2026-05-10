import React from 'react';

function InfoSection({ trip }) {

  const tripData = trip?.tripData || {};

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl shadow-2xl">

      <img
        src={tripData?.destinationImageUrl}
        alt={tripData?.location || 'Destination'}
        className="h-full w-full object-cover transition-opacity duration-700"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

      <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">

        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white drop-shadow-2xl md:text-4xl">
          {tripData?.location}
        </h1>

      </div>
    </div>
  );
}

export default InfoSection;