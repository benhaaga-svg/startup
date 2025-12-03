import React from 'react';

export function globalStatsDisplay(globalStatsProp) {   
    
    console.log("Displaying global stats:", globalStatsProp);
    return (<p>Total Players: {globalStatsProp.playerCount} | Games Played: {globalStatsProp.totalGamesPlayed} | Avg Score: {globalStatsProp.averageScore} | Last Updated: {new Date(globalStatsProp.dateUpdated).toLocaleString()}</p>)
}