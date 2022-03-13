import React from 'react'

const Calendar = ({firstDayOfMonth, currentDate}) => {

    const numberOfDays=[31,28,31,30,31,30,31,31,30,31,30,31];
    const month=firstDayOfMonth.getMonth();
    const currentDay=currentDate.getDate();
    const maxDay = numberOfDays[month];

    const days = [];
    for(var i=1; i<=maxDay; i++) {
      if (i==currentDay) {
        days.push(
          <div className='place-self-center w-7 font-bold text-center text-white bg-blue-600 rounded-full hover:bg-blue-500'>
            {i}
          </div>
          );
      } else {
        days.push(
          <div className='place-self-center w-7 font-bold text-center text-white rounded-full hover:bg-white hover:bg-opacity-5'>
            {i}
          </div>
          );
      }
    }

  return (
    <div className='grid grid-cols-3 gap-2 place-content-center w-60 h-96 bg-sky-900 rounded-lg'>
    {
        days.map((day) => {
            return day;
        })
    }
    </div>
  )
}

export default Calendar