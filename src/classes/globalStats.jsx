import React from 'react';

export function globalStatsDisplay() {   
    
    const [statsinfo, setStatsinfo] = React.useState(JSON.parse(localStorage.getItem('globalStats') || '{"playerCount":0,"totalGamesPlayed":0,"averageScore":0,"dateUpdated":"1970-01-01T00:00:00Z"}'));

    getGlobalStats();


    async function getGlobalStats() {

        fetch('/api/globalStats')
            .then ((response) => response.json())
            .then ((data) => {
                localStorage.setItem('globalStats', JSON.stringify(data));
                setStatsinfo(data);
                return data;
            })
            .catch((error) => {
                console.error('Error fetching global stats:', error);
            });

    }

    return (<p>Total Players: {statsinfo.playerCount} | Games Played: {statsinfo.totalGamesPlayed} | Avg Score: {statsinfo.averageScore} | Last Updated: {new Date(statsinfo.dateUpdated).toLocaleString()}</p>)
}