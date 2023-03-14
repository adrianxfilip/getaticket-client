import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../../Styles/CurrentContests.scss";

function ContestCard(props) {
  return (
    <Link to={"/contests/" + props.contestID}>
      <div className="contest-card" id={props.id}>
        <div className="image-wrapper">
          <img src={props.src}></img>
        </div>
        <div className="info-wrapper first-wrapper">
          <p className="prize-name">{props.name}</p>
          <p className="ticket-price">
            ${props.price}
            <br />
            <span>Preț ticket</span>
          </p>
        </div>
        <div className="info-wrapper second-wrapper">
          <div>
            <i className="fi fi-rr-clock-three"></i>
            <p className="remaining-time"> {props.remainingTime} zile</p>
          </div>
          <div>
            <i className="fi fi-rs-ticket alt"></i>
            <p className="remaining-tickets">
              {props.remainingTickets} <span>Rămase</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CurrentContests() {
  const [isScrollable, setScroll] = useState(true);
  const [contestsNumber, setNumber] = useState(0);
  const [featuredContests, setContests] = useState([]);
  const contests = useSelector((state)=>state.contestsData)

  useEffect(() => {
    if(contests){
      setContests(contests.filter((contest) => contest.featured === true));
      setNumber(featuredContests.length)
    }
  }, [contests]);

  var previousContest = 0;

  var nextContest =
    window.innerWidth > 1300 ? 4 : window.innerWidth > 800 ? 3 : 2;

  var carouselWidth =
    window.innerWidth > 1300 ? 3 : window.innerWidth > 800 ? 2 : 1;

  const handleClickScroll = (actionType) => {
    var element = "";
    if (actionType === "decrement" && isScrollable) {
      element = document.getElementById("C" + previousContest);
      if (nextContest > carouselWidth + 1) {
        if (nextContest - previousContest != carouselWidth) {
          nextContest = nextContest - 1;
        }
      }
      if (previousContest > 1) {
        previousContest = previousContest - 1;
      }
      element.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    if (actionType === "increment" && isScrollable) {
      element = document.getElementById("C" + nextContest);
      if (nextContest <= contestsNumber) {
        previousContest = nextContest - carouselWidth;
      }
      if (nextContest < 6) {
        nextContest = nextContest + 1;
      }
      element.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <div className="current-contest-section">
      <div className="section-title-container">
        <h2>Revendică-ți șansa și câștigă</h2>
        <h1>CONCURSURI ACTIVE</h1>
        <p>
          Participanții cumpără bilete iar câștigătorul se va determina prin
          tragere la sorți
        </p>
      </div>
      <div className="featured-contests-container">
        <i
          className="fi fi-rr-arrow-small-left"
          onClick={() => {
            handleClickScroll("decrement");
          }}
        ></i>
        <div className="current-contests">
          {featuredContests
            ? featuredContests.map((contest, index) => {
                let now = new Date();
                let then = new Date(contest.date);
                let difference = then.getTime() - now.getTime();
                let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                return (
                  <ContestCard
                    name={contest.name}
                    price={contest.pricePerTicket}
                    remainingTime={TotalDays}
                    remainingTickets={
                      contest.totalTickets - contest.soldTickets
                    }
                    src={contest.images[0]}
                    id={"C" + index}
                    contestID={contest._id}
                    key={index}
                  ></ContestCard>
                );
              })
            : ""}
        </div>
        <i
          className="fi fi-rr-arrow-small-right"
          onClick={() => {
            handleClickScroll("increment");
          }}
        ></i>
      </div>
    </div>
  );
}
