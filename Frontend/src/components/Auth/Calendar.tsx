import { useState } from "react";
import {
    getDaysInMonth,
    getFirstDayOfMonth,
    isToday
} from "@/utils/calendar.utils";

import "@/assets/scss/calendar.scss"

const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const WEEKDAYS = [
    "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"
];

export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(() => {
        const today = new Date();

        return new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );
    });

    
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [tareaXD, settareaXD] = useState('')

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days: (number | null)[] = [
        ...Array<number | null>(firstDay).fill(null),
        ...Array.from(
            { length: daysInMonth },
            (_, index) => index + 1
        )
    ];

    function changeMonth(offset: number) {
        setCurrentMonth(new Date(year, month + offset, 1));
    }

    return (
        <section className="calendar">
            <header className="calendar-header">
                <button
                    type="button"
                    onClick={() => changeMonth(-1)}
                    aria-label="Mes anterior"
                >
                    ‹
                </button>

                <h2>
                    {MONTHS[month]} {year}
                </h2>

                <button
                    type="button"
                    onClick={() => changeMonth(1)}
                    aria-label="Mes siguiente"
                >
                    ›
                </button>
            </header>

            <div className="calendar-grid">


                {WEEKDAYS.map((weekday) => (
                    <div
                        key={weekday}
                        className="calendar-weekday"
                    >
                        {weekday}
                    </div>
                ))}

                {days.map((day, index) => {
                    if (day === null) {
                        return (
                            <div
                                key={`empty-${index}`}
                                className="calendar__empty"
                            />
                        );
                    }

                    const today = isToday(year, month, day);

                    const selected =
                        selectedDate.getFullYear() === year &&
                        selectedDate.getMonth() === month &&
                        selectedDate.getDate() === day;

                    const classes = [
                        "calendar__day",
                        today ? "calendar__day--today" : "",
                        selected ? "calendar__day--selected" : ""
                    ].filter(Boolean).join(" ");

                    return (
                        <button
                            key={day}
                            type="button"
                            className={classes}
                            onClick={() => {
                                setSelectedDate(
                                    new Date(year, month, day)
                                );
                            }}
                            aria-pressed={selected}
                            aria-current={today ? "date" : undefined}
                        >
                            <h3>{day}</h3>
                            <p>{tareaXD}</p>

                        </button>
                    );
                })}
            </div>

            <input 
                type="text" 
                value={tareaXD}
                onChange={(e) => settareaXD(e.target.value)}
            />
        </section>
    );
}