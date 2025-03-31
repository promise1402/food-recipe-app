import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Mealinfo = () => {
    const { mealid } = useParams();
    const [info, setInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getInfo = async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealid}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const jsonData = await response.json();
                
                if (jsonData.meals) {
                    setInfo(jsonData.meals[0]);
                } else {
                    setError("Meal not found.");
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching meal data:", err);
            }
        };

        getInfo();
    }, [mealid]);

    return (
        <div>
            {error ? (
                <p style={{ color: "red" }}>Error: {error}</p>
            ) : !info ? (
                <p>Loading...</p>
            ) : (
                <div className='mealInfo'>
                    <img src={info.strMealThumb} alt={info.strMeal} />
                    <div className='info'>
                        <h1>Recipe Detail</h1>
                        <button>{info.strMeal}</button>
                        <h3>Instructions</h3>
                        <p>{info.strInstructions}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mealinfo;
