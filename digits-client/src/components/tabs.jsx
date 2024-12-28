import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faQuestion, faGear, faChartSimple } from '@fortawesome/free-solid-svg-icons';
import Modal from './modals';

export default function Tabs({ numbers, activeTab, setActiveTab, puzzleDist }) {
    // toggles the different modals
    const [isHelpOpen, setHelp] = useState(false);
    const [isSettingsOpen, setTings] = useState(false);
    const [isStatsOpen, setStats] = useState(false);
    // gets a list of statistics, with default values so nothing errors while the real values are loading in
    const [statsList, setStatsList] = useState({"averageOps": 0, "numDaysPlayed": 0, "oneStar": 0, "twoStar":0, "threeStar": 0, "uniquePuzzles":0, "numGames": 0});
    // tracks dark mode, with user's local dark mode settings taking priority
    const [isDarkMode, setDarkMode] = useState(() => localStorage.getItem("dark-mode") === "true");
    const today = new Date();

    // gets user's statistics from back-end when stats modal is opened.
    const getStats = async () => {
        const response = await axios.get("http://localhost:8080/api/get_stats", { withCredentials: true, });
        setStatsList(response.data);
    };

    // function that sets state variable for dark mode
    function toggleDarkMode() {
        setDarkMode(!isDarkMode);
        document.documentElement.classList.toggle("dark", !isDarkMode);
        localStorage.setItem("dark-mode", !isDarkMode);
      };
    
    // when state var for dark mode changes, toggles dark for divs and sets overall background color. yes, it is a vanillajs solution
    useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add("dark");
        document.body.style.backgroundColor = "#202020";
    } else {
        document.documentElement.classList.remove("dark");
        document.body.style.backgroundColor = "white";
    }
    }, [isDarkMode]);

    // small component showing the slider (for dark mode, can be found when clicking on the settings modal)
    function Slider({ toggle, varToToggle }) {
        return(
        <div className={`ml-auto relative w-10 h-6 flex items-center rounded-full p-1 cursor-pointer ${isDarkMode ? "bg-nytgreen" : "bg-gray-300"}`} onClick={toggle}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${varToToggle ? "translate-x-4" : "translate-x-0"}`}></div>
        </div>
        );
    }

    // functions toggling whether different modals can be seen or not
    function toggleHelp() {
        setHelp(!isHelpOpen);
    }

    function toggleSettings() {
        setTings(!isSettingsOpen);
    }

    function toggleStats() {
        getStats();
        setStats(!isStatsOpen);
    }

    return(
        <>
        {/* Header - digits (the word itself), the date (if on a wide screen), and icons for modals (if on small screen)*/}
        <div className="flex flex-row flex-no-wrap justify-start items-end w-[100%] h-16 pl-3 sm:pl-[8%] mb-5">
            <span className="text-5xl mr-5 dark:text-white"><b>Digits</b></span> <span className="hidden sm:block text-2xl dark:text-white">{new Intl.DateTimeFormat("en-US", { month: "long" }).format(today)} {today.getDate()}, {today.getFullYear()}</span>
            <div className="md:hidden flex flex-row flex-nowrap ml-auto justify-center text-end items-end h-full gap-4 mr-3 mb-1 ">
                <FontAwesomeIcon onClick = { toggleStats } icon={ faChartSimple } className="text-3xl hover:cursor-pointer dark:text-white" />
                <FontAwesomeIcon onClick = { toggleSettings } icon={ faGear } className="text-3xl hover:cursor-pointer dark:text-white"/>
                <FontAwesomeIcon onClick = { toggleHelp } icon={ faQuestion } className="text-3xl hover:cursor-pointer dark:text-white" />
            </div>
        </div>
        {/* generates the tabs themselves*/}
        <div className="flex flex-row flex-nowrap justify-start items-end w-[100%] h-16 md:px-[10%] border-y border-b-gray-500 border-t-gray-500">
        {numbers.map((item, index) => (
            <button onClick = {() => setActiveTab(index)} className={`flex flex-col justify-center content-center items-center text-center font-bold text-xl p-3 md:w-20 w-1/5 h-14 border-t border-gray-500 
            ${index === 0 ? "border-l-0 sm:rounded-tl-md sm:border-l" : "border-l"} 
            ${index === 4 ? "sm:rounded-tr-md sm:border-r" : ""} 
            ${activeTab === index ? "bg-white text-black dark:bg-darkbg dark:text-white" : "bg-gray-200 text-gray-400 dark:bg-lessdarkbg dark:text-gray-400"}`} 
            key= { index }>
                { item.slice(0,1) } 
            <div className="flex flex-row">
        {/* shows stars for each puzzle within each tab, automatically updating based on how many stars the user has */}
        {Array(3).fill(true).map((_, i) => 
            <FontAwesomeIcon icon={ faStar } key = { i }
                className={`${puzzleDist[index] > i ? "text-yellowgreen" : ""} ${activeTab != index && puzzleDist[index] <= i ? "text-gray-400" : ""} ${activeTab === index && puzzleDist[index] <= i ? "text-black dark:text-gray-100" : ""} text-base`} />)} 
            </div></button> ))}
        {/* icons for the modals (if on a wide screen) */}
            <div className="hidden md:flex flex-row flex-nowrap ml-auto justify-center text-center items-center h-full gap-4 ">
                <FontAwesomeIcon onClick = { toggleStats } icon={ faChartSimple } className="text-3xl hover:cursor-pointer dark:text-white" />
                <FontAwesomeIcon onClick = { toggleSettings } icon={ faGear } className="text-3xl hover:cursor-pointer dark:text-white"/>
                <FontAwesomeIcon onClick = { toggleHelp } icon={ faQuestion } className="text-3xl hover:cursor-pointer dark:text-white" />
            </div>
        </div>
        {/* all of the modals, the top one is how to play, then settings, then stats */}
        <Modal header = {"How to play Digits"} body = {
            <>
            {/* these instructions were basically taken from the new york times */}
            <b className="dark:text-white">Use any combination of numbers to reach the target number.</b>
            <img className="w-[60%] max-w-[250px] mx-auto dark:hidden" src="playthrough.gif"></img> 
            <br className="dark:hidden"></br> 
            <ul className="dark:text-white -mt-3 dark:mt-0"> 
                <li> • Add, subtract, multiply, or divide to get as close to the target number as you can. </li> 
                <li> • <b>You don't have to use all 6 numbers.</b> </li> 
                <li> • To start a new calculation, select a different number. </li> 
                <li> • Calculations that produce fractions or non-positive numbers won't be accepted. </li> 
            </ul> 
            <br></br> 
            <b className="dark:text-white">Earn stars when you submit an answer that is:</b> <ul id="help-stars">  
                <li className="dark:text-white"> 
                    <FontAwesomeIcon icon={ faStar } className="text-yellowgreen text-lg" /> 
                    <FontAwesomeIcon icon={ faStar } className="text-yellowgreen text-lg" /> 
                    <FontAwesomeIcon icon={ faStar } className="text-yellowgreen text-lg" />  
                    &ensp; The target number. </li> 
                <li className="dark:text-white">  
                    <FontAwesomeIcon icon={ faStar } className="text-yellowgreen text-lg" /> 
                    <FontAwesomeIcon icon={ faStar } className="text-yellowgreen text-lg" /> 
                    <FontAwesomeIcon icon={ faStar } className="text-black dark:text-gray-200 text-lg" /> 
                    &ensp; 1 - 10 away from the target number. </li> 
                <li className="dark:text-white"> 
                    <FontAwesomeIcon icon={ faStar } className="text-yellowgreen text-lg" /> 
                    <FontAwesomeIcon icon={ faStar } className="text-black dark:text-gray-200 text-lg" /> 
                    <FontAwesomeIcon icon={ faStar } className="text-black dark:text-gray-200 text-lg" /> 
                    &ensp; 11 - 25 away from the target number. </li>  
                </ul> 
                <br></br>
                <b className="dark:text-white">New puzzles released hourly.</b></>} open = {setHelp} isOpen = {isHelpOpen} />

        <Modal header = {"Settings"} body = {<>
            <div className="mt-2 flex flex-col items-center text-center justify-start dark:text-white">
                <div className="flex flex-row justify-between w-full">
                    <span className="text-xl">Dark mode </span>
                    <Slider toggle = {toggleDarkMode} varToToggle = { isDarkMode } />
                </div>
            </div>
            <hr className="mt-3"></hr>
            {/* credits for the concept of digits, which is not mine.*/}
            <h3 className="text-2xl font-bold mb-1 mt-2 dark:text-white">Credits</h3>
            <p className="dark:text-white">This game is essentially a remake of the New York Times' Digits, which existed in Beta from April 10 to August 8 of 2023.</p> 
            <br></br>
            <p className="dark:text-white">Many thanks to the friends whose screenshots and copy-pasted results of the game helped me recreate it, and the videos on YouTube (particularly <a className="underline text-nytgreen" target="_blank" href="https://www.youtube.com/watch?v=ba0uEd19l20">here</a> and <a className="underline text-nytgreen" target="_blank" href="https://www.youtube.com/shorts/QSdowoyswhw">here</a>) that helped me figure out what the original UI looked like.</p>
            </>} open = {setTings} isOpen = {isSettingsOpen} />

        <Modal header = {"Statistics"} body = {<>
        <p className="text-lg dark:text-white">You've played a total of <b>{statsList["numGames"]}</b> times (including <b>{statsList["uniquePuzzles"]}</b> unique puzzles) over <b>{statsList["numDaysPlayed"]}</b> days. This means you play <b>{statsList["numGames"] != 0 ? (statsList["numGames"]/statsList["numDaysPlayed"]).toFixed(2) : "0"}</b> puzzles per day and <b>{statsList["numGames"] != 0 ? (statsList["numGames"]/statsList["uniquePuzzles"]).toFixed(2) : "0"}</b> times per puzzle.</p>
        <br></br>
        {/* shows average operations + stars per game*/}
        <div className="flex flex-row justify-around w-full px-3">
            <div className="flex flex-col justify-center items-center text-center">
                <div className="font-extrabold text-xl dark:text-white">{statsList["numGames"] != 0 ? statsList["averageOps"].toFixed(2) : "0"}</div>
                <div className="dark:text-white">Operations / game</div>
            </div>
            <div className="flex flex-col justify-center items-center text-center">
                <div className="font-extrabold text-xl dark:text-white">{statsList["numGames"] != 0 ? ((statsList["oneStar"] + statsList["twoStar"]*2 + statsList["threeStar"]*3)/(statsList["oneStar"] + statsList["twoStar"] + statsList["threeStar"])).toFixed(2) : "0"}</div>
                <div className="dark:text-white">Stars / game</div>
            </div>
        </div>
        <hr className="mt-3 mb-4"></hr>
        <p className={`${ statsList["numGames"] === 0 ? "" : "hidden"}`}>Maybe you should play some games first!</p>
        {/* grid with star distributions */}
        <div className={`${statsList["numGames"] === 0 ? "hidden": ""} inline-grid grid-cols-[auto_minmax(0,1fr)] grid-rows-3 gap-x-3 gap-y-1 text-end`}>
            {/* one star bar */}
            <div className="text-yellowgreen text-xl"><FontAwesomeIcon icon={ faStar } /></div>
            <div className="w-full h-full flex text-end">
                <div style= {{width: `${statsList["oneStar"]/(statsList["oneStar"] + statsList["twoStar"] + statsList["threeStar"])*100}%`}} className="rounded-md bg-gray-400 text-black h-full pr-2 truncate">
                    {(statsList["oneStar"]/(statsList["oneStar"] + statsList["twoStar"] + statsList["threeStar"])*100).toFixed()}%
                </div>
            </div>
            {/* two star bar */}
            <div className="text-yellowgreen text-xl"><FontAwesomeIcon icon={ faStar } /><FontAwesomeIcon icon={ faStar } /></div>
            <div className="w-full h-full flex text-end">
                <div style= {{width: `${statsList["twoStar"]/(statsList["oneStar"] + statsList["twoStar"] + statsList["threeStar"])*100}%`}} className="rounded-md bg-gray-400 text-black h-full pr-2 truncate">
                    {(statsList["twoStar"]/(statsList["oneStar"] + statsList["twoStar"] + statsList["threeStar"])*100).toFixed()}%
                </div>
            </div>
            {/* three star bar */}
            <div className="text-yellowgreen text-xl"><FontAwesomeIcon icon={ faStar } /><FontAwesomeIcon icon={ faStar } /><FontAwesomeIcon icon={ faStar } />  </div>
            <div className="w-full h-full flex text-end">
                <div style= {{width: `${statsList["threeStar"]/(statsList["oneStar"] + statsList["twoStar"] + statsList["threeStar"])*100}%`}} className="rounded-md bg-gray-400 text-black h-full pr-2 truncate">
                    {(statsList["threeStar"]/(statsList["oneStar"] + statsList["twoStar"] + statsList["threeStar"])*100).toFixed()}%
                </div>
            </div>
        </div>
        </>} open = {setStats} isOpen = {isStatsOpen} />
        </>
    )
}
