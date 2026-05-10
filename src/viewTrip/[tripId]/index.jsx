import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../services/firebaseConfig';
import { toast } from 'sonner';

import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';

import { motion } from 'framer-motion';

function ViewTrip() {

  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (tripId) {
      GetTripData();
    }

  }, [tripId]);

  const GetTripData = async () => {

    try {

      const docRef = doc(
        db,
        'Tripsdata',
        tripId
      );

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        const data = docSnap.data();

        setTrip(data);

      } else {

        toast('No Trip Found');

      }

    } catch (err) {

      console.error(
        'Trip load error:',
        err
      );

      toast('Error loading trip');

    } finally {

      setLoading(false);

    }
  };

  // LOADING SCREEN
  if (loading) {

    return (
      <div className="flex items-center justify-center h-screen">

        <p className="text-gray-400 text-lg animate-pulse">
          Building your trip...
        </p>

      </div>
    );
  }

  // NOT FOUND
  if (!trip) {

    return (
      <div className="flex items-center justify-center h-screen">

        <p className="text-red-400 text-lg">
          Trip not found.
        </p>

      </div>
    );
  }

  return (

    <div className="p-10 md:px-20 xl:px-10">

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="px-4 md:px-10 mt-3 relative z-10"
      >

        <InfoSection trip={trip} />

      </motion.div>

      <Hotels trip={trip} />

      <PlacesToVisit trip={trip} />

    </div>
  );
}

export default ViewTrip;