import React from 'react'

export default function SvgEdit({className, onClick}) {
    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className={className} onClick={onClick}>
            <title>edit</title>
            <path d="M17.561 2.439c-1.442-1.443-2.525-1.227-2.525-1.227l-12.826 12.825-1.010 4.762 4.763-1.010 12.826-12.823c-0.001 0 0.216-1.083-1.228-2.527zM5.68 17.217l-1.624 0.35c-0.156-0.293-0.345-0.586-0.69-0.932s-0.639-0.533-0.932-0.691l0.35-1.623 0.47-0.469c0 0 0.883 0.018 1.881 1.016 0.997 0.996 1.016 1.881 1.016 1.881l-0.471 0.468z"></path>
        </svg>
    )
}