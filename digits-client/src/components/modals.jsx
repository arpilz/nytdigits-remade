import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faStar } from '@fortawesome/free-solid-svg-icons';

export default function Modal({ header, body, isOpen, open }) {
    // creates refs for modal and the x out button
    const modalRef = useRef(null);
    const closeModal = useRef(null);

    // every time a user clicks something and a modal is visible, check if it's outside the modal container or the x, and x out if so.
    function clickOutside(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && (!ref.current.contains(event.target) || closeModal.current.contains(event.target))) {
                    open(false);
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            }
        }, [ref]);
    }

    clickOutside(modalRef);

    // returns skeleton html for modals
    return(
        <>
        <div className={`${isOpen ? "block" : "hidden"} fixed h-[100%] w-[100%] opacity-70 top-0 left-0 bg-gray-200 dark:bg-lessdarkbg z-20`}></div>
        <div ref = {modalRef} className={`${isOpen ? "visible" : "invisible"} shadow-[0px_0px_10px_5px_rgba(0,_0,_0,_0.2)] rounded-[20px] p-8 flex flex-col sm:max-w-xl w-11/12 bg-white dark:bg-darkbg absolute left-0 right-0 top-0 bottom-0 m-auto z-30 h-fit`}>
            <div ref = {closeModal} className="absolute text-black text-lg h-6 w-6 top-3 right-3 hover:cursor-pointer dark:text-white"><FontAwesomeIcon icon={ faX } className="absolute top-0 right-0 left-0 bottom-0 m-auto"/></div>
            <h3 className="text-3xl font-bold mb-1 dark:text-white">{ header }</h3>
            { body }
        </div>
        </>
    )
}

