import Head from "next/head";
import Image from "next/image";
import Navbar from "../Components/Navbar";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/en-gb";
import styles from "../styles/Home.module.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import myEvents from "./events";
import  html2canvas from "html2canvas";
import jsPDF from "jspdf";


//To localize the format of the calendar
const localizer = momentLocalizer(moment);


export default function Home() {
    const exportPDF = () => {
        const input = document.getElementById("APP")
        html2canvas(input,{logging:true, letterRendering:1,userCors: true}).then(canvas=>{
            const imgwidth= 208;
            const imgHeight= canvas.height * imgwidth/ canvas.width;
            const imgData = canvas.toDataURL('img/png')
            const pdf = new jsPDF ('p','mm','a4');
            pdf.addImage(imgData, 'PNG',0,0,imgwidth, imgHeight);
            pdf.save("calendario.pdf")
        })

    }

    return ( 
        <div className="Home">
            <button onClick={() => exportPDF()}>Tranferir para PDF</button>

      
<div className={styles.container}>
            <Head>
                <title>Calendarium</title>
                <meta
                    name="Calendarium"
                    content="Calendar of events and exams"
                />
                <link rel="icon" href="/calendar-icon.ico" />
            </Head>
            <Navbar />

            <div id= "APP" className={styles.calendar}>
                <Calendar
                    localizer={localizer}
                    //Establishing some default definitions
                    defaultDate={new Date()}
                    defaultView="month"
                    //Custom event colors by their year (groupID)
                    eventPropGetter={(event) => {
                        var colors = [
                            "#f07c54",
                            "#f0c954",
                            "#7b54f0",
                            "#f0547b",
                            "#5ac77b",
                            "#5532a8",
                        ];

                        let newStyle = {
                            backgroundColor: colors[event.groupId],
                            border: "none",
                        };

                        return { style: newStyle };
                    }}
                    //Using the array of all events
                    events={myEvents}
                    //Limit the time for the events (Between 8:00 and 20:00)
                    min={new Date(2022, 0, 1, 8, 0)}
                    max={new Date(2022, 0, 1, 21, 0)}
                    style={{ height: "90vh" }}
                    
                />
            
           
            </div>
                        
            <div className={styles.footer}>
                <img src="/cesium-full-logo.png" width="15%" />
            </div>
            
        </div>
    
    
       </div>
    );
}
