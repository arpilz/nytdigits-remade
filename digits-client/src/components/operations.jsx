import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Modal from './modals';

export default function OpsAndStars({ ops, puzzleDist }) {
    // sets if modal for rank information is open or not
    const [isRankOpen, setRank] = useState(false);

    // sets the state variable above
    function toggleRank() {
        setRank(!isRankOpen);
    }

    // sets text for rank beside star-line
    function getRank() {
        let totalStars = puzzleDist.reduce((a, b) => a+b, 0);
        if (totalStars < 3) {
            return "Beginner";
        } else if (totalStars < 6) {
            return "Moving up";
        } else if (totalStars < 9) {
            return "Solid";
        } else if (totalStars < 12) {
            return "Nice";
        } else if (totalStars < 14) {
            return "Great";
        } else if (totalStars === 14) {
            return "Amazing";
        } 
        return "Genius";
    }

    // don't ask why i'm dividing by 15 sometimes and 16 others...it just looks better this way
    // position of star on star-line
    function getWidth() {
        let totalStars = puzzleDist.reduce((a, b) => a+b, 0);
        if (totalStars < 6) {
            return totalStars/15*100;
        } else if (totalStars < 15) {
            return totalStars/16*100;
        } else {
            return 100;
        }
    }

    // shows a list of all operations the user has done on a given puzzle
    function Operations({ ops }) {
        return(
            <div className ="flex flex-col flex-nowrap h-80 w-full rounded-md border border-gray-500 py-7 px-6 items-start">
                <div className="flex flex-col">
                    <div className="self-start text-lg -mt-2 mb-2 dark:text-white">{ops.length === 0 ? "Completed operations will appear here." : "Your operations:"}</div>
                    <ul>
                        {ops.map((item, index) => (<li key={ index } className="border-b-2 border-black dark:border-white mb-3 text-lg dark:text-white">{item} &#9;</li>))}
                    </ul>
                </div>
            </div>
        )
    }

    function AllStars({ puzzleDist }) {
        // if waiting to load
        if(!puzzleDist) {
            return(<></>)
        }

        return(
            <div onClick = { toggleRank } className="flex flex-row w-full h-10 justify-center text-center items-center gap-1">
                {/* makes star-line and text (line with amount of stars user has obtained) */}
                <h6 className="font-bold sm:text-sm text-xs w-3/12 dark:text-white">{ getRank() }</h6>
                <div className="flex text-center items-center h-full w-full relative">
                    <div className="w-full h-1 bg-gray-500 relative rounded-full">
                        <div className="h-full bg-nytgreen" style={{ width: `${getWidth()}%`}}></div>    
                    </div> 
                    {/* creates each possible amount of stars, with nodes for certain amounts and a star on current number of stars */}
                    <div className="flex items-center justify-between h-full w-full z-10 absolute">
                        {Array(16).fill(true).map((_, i) => <span key= {i} className={`flex items-center justify-center ${(i % 3 === 0 || i === 14) ? "h-3 aspect-square rounded-full" : ""} ${puzzleDist.reduce((a, b) => a+b, 0) < i ? "bg-gray-500" : ""} ${puzzleDist.reduce((a, b) => a+b, 0) > i ? "bg-nytgreen" : ""}`}>{puzzleDist.reduce((a, b) => a+b, 0) === i ? <FontAwesomeIcon icon={ faStar } className={`absolute top-0 bottom-0 my-auto text-yellowgreen text-xl translate-y-[-1.5px] text-center`} /> : ""}</span>)}
                    </div>
                </div>
                <div className="w-2 sm:w-3"></div>
            </div>
        )
    }

    return( 
        <div className="flex flex-col w-10/12 sm:w-3/5 sm:max-w-md h-96 gap-1">
            <AllStars puzzleDist = { puzzleDist }/>
            <Operations ops = { ops } /> 
            {/* attribution: all modal texts are taken almost word for word from the new york times' versions */}
            <Modal header = {"Rankings"} body = {<p className="dark:text-white"> Ranks are based on the total number of stars earned. The minimum stars to reach each rank are: <br></br> <br></br> <b>Beginner</b> (0) <br></br> <b>Moving Up</b> (3) <br></br> <b>Solid</b> (6) <br></br> <b>Nice</b> (9) <br></br> <b>Great</b> (12) <br></br> <b>Amazing</b> (14) <br></br> <b>Genius</b> (15) <br></br> </p>} open = {setRank} isOpen = {isRankOpen} />
        </div>
    )
}