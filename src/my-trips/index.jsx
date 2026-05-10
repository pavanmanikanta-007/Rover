import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {

  const navigate = useNavigate();

  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetUserTrips();
  }, []);

  /**
   * used to get all user trips
   */
  const GetUserTrips = async () => {

    try {

      setLoading(true);

      const user = JSON.parse(localStorage.getItem('user'));

      if (!user) {
        navigate('/');
        return;
      }

      const q = query(
        collection(db, "Tripsdata"),
        where("userprofile", "==", user.email)
      );

      const querySnapshot = await getDocs(q);

      const trips = [];

      querySnapshot.forEach((doc) => {
        trips.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setUserTrips(trips);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10 min-h-screen pb-10'>

      <h2 className='font-bold text-3xl'>
        My Trips
      </h2>

      <p className='text-gray-500 mt-2'>
        View and manage all your travel plans
      </p>

      <div className='mt-8'>

        {
          loading ? (

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pd-5'>

              {[1, 2, 3].map((item, index) => (

                <UserTripCardItem
                  key={index}
                  loading={true}
                />

              ))}

            </div>

          ) : userTrips.length > 0 ? (

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>

              {userTrips.map((trip, index) => (

                <UserTripCardItem
                  key={index}
                  trip={trip}
                  loading={false}
                />

              ))}

            </div>

          ) : (

            <div className='flex flex-col items-center justify-center py-28 text-center border rounded-3xl mt-10 bg-gray-50'>

              <div className='text-6xl'>
                ✈️
              </div>

              <h2 className='text-3xl font-bold mt-5'>
                No Trips Yet
              </h2>

              <p className='text-gray-500 mt-3 max-w-md'>
                Looks like you haven’t created any trips yet.
                Start planning your first unforgettable journey now.
              </p>

              <button
                onClick={() => navigate('/create-trip')}
                className='mt-8 bg-black text-white px-8 py-3 rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg'
              >
                Create Your First Trip
              </button>

            </div>

          )
        }

      </div>

    </div>
  )
}

export default MyTrips;


//     setUserTrips([]);
// querySnapshot.forEach((doc) => {
//   // console.log(doc.id, " => ", doc.data());
//   setUserTrips(pervVal=>[...pervVal,doc.data()])
// });