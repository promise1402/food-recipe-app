import React, { useEffect, useState } from 'react';
import Recipe from './Recipe';
import { NavLink, Route, Routes } from 'react-router-dom';
import Cards from './Cards';

const Food = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState(null);
    const [msg, setMsg] = useState("Search and Get Recipes");
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]); // For auto-suggestions

    const handleInput = (event) => {
        const value = event.target.value;
        setSearch(value);

        if (value.length >= 3) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]); // Clear suggestions if input is less than 3 characters
        }
    };

    // Fetch meal suggestions when user types 3+ characters
    const fetchSuggestions = async (query) => {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const jsonData = await response.json();

            if (jsonData.meals) {
                const mealNames = jsonData.meals.map(meal => meal.strMeal);
                setSuggestions(mealNames);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (mealName) => {
        setSearch(mealName);
        setSuggestions([]); // Hide suggestions after selection
        myFun(mealName); // Fetch data when a suggestion is clicked
    };

    const myFun = async (query = search) => {
        if (query.trim() === "") {
            setMsg("Please Enter Something");
            setData(null);
            return;
        }

        try {
            setLoading(true);
            setMsg("Fetching results...");
            const get = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const jsonData = await get.json();

            if (jsonData.meals) {
                setData(jsonData.meals);
                setMsg("Your Search Results");
            } else {
                setData(null);
                setMsg("No meals found! Try a different search.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setMsg("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className='head'>FOOD RECIPE APP</h1>
            <div className='container'>
                <div className='searchBar'>
                    <input 
                        placeholder='Search Meals' 
                        type='text' 
                        value={search}
                        onChange={handleInput}
                    />
                    <button onClick={() => myFun()} disabled={loading}>
                        {loading ? "Searching..." : "Search"}
                    </button>
                </div>

                {/* Display Suggestions */}
                {suggestions.length > 0 && (
                    <ul className="suggestions">
                        {suggestions.map((meal, index) => (
                            <li key={index} onClick={() => handleSuggestionClick(meal)}>
                                {meal}
                            </li>
                        ))}
                    </ul>
                )}

                <h2 className='msg'>{msg}</h2>
                <div>
                    {data ? <Cards detail={data} /> : <p className='no-result'>No results to display</p>}
                </div>
            </div>
        </>
    );
};

export default Food;
