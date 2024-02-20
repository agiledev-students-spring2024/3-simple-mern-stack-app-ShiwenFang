import React, { useState, useEffect } from 'react';
import axios from 'axios';
import loadingIcon from './loading.gif';
import './AboutUs.css';

const AboutUs = () => {
    const [aboutData, setAboutData] = useState({ title: '', content: [], imageUrl: '' });
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoaded(false); // Start the fetch with the loaded state as false
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/about-us`);//`${process.env.REACT_APP_SERVER_HOSTNAME}/about-us`
                setAboutData(response.data);
                console.log(response.data.imageUrl); // Log the image URL to the console
            } catch (error) {
                console.error('Error fetching about data:', error.response || error);
                setError(`Failed to load the About Us content. Error: ${error.message}`);
            } finally {
                setLoaded(true); // Set loaded to true regardless of the outcome
            }
        };

        fetchData();
    }, []); // Empty array ensures this effect runs only once after the initial render

    if (!loaded) {
        return <img src={loadingIcon} alt="Loading..." className="AboutUs-loading" />;
    }

    if (error) {
        return <p className="AboutUs-error">{error}</p>;
    }

    return (
        <div className="about-container">
            <h1 className="about-title">{aboutData.title}</h1>
            {aboutData.content.map((paragraph, index) => (
                <p key={index} className="about-paragraph">{paragraph}</p>
            ))}
            {aboutData.imageUrl && <img src={aboutData.imageUrl} alt="About Us" className="about-image rotate-90" />}
        </div>
    );
};

export default AboutUs;
