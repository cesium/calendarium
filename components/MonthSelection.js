import { useState } from 'react'

const MonthSelection = ({onMonthChange, onYearChange}) => {
    const [month, setMonth] = useState(0) //estado inicial é janeiro
    const [year, setYear] = useState(2020)

    //skips to the next month, can also handle if it is December
    const nextMonth = () => {
        if (month===11) {
            //if it is December (11), we set the month back to January (0), and we change year.
            setMonth(0)
            setYear(year + 1)
            onYearChange //calls function onYearChange??
        }
        else setMonth(month + 1)

        onMonthChange //calls function onMonthChange??
    }

    //skips to the previous month, can also handle if it is January
    const previousMonth = () => {
        if (month===0) {
            //if it is December (11), we set the month back to January (0), and we change year.
            setMonth(11)
            setYear(year - 1)
            onYearChange
        }
        else setMonth(month - 1)

        onMonthChange
    }

    //Returns the month corresponding to the int month
    const showMonth = () => {
        switch (month) {
            case 0: return "Janeiro";
            case 1: return "Fevereiro";
            case 2: return "Março";
            case 3: return "Abril";
            case 4: return "Maio";
            case 5: return "Junho";
            case 6: return "Julho";
            case 7: return "Agosto";
            case 8: return "Setembro";
            case 9: return "Outubro";
            case 10: return "Novembro";
            case 11: return "Dezembro";
        }
    }
    
  return (
    <div>
        <button onClick={previousMonth}>&larr;</button>
        <text>{showMonth()}</text>
        <button onClick={nextMonth}>&rarr;</button>
    </div>
  )
}

export default MonthSelection