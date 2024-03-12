import React, { useState } from 'react';
import Button from '@mui/material/Button';

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
    <div style={styles.container}>
      <div style={styles.uploadContainer}>
        <h2>Old File</h2>
        <input
          type="file"
          accept=".json"
          onChange={(event) => handleFileUpload(event, 'Old')}
          style={styles.fileInput}
        />
        <h2>New File</h2>
        <input
          type="file"
          accept=".json"
          onChange={(event) => handleFileUpload(event, 'New')}
          style={styles.fileInput}
        />
        <h2>Following File</h2>
        <input
          type="file"
          accept=".json"
          onChange={(event) => handleFileUpload(event, 'Following')}
          style={styles.fileInput}
        />
      </div>
      <Button variant="contained" color="primary" onClick={compareData} style={styles.compareButton}>Compare Data</Button>
      
      {comparisonResults && comparisonResults.results && (
        <div style={styles.resultsContainer}>
          <p style={styles.resultText}>Had: {comparisonResults.results.followersOld}</p>
          <p style={styles.resultText}>Now have: {comparisonResults.results.followersNew}</p>
          <p style={styles.resultText}>Lost followers:</p>
            <ul style={styles.resultList}>
            {comparisonResults.results.unfollowed.map((follower, index) => (
                <li key={index} style={styles.resultListItem}>
                    <a href={`https://instagram.com/${follower}`} target="_blank" rel="noopener noreferrer">
                        {follower}
                    </a>
                </li>))}
            </ul>
          <p style={styles.resultText}>Not following me back:</p>
            <ul style={styles.resultList}>
                {comparisonResults.results.unfollowedFollowing.map((follower, index) => (
                    <li key={index} style={styles.resultListItem}>
                        <a href={`https://instagram.com/${follower}`} target="_blank" rel="noopener noreferrer">
                            {follower}
                        </a>
                    </li>))}
            </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
    container: {
      fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif`,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      padding: '20px',
    },
    heading: {
      fontSize: '24px',
      marginBottom: '20px',
    },
    uploadContainer: {
      marginBottom: '20px',
    },
    fileInput: {
      marginBottom: '10px',
    },
    compareButton: {
      marginTop: '20px',
    },
    resultsContainer: {
      marginTop: '20px',
    },
    resultText: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    resultList: {
      listStyle: 'none',
      padding: 0,
    },
    resultListItem: {
      fontSize: '16px',
      marginBottom: '5px',
    },
  };
  
  export default HomePage;
