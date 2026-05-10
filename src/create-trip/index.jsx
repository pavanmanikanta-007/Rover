import React, { useState } from "react";
import LocationInput from "../components/custom/Locationinput";
import { Input } from "../components/ui/input";
import { TravelSizeOptions, BudgetOptions } from "../constants/options";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { AI_PROMPT } from "../constants/options";
import { generateItinerary } from "../services/AIModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { FaBusAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  GetDestinationImage,
  GetHotelImage,
  GetPlaceImage,
} from "../services/imageService";
import { useAuth } from "../services/AuthProvider";

function CreateTrip() {
  const [formData, setFormData] = useState({});
  const [resetKey, setResetKey] = useState(0);
  const [openDailog, setOpenDailog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, login: authLogin } = useAuth();  // ✅ fixed parentheses

  const router = useNavigate();

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const login = useGoogleLogin({
    onSuccess: (tokenInfo) => {
      getUserProfile(tokenInfo);
    },
    onError: (error) => console.log(error),
  });

  // ✅ accepts optional userData to avoid React state async delay
  const handleGenerateTrip = async (userData) => {
    const currentUser = userData || user;

    if (!currentUser) {
      setOpenDailog(true);
      return;
    }

    try {
      const errors = [];

      if (!formData.location) errors.push("Destination 📍");
      if (!formData.days) errors.push("Number of days 📅");
      if (!formData.travelers) errors.push("Traveler type 👥");
      if (!formData.budget) errors.push("Budget 💰");

      if (errors.length > 0) {
        toast.error(`Please fill in: ${errors.join(" • ")}`);
        return;
      }

      const days = Number(formData.days);
      if (days < 1 || days > 30) {
        toast.error("Trip duration must be between 1 and 30 days 📅");
        return;
      }

      setLoading(true);

      const FINAL_PROMPT = AI_PROMPT
        .replaceAll("{location}", formData.location?.full)
        .replaceAll("{totalDays}", formData.days)
        .replaceAll("{traveler}", formData.travelers?.title)
        .replaceAll("{budget}", formData.budget?.title);

      const response = await generateItinerary(FINAL_PROMPT);

      await saveData(response);

      setFormData({});
      setResetKey((prev) => prev + 1);

    } catch (error) {
      console.error(error);

      const errorMessage = error?.message?.toLowerCase() || "";

      if (
        errorMessage.includes("503") ||
        errorMessage.includes("overloaded") ||
        errorMessage.includes("quota") ||
        errorMessage.includes("rate limit") ||
        errorMessage.includes("too many requests") ||
        errorMessage.includes("busy") ||
        errorMessage.includes("unavailable")
      ) {
        toast.error(
          "Gemini is experiencing high traffic right now 🚦 Please try again in a few moments."
        );
      } else {
        toast.error(
          "Something went wrong while generating your trip ❌"
        );
      }

      setLoading(false);
    }
  };

  const saveData = async (Tripinfo) => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      const docId = Date.now().toString();

      const parsedData = JSON.parse(Tripinfo);
      const tripData = parsedData?.tripData;
      const location = tripData?.location || "";

      // DESTINATION IMAGE
      const destinationImageUrl = await GetDestinationImage(location);
      tripData.destinationImageUrl = destinationImageUrl;

      // HOTEL IMAGES
      const updatedHotels = await Promise.all(
        (tripData?.hotels || []).map(async (hotel) => {
          const hotelImageUrl = await GetHotelImage(hotel.hotelName, location);
          return { ...hotel, hotelImageUrl };
        })
      );
      tripData.hotels = updatedHotels;

      // PLACE IMAGES
      const updatedItinerary = await Promise.all(
        (tripData?.itinerary || []).map(async (day) => {
          const updatedPlaces = await Promise.all(
            (day?.places || []).map(async (place) => {
              const placeImageUrl = await GetPlaceImage(place.placeName, location);
              return { ...place, placeImageUrl };
            })
          );
          return { ...day, places: updatedPlaces };
        })
      );
      tripData.itinerary = updatedItinerary;

      // SAVE TO FIRESTORE
      await setDoc(doc(db, "Tripsdata", docId), {
        ...parsedData,
        userChoice: formData,
        userprofile: user?.email,
        id: docId,
        createdAt: new Date(),
      });

      setLoading(false);
      toast.success("Trip generated successfully 🎉");
      router("/viewTrip/" + docId);

    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save trip");
      setLoading(false);
    }
  };

  const getUserProfile = async (tokenInfo) => {
    try {
      const resp = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "application/json",
          },
        }
      );

      authLogin(resp.data);           // ✅ updates context → Header re-renders instantly
      setOpenDailog(false);
      toast.success("Logged in successfully 🎉");
      handleGenerateTrip(resp.data);  // ✅ passes user directly, no async state delay

    } catch (error) {
      console.error(error);
      toast.error("Login failed ❌");
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">

      <h2 className="font-bold text-3xl">
        Customize Your Trip – Tailored Just for You!
      </h2>

      <p className="mt-3 text-gray-500 text-xl">
        Tell us about your trip details!
      </p>

      <div className="mt-20 flex flex-col gap-10">

        <div>
          <h2 className="text-xl my-3 font-medium">
            Enter the place you want to explore
          </h2>
          <LocationInput
            key={resetKey}
            onSelect={(place) => handleInputChange("location", place)}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning Trip
          </h2>
          <Input
            placeholder="Eg. 3"
            type="number"
            min={1}
            max={30}
            className="h-10"
            value={formData.days || ""}
            onChange={(e) => handleInputChange("days", e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            How many travelers?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5">
            {TravelSizeOptions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInputChange("travelers", item)}
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg
                  ${formData.travelers?.id === item.id
                    ? "shadow-lg border-blue-700"
                    : ""
                  }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            What is your Budget?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5">
            {BudgetOptions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInputChange("budget", item)}
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg
                  ${formData.budget?.id === item.id
                    ? "border-green-700 shadow-lg"
                    : ""
                  }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="my-10 flex justify-end">
        <Button
          disabled={loading}
          className="cursor-pointer"
          onClick={() => handleGenerateTrip()}
        >
          {loading
            ? <FaBusAlt className="h-7 w-7 animate-bounce" />
            : "Generate itinerary"
          }
        </Button>
      </div>

      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <img src="/logo.svg" className="w-32 object-contain" />
            </DialogTitle>
            <DialogDescription>
              <span className="font-bold text-lg mt-4 text-black block">
                Sign In with Google
              </span>
              <span>Sign in securely</span>
              <Button
                onClick={login}
                variant="outline"
                className="mt-3 w-full flex items-center bg-black hover:cursor-pointer"
              >
                <FcGoogle />
                Sign In with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default CreateTrip;