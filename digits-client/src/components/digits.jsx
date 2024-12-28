import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faMultiply, faDivide, faUndo, faStar } from '@fortawesome/free-solid-svg-icons';
import OpsAndStars from './operations';
import Modal from './modals';

// one million props :/
export default function Digits({ numbers, target, activeTab, setActiveTab, puzzleNum, puzzleDist, calcDist, reset, resetMe, allOpEmojis, addEmoji, closeNum, setCloseNum, clipboard, generateClipboard }) {
    // these are all state variables
    const nums = numbers;
    // recording what buttons have been pressed to perform operations
    const [selectedNum, selectNum] = useState(null);
    const [secondNum, selectSNum] = useState(null);
    const [selectedOp, selectOp] = useState(null);
    // basically a temp variable that says which circle should move where when an operation is performed
    const [movingNum, moveNum] = useState(null);
    const [moveValue, calcMove] = useState();
    // if the circle should be disabled (so it doesn't reappear after another operation is performed)
    const [disabledB, disableB] = useState([]);
    // holds the absolute difference between target and closest number to target
    const [distance, calcDistance] = useState(0);
    // list of all operations (to be passed to operations)
    const [ops, AddOp] = useState([]);
    const [results, setResults] = useState(false);
    // showing the toast message for when the user copies something to their clipboard
    const [toast, toggleToast] = useState(false);
    // creates references for every circle
    const numRefs = useRef({});

    // sends statistics over for puzzle when submit button is pressed
    const addPuzzle = async (puzzleNum, stars, numOps) => {
        try {
            const response = await axios.post('http://localhost:8080/api/add_puzzle', {
                puzzleNum: puzzleNum,
                stars: stars,
                numOps: numOps,
            }, {
                withCredentials: true,
              });
        } catch (error) {
            // ruh roh
        }
      };
    
      // calls the function above
    useEffect(() => {
        if (puzzleDist[puzzleNum] != 0) {
            addPuzzle(puzzleNum, puzzleDist[puzzleNum], ops.length);
        }
    }, [puzzleDist[puzzleNum]]);

    {/* helper function to set reference hooks for each number */}
    function setRef(key, node) {
        if (node) {
          numRefs.current[key] = node;
        } else {
          delete numRefs.current[key];
        }
      };

    // calls the resetting function in App.jsx to reset this puzzle
    function resetting() {
        resetMe(puzzleNum);
      };

    {/* checks to ensure that the two values and operation clicked create a positive int, return result if so (return 0 otherwise) */}
    function checkValue(num1, num2) {
        switch(selectedOp) {
            // addition
            case faPlus:
                AddOp([...ops, `${num1} + ${num2} = ${num1 + num2}`]);
                addEmoji((allOpEmojis) => {const tempList = [...allOpEmojis]; tempList[puzzleNum] = tempList[puzzleNum] + '➕'; return tempList;});
                return num1 + num2;
            // subtraction
            case faMinus:
                if (num1-num2 > 0) {
                    AddOp([...ops, `${num1} - ${num2} = ${num1 - num2}`]);
                    addEmoji((allOpEmojis) => {const tempList = [...allOpEmojis]; tempList[puzzleNum] = tempList[puzzleNum] + '➖'; return tempList;});
                    return num1-num2;
                }
                return 0;
            // multiplication
            case faMultiply:
                AddOp([...ops, `${num1} × ${num2} = ${num1*num2}`]);
                addEmoji((allOpEmojis) => {const tempList = [...allOpEmojis]; tempList[puzzleNum] = tempList[puzzleNum] + '✖️'; return tempList;});
                return num1*num2;
            // division
            case faDivide:
                if (num1%num2 === 0) {
                    AddOp([...ops, `${num1} ÷ ${num2} = ${num1/num2}`]);
                    addEmoji((allOpEmojis) => {const tempList = [...allOpEmojis]; tempList[puzzleNum] = tempList[puzzleNum] + '➗'; return tempList;});
                    return num1/num2;
                }
                return 0;
        }
    }

    {/* updates stars on tab when clicking Submit button */}
    function submit(stars = null) {
        if (!stars) {
            calcDist(puzzleDist.with(puzzleNum, distance));
        } else {
            calcDist(puzzleDist.with(puzzleNum, stars));
        }
        setResults(true);
    }

    {/* checks if operation button can be clicked, updates state accordingly */}
    function mathButtonClick(op) {
        if (selectedNum != null && selectedOp != op) {
            selectOp(op);
        } else {
            selectOp(null);
        }
    }

    // finds closest number to target number
    function closestNum() {
        let minDifference = Number.MAX_SAFE_INTEGER; 
        let closestNum = 0;
        for (let i = 0; i < 6; i++) {
            if (!(disabledB.includes(i))) {
                let temp = numRefs.current[i].querySelector("span").innerText;
                if (Math.abs(temp - target) < minDifference) {
                    minDifference = Math.abs(temp - target);
                    closestNum = temp;
                }
            }   
        }
        // update closest number
        setCloseNum((closeNum) => ({...closeNum, [puzzleNum]: closestNum}));
        // if the difference is 0, auto submit
        if (minDifference === 0) {
            calcDistance(3);
            submit(3);
        } else if (minDifference <= 10) {
            calcDistance(2);
        } else if (minDifference <= 25) {
            calcDistance(1);
        }
    }

    function numberClick(key) {
        {/* user shouldn't be able to click on a disabled button, but just in case, makes sure it's not */}
        if (disabledB.includes(key)) {
            return 0;
        }
        {/* if you already selected number, unselect it*/}
        if (selectedNum === key) {
            selectNum(null);
            selectOp(null);
        {/* if you selected a number, an operation, and this is the second number */}
        } else if (selectedOp != null) {
            {/* checks if output is valid */}
            let num1 = (numRefs.current[selectedNum].querySelector("span").innerText)*1;
            let num2 = (numRefs.current[key].querySelector("span").innerText)*1;
            let result = checkValue(num1, num2);
            if (result != 0) {
                {/* sets second number, does the transition, updates numbers, resets everything */}
                selectSNum(key);
                moveNum(selectedNum);
                selectOp(null);
                numRefs.current[key].querySelector("span").innerText = result;
            }
        } else {
            selectNum(key);
        }
    }

    {/* makes the arithmetic buttons */}
    function OpButton({ icon }) {
        return(
            <div onClick = {() => mathButtonClick(icon)} 
                className={`${selectedOp === icon ? 'bg-nytgreen animate-pulseSmall text-white' : 'bg-black text-white dark:bg-slate-500' } select-none flex items-center justify-center text-2xl font-black rounded-full w-14 h-14 p-3`}>
                    <FontAwesomeIcon icon={ icon } /></div>
        );
    }
    {/* appearance-wise similar to the arithmetic button, but has different hooks: reset button */}
    function ResetButton() {
        return (
            <div onClick = { resetting } className="bg-nytgreen select-none flex items-center justify-center text-2xl font-black text-white dark:text-gray-200 rounded-full w-14 h-14 p-3"><FontAwesomeIcon icon={ faUndo } /></div>
        );
    }

    useEffect(() => {
        if (secondNum != null) {
            const xCalc = secondNum % 3 - (selectedNum % 3);
            {/* so i know that you're thinking these huges switches look so stupid. and i agree. but if i set the state dynamically
                in ANY WAY, it would be too slow and the number wouldn't update with the correct animation. trust me, i spent four hours
                trying to find a dynamic interpolation method but it is just too slow. and i know it's a speed issue (the default usestate
                will work, as will any static string. it's not an issue with anything else). this is actually the only way to get it fast 
                enough to work properly. */}
            if (secondNum >= 3 && selectedNum < 3) {
                switch(xCalc) {
                    case 2:
                        calcMove("transform translate-x-[180px] translate-y-[90px] duration-300 animate-disappear");
                        break;
                    case 1:
                        calcMove("transform translate-x-[90px] translate-y-[90px] duration-300");
                        break;
                    case 0:
                        calcMove(`transform translate-y-[90px] duration-300`);
                        break;
                    case -1:
                        calcMove(`transform translate-x-[-90px] translate-y-[90px] duration-300`);
                        break;
                    case -2:
                        calcMove(`transform translate-x-[-180px] translate-y-[90px] duration-300`);
                        break;
                }
            } else if (secondNum < 3 && selectedNum >= 3) {
                switch(xCalc) {
                    case 2:
                        calcMove("transform translate-x-[180px] translate-y-[-90px] duration-300");
                        break;
                    case 1:
                        calcMove("transform translate-x-[90px] translate-y-[-90px] duration-300");
                        break;
                    case 0:
                        calcMove(`transform translate-y-[-90px] duration-300`);
                        break;
                    case -1:
                        calcMove(`transform translate-x-[-90px] translate-y-[-90px] duration-300`);
                        break;
                    case -2:
                        calcMove(`transform translate-x-[-180px] translate-y-[-90px] duration-300`);
                        break;
                }
            } else {
                switch(xCalc) {
                    case 2:
                        calcMove("transform translate-x-[180px] duration-300");
                        break;
                    case 1:
                        calcMove("transform translate-x-[90px] duration-300");
                        break;
                    case -1:
                        calcMove(`transform translate-x-[-90px] duration-300`);
                        break;
                    case -2:
                        calcMove(`transform translate-x-[-180px] duration-300`);
                        break;
                }
            }

            setTimeout(() => {
                disableB([...disabledB, selectedNum]);
                selectNum(null);
                selectSNum(null);
            }, 600);
        }
      }, [secondNum]);

    // calculates the closest number every time an operation is performed
    useEffect(() => {
        closestNum();
    }, [disabledB]);

    // upon submission, check if every puzzle is answered, if so, generate content to be copied to clipboard!
    useEffect(() => {
        if (puzzleDist.every((x) => x > 0)) {
            generateClipboard();
        }
    }, [puzzleDist]);

    return (
        <>
        {/* container for puzzle, hidden if tab not selected */}
        <div className={`${activeTab === puzzleNum ? "" : "hidden"} flex flex-col sm:flex-row flex-wrap items-center content-center justify-center justify-items-center justify-self-center w-full gap-8 sm:gap-12 xl:gap-0 lg:pr-8 xl:pr-20`}>
            <div className="flex flex-col gap-4 mt-4 justify-self-center justify-items-center justify-center content-center text-center items-center w-11/12 sm:w-2/5 max-w-[500px] basis-auto">
                <h6 className="dark:text-white">Use any combination of the numbers to reach the target:</h6>
                {/* target number, bobs up and down when tab selected */}
                <h3 className={`${activeTab === puzzleNum ? "animate-upDown" : ""} font-bold text-5xl dark:text-white`}>{ target }</h3>
                <div className="grid grid-cols-3 grid-rows-2 gap-y-1 w-[17rem] h-44">
                    {/* generates each of the six numbers, with different animations based on when it's selected */}
                    {Array(6).fill(true).map((_, i) => 
                        <button disabled = { disabledB.includes(i) } onClick = {() => numberClick(i)} key = {i} ref={(node) => setRef(i, node)} className={`
                        ${selectedNum === i || secondNum === i ? "bg-nytgreen text-white scale-[1.075]" : "text-black bg-white outline-dashed dark:outline-gray-400 dark:text-white dark:bg-darkbg"} 
                        ${movingNum === i ? moveValue: "z-10" } 
                        ${disabledB.includes(i) ? "opacity-0" : "opacity-100"} 
                        ${secondNum === i ? "animate-pulseBig" : ""} 
                        ${selectedNum === i ? "animate-pulseNum" : ""} 
                        outline-[3px] select-none flex items-center justify-center justify-self-center self-center rounded-full p-[2%] w-20 h-20 text-4xl font-semibold`}>
                                <span className="mb-1">{ nums[i+1] }</span></button>)}
                </div>
                {/* operation buttons */}
                <div className="flex flex-row no-wrap gap-1 h-14 mt-3">
                    <ResetButton />
                    <OpButton icon = { faPlus } />
                    <OpButton icon = { faMinus } />
                    <OpButton icon = { faMultiply } />
                    <OpButton icon = { faDivide } />
                </div>
                {/* submit button with number of stars to be obtained shown (disabled if none) */}
                <button disabled = { distance === 0 || distance === 3 } onClick = {() => submit()} className="min-w-24 px-4 h-12 bg-yellowgreen text-black rounded-[20px] font-bold text-lg disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed dark:text-darkbg">Submit {distance === 3 ? "" : Array(distance).fill(<FontAwesomeIcon icon={ faStar } />)}</button>
                </div>
            {/*the entirety of operations.jsx to the right side of the flexbox */}
            <OpsAndStars ops = { ops } puzzleDist = { puzzleDist } />
        </div>
        {/* modal that appears when you submit a puzzle (or when it's auto-submitted) */}
        <Modal header = {""} body = { 
            <div className="flex flex-col justify-items-center justify-center items-center content-center text-center w-full">
                    <div className="flex flex-row w-full justify-center justify-items-center text-center"> 
                    {/* generates yellow stars for each one you get, and a black star for each one you don't */}
                    {Array(distance).fill(true).map((_, i) => <FontAwesomeIcon key={ i } icon={ faStar } className="text-yellowgreen text-7xl" />)}
                    {Array(3-distance).fill(true).map((_, i) => <FontAwesomeIcon key={ i } icon={ faStar } className="text-gray-500 dark:text-gray-200 text-7xl" />)}
                    </div>
                    {puzzleDist.reduce((a, b) => a+b, 0) === 15 ? <p className="dark:text-white mt-3">You've earned all 15 stars for today. Come back tomorrow for more puzzles.</p> : ""}
                    <br></br>
                    <h3 className="text-xl dark:text-white"><b>Your solution:</b></h3>
                    {ops.map((item, index) => (<p key={ index } className="dark:text-white">{ item } </p>))}
                    <br></br>
                    {/* your number vs. target number and difference */}
                    <p className="dark:text-white">Target: { target }</p>
                    <p className="dark:text-white">You got: { closeNum[puzzleNum] } </p>
                    <p className="dark:text-white">Difference: { Math.abs(target-closeNum[puzzleNum]) }</p>
                    <br></br>
                    {/* showing different buttons based on what puzzle you're on, how many you've done, and if you got three stars */}
                    {puzzleNum < 4 ? <button className="rounded-[30px] min-w-32 px-4 h-10 bg-black dark:bg-slate-500 text-white mb-2 font-bold border border-black dark:border-slate-500" onClick={() => { setActiveTab(puzzleNum+1), setResults(false)}}>Next Puzzle</button> : ""}
                    {/* didn't get three stars */}
                    { closeNum[puzzleNum] != target ? <button className="rounded-[30px] min-w-32 px-4 h-10 mb-2 font-bold border border-black dark:border-white dark:text-white" onClick={() => setResults(false)}>Keep Trying</button> : "" }
                    {/* has done every puzzle */}
                    {puzzleDist.every((x) => x > 0) ? <button className="rounded-[30px] min-w-32 px-4 h-10 mb-2 font-bold border border-yellowgreen bg-yellowgreen dark:text-darkbg" onClick={() => { navigator.clipboard.writeText(clipboard), toggleToast(true), setTimeout(() => { toggleToast(false);}, 1500)}}>Share</button> : ""}
                    
                </div> } open = {setResults} isOpen = {results} />
        {/* toast that appears when you copy your results to your clipboard */}
        <div id = "toast" className={`${toast ? "opacity-100" : "opacity-0"} transition-all duration-500 bg-darkbg w-28 h-12 px-5 py-2 text-white text-lg rounded-md flex items-center text-center justify-center absolute z-40 left-0 right-0 mx-auto top-10`}>Copied!</div>
        </>
    );
}