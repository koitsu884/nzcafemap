import React from 'react'
import CafeCard from '../CafeCard'

export default function MapSearchResultList({ 
    cafes, 
    hoverId,
    selectedId,
    onChildMouseEnter,
    onChildMouseLeave 
}) {
    return (
        <div className="mapSearchResultList">
            {
                cafes.map(cafe => {
                    return (
                        <div 
                            key={cafe._id}
                            className={"mapSearchResultList__item" + (cafe._id === selectedId || cafe._id === hoverId ? " active" : "")}
                            onMouseEnter={() => onChildMouseEnter(cafe._id)}
                            onMouseLeave={onChildMouseLeave}
                            >
                            <CafeCard cafe={cafe} />
                        </div>
                    )
                })
            }
        </div>
    )
}
