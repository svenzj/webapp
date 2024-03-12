import React, { useState } from 'react';
import './App.css'; // or './index.css' depending on your project structure

function HomePage() {
  const [comparisonResults, setComparisonResults] = useState(null);

  const handleFileUpload = (event, fileType) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;
      const parsedData = JSON.parse(fileContent);
      setComparisonResults(prevState => ({
        ...prevState,
        [fileType.toLowerCase()]: parsedData
      }));
    };

    reader.readAsText(file);
  };

  const compareData = () => {
    if (comparisonResults && comparisonResults.old && comparisonResults.new && comparisonResults.following) {
      const oldList = comparisonResults.old.map(element => element.string_list_data[0].value);
      const newList = comparisonResults.new.map(element => element.string_list_data[0].value);
      const followingList = comparisonResults.following.relationships_following.map(element => element.string_list_data[0].value);

      const followersOld = oldList.length;
      const followersNew = newList.length;

      const unfollowed = oldList.filter(el => !newList.includes(el));
      const unfollowedFollowing = followingList.filter(el => !newList.includes(el));

      const results = {
        followersOld,
        followersNew,
        unfollowed,
        unfollowedFollowing
      };

      setComparisonResults(prevState => ({
        ...prevState,
        results
      }));
    } else {
      console.log("Please upload all files.");
    }
  };

  return (
    <div className="container">
      <div className="uploadContainer">
        <h2 className="glowing-btn">Old File</h2>
        <input
          type="file"
          accept=".json"
          onChange={(event) => handleFileUpload(event, 'Old')}
          className="glowing-btn"
        />
        <h2  className="glowing-btn">New File</h2>
        <input
          type="file"
          accept=".json"
          onChange={(event) => handleFileUpload(event, 'New')}
          className="glowing-btn"
        />
        <h2  className="glowing-btn">Following File</h2>
        <input
          type="file"
          accept=".json"
          onChange={(event) => handleFileUpload(event, 'Following')}
          className="glowing-btn"
        />
      </div>
      <button  className='glowing-btn' onClick={compareData}>Hit it!</button>
      
      {comparisonResults && comparisonResults.results && (
        <div className="resultsContainer">
          <p className="glowing-btn">Had: {comparisonResults.results.followersOld}</p>
          <p className="glowing-btn">Now have: {comparisonResults.results.followersNew}</p>
          <p className="glowing-btn">Lost followers:</p>
            <ul className="resultList">
            {comparisonResults.results.unfollowed.map((follower, index) => (
                <li key={index} className="resultListItem">
                    <a href={`https://instagram.com/${follower}`} target="_blank" rel="noopener noreferrer">
                        {follower}
                    </a>
                </li>))}
            </ul>
          <p className="glowing-btn">Not following me back:</p>
            <ul className="resultList">
                {comparisonResults.results.unfollowedFollowing.map((follower, index) => (
                    <li key={index} className="resultListItem">
                        <a href={`https://instagram.com/${follower}`} target="_blank" rel="noopener noreferrer" className="link-class">
                            {follower}
                        </a>
                    </li>))}
            </ul>
        </div>
      )}
    </div>
  );
}

export default HomePage;
