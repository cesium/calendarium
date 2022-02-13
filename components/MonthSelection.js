import React, { useState } from 'react'

const MonthSelection = () => {
    const [mes, setMes] = useState('Janeiro') //estado inicial é janeiro

    const onMonthChange = (e) => {
        setMes(e.target.value)
    }
    
  return (
    <div>
        <select id="months" name="months" value={mes} onChange={onMonthChange}>
            <option value="Janeiro">Janeiro</option>
            <option value="Fevereiro">Fevereiro</option>
            <option value="Março">Março</option>
            <option value="Abril">Abril</option>
            <option value="Maio">Maio</option>
            <option value="Junho">Junho</option>
            <option value="Julho">Julho</option>
            <option value="Agosto">Agosto</option>
            <option value="Setembro">Setembro</option>
            <option value="Outubro">Outubro</option>
            <option value="Novembro">Novembro</option>
            <option value="Dezembro">Dezembro</option>
        </select>
    </div>
  )
}

export default MonthSelection