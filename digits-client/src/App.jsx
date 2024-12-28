import { useState, useEffect } from 'react';
import Digits from './components/digits.jsx';
import Tabs from './components/tabs.jsx';
import axios from "axios";
import './tailwind.css';

export default function App() {
  // numbers for puzzle
  const [numbers, getNumbers] = useState([])
  // which puzzle is being displayed
  const [activeTab, setActiveTab] = useState(0);
  // number of stars earned for all puzzles
  const [puzzleDist, calcDist] = useState([0, 0, 0, 0, 0]);
  // closest number to target number of each puzzle
  const [closeNum, setCloseNum] = useState([0, 0, 0, 0, 0]);
  // switch to reset each puzzle
  const [reset, setR] = useState({0: '1', 1: '3', 2: '5', 3: '7', 4: '9'});
  // emojis that get added to the ending copy + paste message
  const [allOpEmojis, addEmoji] = useState(['', '', '', '', '']);
  // what gets copied to the user's clipboard at the end
  const [clipboard, setClipboard] = useState(null);
  const today = new Date();
  
  // gets puzzles from backend
  const getPuzzles = async() => {
    const response = await axios.get("http://localhost:8080/api/data");
    getNumbers(response.data.puzzles);
  } 

  // fetches cookie to get user id (id expires after 30 days of last reference)
  const fetchId = async() => {
    const meWantCookie = document.cookie.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    }, {});
    
    // if such a cookie does not exist, generate a user id
    if (!meWantCookie.id) {
      const response = await axios.get("http://localhost:8080/api/create_id");
      const { id } = response.data;
      document.cookie = `id=${id}; path=/; max-age=${24*60*60*30}; SameSite=Lax;`;
    }
  }

  // adds everything to the clipboard
  function generateClipboard() {
    let currentStars = puzzleDist.reduce((a, b) => a+b, 0);
    setClipboard(`Digits - ${new Intl.DateTimeFormat("en-US", { month: "long" }).format(today)} ${today.getDate()}, ${today.getFullYear()} (${currentStars}/15 ⭐) \n${numbers.map((item, index) => `${item[0]} (${closeNum[index]}) ${allOpEmojis[index]}`).join('\n')}`);
  }

  // forces child to its initialized state (essentially a reset)
  function resetChild(id) {
    let toChange = (id*2+1)*2;
    if (reset[id] % 2 === 0) {
      toChange = id*2+1;
    }
    setR((previous) => ({
      ...previous,
      [id]: toChange,
    }));
    // and also removes emoji operations because the operations have been wiped clean
    addEmoji((previous) => {
      const tempList = [...previous];
      tempList[id] = '';
      return tempList;
    });
  };

  // when the page loads, fetch puzzles + user id
  useEffect(() => {
      getPuzzles();
      fetchId();
    }, []);

  // so no errors are thrown while puzzles are still being fetched (plus loading screen for users)
  if (numbers.length != 5) {
    return("Please wait... generating puzzles...")
  }

  return (
    <>
    <Tabs numbers = { numbers } activeTab = { activeTab } setActiveTab = { setActiveTab } puzzleDist = { puzzleDist } />
    {numbers.map((item, index) => (
      <Digits key = { reset[index] } 
      numbers={ numbers[index] } target={ item.slice(0,1) } 
      activeTab = { activeTab } setActiveTab = { setActiveTab } 
      puzzleNum = { index } 
      puzzleDist = { puzzleDist } calcDist = { calcDist } 
      reset = { reset[index] } resetMe = { resetChild } 
      allOpEmojis = { allOpEmojis } addEmoji = { addEmoji } 
      closeNum= { closeNum } setCloseNum= { setCloseNum }
      clipboard = {clipboard } generateClipboard= { generateClipboard }/>))}
    </>
  )
}

