import React, { useEffect, useState } from "react";
import { AdminUrl } from "../Admin/constant";
import "./components/Vendors.css"

const Notifications = ({ vendorDatastate }) => {
  const [notifications, setNotifications] = useState(null);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const vendorId = vendorDatastate?.[0]?.id;
  const clearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${AdminUrl}/api/vendorNotifications/${vendorId}`
        );
        const data = await response.json();
        // Assuming the response data is an array of notification objects
        setNotifications(data);
        setIsLoading(false); // Set loading state to false after fetching notifications
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchData();
  }, [vendorId]);

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications?.filter((notification) => notification.type === filter);

  const groupedNotifications = Array.isArray(filteredNotifications)
    ? filteredNotifications.reduce((groups, notification) => {
      const dateTimeParts = notification.date.split(" "); // Split date and time
      const date = dateTimeParts[0]; // Extract the date part
      const time = dateTimeParts[1]; // Extract the time part

      if (!groups[date]) {
        groups[date] = {}; // Create a new date group if it doesn't exist
      }

      if (!groups[date][time]) {
        groups[date][time] = [];
      }

      groups[date][time].push(notification);
      return groups;
    }, {})
    : {};

  // Convert the groupedNotifications object into an array of objects
  const notificationsArray = Object.entries(groupedNotifications).map(
    ([date, times]) => ({
      date,
      times: Object.entries(times).map(([time, notifications]) => ({
        time,
        notifications,
      })),
    })
  );

  // Sort the array by date and time
  notificationsArray.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;

    // If dates are equal, compare times
    const timeA = Object.keys(a.times)[0];
    const timeB = Object.keys(b.times)[0];

    if (timeA < timeB) return -1;
    if (timeA > timeB) return 1;

    return 0;
  });

  // Convert the sorted array back into an object
  const sortedNotifications = notificationsArray.reduce(
    (groups, { date, times }) => {
      groups[date] = times.reduce((timeGroups, { time, notifications }) => {
        timeGroups[time] = notifications;
        return timeGroups;
      }, {});
      return groups;
    },
    {}
  );

  console.log(sortedNotifications);
  const dateGroups =
    notifications && Array.isArray(notifications)
      ? [
        ...new Set(
          notifications.map((notification) => notification.date.split(" ")[0])
        ),
      ]
      : [];

  // Helper function to format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for accurate comparison

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const format = (d) => d.toLocaleDateString("en-CA"); // Function to format date to "YYYY-MM-DD"
    if (format(date) === format(today)) {
      return "Today";
    } else if (format(date) === format(yesterday)) {
      return "Yesterday";
    } else if (format(date) > format(lastWeek)) {
      return "Last Week";
    } else if (format(date) > format(lastMonth)) {
      return "Last Month";
    } else {
      return "Older";
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();

    const diffInMilliseconds = now - date; // Calculate the difference in milliseconds
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000); // Convert to seconds
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} ${diffInSeconds === 1 ? "second" : "seconds"
        } ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"
        } ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
    } else {
      return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
    }
  };

  const filteredDateGroups = dateGroups
    .filter(
      (date) =>
        groupedNotifications[date] &&
        Object.keys(groupedNotifications[date]).length > 0
    )
    .sort((a, b) => new Date(b) - new Date(a));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div class="spinner"></div>
      </div>
    );
  }
  return notifications.length !== 0 ? (
    <>
      <div className="px-1">
        <div className="max-w-4xl">
          <div className="flex justify-between">
            <div className="block font-semibold text-2xl self-start">
              <p class="fashionfont text-[20px] text-[#000] font-semibold font-sans">
                Notifications
              </p>
              <p className="text-[14px] text-[#495057] leading-[20px]">
                Manage your notifications efficiently
              </p>
            </div>
            <div className="pt-6  self-end text-base leading-6 font-bold sm:text-lg sm:leading-7">
              <button
                onClick={clearNotifications}
                className="px-4 py-1 font-semibold text-base text-white rounded transition duration-300 bg-[#003032] hover:bg-[#003032]/80 hover:text-white focus:outline-none"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className="flex space-x-3 mt-10 mb-10">
            <button
              onClick={() => setFilter("All")}
              className={`px-3 py-1 bg-[#003032] hover:bg-[#003032]/80 hover:text-white text-white rounded transition duration-300 ${filter === "All" ? "bg-[#003032] text-white" : ""
                } hover:text-white focus:outline-none`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("Payment")}
              className={`px-3 py-1 bg-[#003032] hover:bg-[#003032]/80 hover:text-white text-white rounded transition duration-300 ${filter === "Payment" ? "bg-[#003032] text-white" : ""
                } hover:text-white focus:outline-none`}
            >
              Payment
            </button>
            <button
              onClick={() => setFilter("Offers")}
              className={`px-3 py-1 bg-[#003032] hover:bg-[#003032]/80 hover:text-white text-white rounded transition duration-300 ${filter === "Offers" ? "bg-[#003032] text-white" : ""
                } hover:text-white focus:outline-none`}
            >
              Offers
            </button>
          </div>
          <div className="divide-y divide-gray-200 mt-4">
            {filteredDateGroups.map((date) => (
              <div key={date} className="mt-4">
                <h2 className="text-sm font-bold mt-4 p-2 text-[#495057]">
                  {formatDate(date)}
                </h2>
                {Object.keys(sortedNotifications[date]).map((time) => (
                  <div
                    key={time}
                    className="pt-1 p-2 text-base leading-6 space-y-2 text-gray-700 sm:text-lg sm:leading-7 transition-colors duration-200 hover:bg-gray-100 rounded-lg"
                  >
                    {sortedNotifications[date][time].map((notification) => (
                      <div key={notification.id}>
                        <p className="font-bold text-[#495057]">
                          {notification.title}{" "}
                          <span className="text-sm text-[#003032]">
                            ({notification.type})
                          </span>
                        </p>
                        <p className="text-sm text-black">{notification.message}</p>
                        <p className="text-sm text-gray-500">
                          {formatTime(notification.date)}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900">No Notifications</p>
        <p className="text-gray-600">You have no notifications at this time.</p>
      </div>
    </>
  );
};

export default Notifications;
