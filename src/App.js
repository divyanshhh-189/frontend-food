import React, { useEffect, useState } from 'react';
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setRecipe("");
  };


  function formatRecipe(recipe) {
    const lines = recipe.split('\n');
    const result = [];
    let listItems = [];

    lines.forEach((line, i) => {
      if (line.trim().startsWith('*')) {
        listItems.push(line.replace('*', '').trim());
      } else {
        // If there were list items before, push them as <ul>
        if (listItems.length > 0) {
          result.push(
              <ul key={`list-${i}`} style={{ paddingLeft: '20px' }}>
                {listItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
              </ul>
          );
          listItems = [];
        }

        // Push regular paragraph lines
        if (line.trim() !== '') {
          result.push(<p key={`p-${i}`}>{line}</p>);
        }
      }
    });

    // If the last lines are list items
    if (listItems.length > 0) {
      result.push(
          <ul key={`list-end`} style={{ paddingLeft: '20px' }}>
            {listItems.map((item, idx) => (
                <li key={idx}>{item}</li>
            ))}
          </ul>
      );
    }

    return result;
  }

  const handleGenerate = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await fetch("https://backend-food-oqk3.onrender.com/api/recipe", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setRecipe(data.recipe);
    } catch (err) {
      setRecipe("Failed to generate recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container">
        <button
            onClick={() => document.body.classList.toggle("dark")}
            className="toggle-btn"
        >
          🌓 Dark Mode
        </button>

        <h1 className="title">🍽️ Food Image to Recipe</h1>

        <div className="upload-section">
          <h2 className="section-title">Upload Your Food Image</h2>

          <input
              type="file"
              id="file-input"
              className="file-input"
              accept="image/*"
              onChange={handleFileChange}
          />

          <label htmlFor="file-input" className="custom-file-btn">
            📸 Choose File
          </label>

          {/* Optional: File preview */}
          {image && (
              <img src={preview} alt="Preview" className="preview"/>
          )}
          {image && (
              <button onClick={handleGenerate} className="generate-btn">
                🍳 Generate Recipe
              </button>
          )}


          {/*<button onClick={handleGenerate}>Generate Recipe</button>*/}
        </div>

        {loading && <div className="loader"></div>}


        {recipe && (
            <div className="card slide-up">
              <h2 className="card-title">📝 Recipe</h2>
              {/*<pre className="card-content">{recipe}</pre>*/}
              <div className="card-content">
                {formatRecipe(recipe)}
              </div>

            </div>

        )}
      </div>

  );
}

export default App;
