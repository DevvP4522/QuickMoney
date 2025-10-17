import React, {useEffect} from 'react'
import AOS from "aos";
import "aos/dist/aos.css";
import { Link, Routes, Route, useNavigate } from "react-router-dom";

const Visit = () => {
    
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);
  return (
  <>
  <div className='container'style={{justifyContent:"center",alignItems: "center",textAlign: "center"}}>
      <div>
        <h1>
            Contact US
        </h1>
      
        <div className='container' id='in' style={{justifyContent:"center",
            alignItems: "center",
            textAlign: "center" ,
             marginTop: "1rem",
             padding: "0.6rem"
             }}
             data-aos="fade-right"
             >
                <img style={{height : "7rem" , width : "7rem", borderRadius:"5rem",boxShadow:"0px 0px 10px red"}}   onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow =
                  "0px 8px 38px black";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0px 4px 30px yellow";
              }} src='VinayPIC (2).jpg'></img>     
        </div>
        <div className='container' id='in' style={{justifyContent:"center",
            alignItems: "center",
            textAlign: "center" ,
             boxShadow: "0px 0px 10px black",
             marginTop: "1rem",
             padding: "0.6rem"
             }}
             onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow =
                  "0px 8px 38px black";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0px 4px 30px black";
              }}
             data-aos="fade-left"
             >
                    <div className='container'>
                        <h4>Hey There, am Vinay Patel From Jabalpur (MP), INDIA</h4>
                    </div>
        </div>
        <div className='container' id='in' style={{justifyContent:"center",
            alignItems: "center",
            textAlign: "center" ,
             boxShadow: "0px 0px 10px black",
             marginTop: "1rem"
             }}
             onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0px 8px 38px black";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0px 4px 30px black";
              }}
             data-aos="fade-right"
             >
                    <div className='container'>
                        <h4>Wanna Show More Project On Github</h4>
                       <Link to={"https://github.com/VinaySinghPatel"}>GitHub</Link>
                    </div>
        </div>
        <div className='container' id='in' style={{justifyContent:"center",
            alignItems: "center",
            textAlign: "center" ,
             boxShadow: "0px 0px 10px black",
             marginTop: "1rem"
             }}
             onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0px 8px 38px black";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0px 4px 30px black";
              }}
             data-aos="fade-left"
             >
                    <div className='container'>
                        <h4>Also Contact us on Instagram</h4>
                       <Link to={"https://www.instagram.com/singh_vinay_patel/"}>Instagram</Link>
                    </div>
        </div>
        <div className='container' style={{justifyContent:"center",
            alignItems: "center",
            textAlign: "center" ,
             boxShadow: "0px 0px 10px black",
             marginTop: "1rem"
             }}
             onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0px 8px 38px black";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0px 4px 30px black";
              }}
             data-aos="fade-right"
             >
                    <div className='container'>
                        <h4>Our PortFolio</h4>
                       <Link to={"https://vinaysinghpatel.github.io/officialWeb/?fbclid=PAZXh0bgNhZW0CMTEAAabTMnbdWyjnpOi-OiTJAtTH1qxeJU7sn1LYzzqHrLUWSH93yoMth7ReR3c_aem_704Xw-TVxweqUtRq-fbo3g"}>Visit us</Link>
                    </div>
        </div>
     
      </div>
    </div>
  </>
  )
}

export default Visit
