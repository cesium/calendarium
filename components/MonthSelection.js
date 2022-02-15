const MonthSelection = ({onMonthChange, onYearChange, month, year}) => {

    //skips to the next month, can also handle if it is December
    const nextMonth = () => {
        if (month===11) {
            //if it is December (11), we set the month back to January (0), and we change year.
            onMonthChange(0);
            onYearChange(year+1);
        }
        else
            onMonthChange(month+1);
    }

    //skips to the previous month, can also handle if it is January
    const previousMonth = () => {
        if (month===0) {
            //if it is December (11), we set the month back to January (0), and we change year.
            onMonthChange(11);
            onYearChange(year-1);
        }
        else
            onMonthChange(month-1);
    }

    //Returns the month corresponding to the int month
    const showMonth = () => {
        const names = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
         "Julho",   "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
         
        return names[month];
    }
    
  return (
    <div>
        <h2>
            <button onClick={previousMonth}>&larr;</button> 
            {showMonth()} 
            <button onClick={nextMonth}>&rarr;</button>
        </h2>
    </div>
  )
}

export default MonthSelection