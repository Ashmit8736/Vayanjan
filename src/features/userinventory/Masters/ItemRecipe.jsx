import React, { useState } from "react";
import "./ItemRecipe.css";

const categories = [
  { name: "All categories", count: 165 },
  { name: "Sweets", count: 42 },
  { name: "Vegetable", count: 26 },
  { name: "Snacks", count: 14 },
  { name: "Roti", count: 12 },
];

const initialRecipes = [
  { name: "Chandra Kala", category: "Sweets" },
  { name: "Emarti (imarati)", category: "Sweets" },
  { name: "Moti Pak", category: "Sweets" },
  { name: "Mango Chocolate Roll", category: "Sweets" },
  { name: "Mathura Peda", category: "Sweets" },
  { name: "Till Ladoo", category: "Sweets" },
];

const menuItems = [
  "Achari Paneer Tikka",
  "Afgani Chaap",
  "Aloo Gobhi",
  "Aloo Jeera",
  "Aloo Naan",
  "Aloo Naan Thali",
];

const ItemRecipe = () => {
  const [activeCategory, setActiveCategory] = useState("All categories");
  const [autoConsumption, setAutoConsumption] = useState(true);
  const [screen, setScreen] = useState("list");

  const [recipeList, setRecipeList] = useState(initialRecipes);

  // ADD / EDIT STATES
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  /* ================= ADD / EDIT SCREEN ================= */
  if (screen === "add") {
    const filteredItems = menuItems.filter(item =>
      item.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="recipe-page">
        <div className="recipe-header">
          <h2>{editingRecipe ? "Edit Recipe" : "Add Recipe"}</h2>

          <div className="header-actions">
            <button
              className="btn"
              onClick={() => {
                setEditingRecipe(null);
                setSelectedItem("");
                setScreen("list");
              }}
            >
              Cancel
            </button>

            <button
              className="btn create-btn"
              onClick={() => {
                if (!selectedItem) {
                  alert("Please select an item");
                  return;
                }

                if (editingRecipe) {
                  setRecipeList(prev =>
                    prev.map(r =>
                      r.name === editingRecipe.name
                        ? { ...r, name: selectedItem }
                        : r
                    )
                  );
                } else {
                  setRecipeList(prev => [
                    ...prev,
                    { name: selectedItem, category: "Sweets" },
                  ]);
                }

                setEditingRecipe(null);
                setSelectedItem("");
                setScreen("list");
              }}
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="add-form" style={{ maxWidth: "400px" }}>
          <label>Select Menu</label>

          <div className="select-box">
            <input
              type="text"
              placeholder="Select Item"
              className="select-search"
              value={selectedItem || search}
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedItem("");
                setShowDropdown(true);
              }}
            />

            {showDropdown && (
              <div className="select-dropdown">
                {filteredItems.length === 0 && (
                  <div className="select-item">No items found</div>
                )}

                {filteredItems.map((item, i) => (
                  <div
                    key={i}
                    className="select-item"
                    onClick={() => {
                      setSelectedItem(item);
                      setSearch("");
                      setShowDropdown(false);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ================= LIST SCREEN ================= */
  return (
    <div className="recipe-page">
      <div className="recipe-header">
        <h2>Recipe Management</h2>

        <div className="header-actions">
          <button
            className="btn create-btn"
            onClick={() => {
              setEditingRecipe(null);
              setSelectedItem("");
              setScreen("add");
            }}
          >
            ＋ Create New
          </button>

          <button className="btn">More Actions ▾</button>
          <button className="btn">Files ▾</button>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-left">
          <select><option>Select Item</option></select>
          <select><option>Select Category</option></select>
          <select><option>Created Recipes</option></select>

          <button className="btn search">Search</button>
          <button className="btn clear">Clear</button>
        </div>

        <div className="filter-right">
          <span>Auto Consumption</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={autoConsumption}
              onChange={() => setAutoConsumption(!autoConsumption)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="category-strip">
        {categories.map((cat, i) => (
          <div
            key={i}
            className={`category-card ${activeCategory === cat.name ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.name)}
          >
            <div className="category-title">{cat.name}</div>
            <div className="category-count">{cat.count} Items</div>
          </div>
        ))}
      </div>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>Name</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {recipeList.map((item, i) => (
              <tr key={i}>
                <td><input type="checkbox" /></td>
                <td>{item.name}</td>
                <td>{item.category}</td>

                <td>
                  {/* VIEW */}
                  <button
                    className="icon"
                    title="View"
                    onClick={() =>
                      alert(`Recipe: ${item.name}\nCategory: ${item.category}`)
                    }
                  >
                    👁️
                  </button>

                  {/* EDIT */}
                  <button
                    className="icon"
                    title="Edit"
                    onClick={() => {
                      setEditingRecipe(item);
                      setSelectedItem(item.name);
                      setScreen("add");
                    }}
                  >
                    ✏️
                  </button>

                  {/* DELETE */}
                  <button
                    className="icon"
                    title="Delete"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete?")) {
                        setRecipeList(prev =>
                          prev.filter(r => r.name !== item.name)
                        );
                      }
                    }}
                  >
                    🗑️
                  </button>

                  {/* VIEW LOGS */}
                  <button
                    className="icon"
                    title="View Logs"
                    onClick={() =>
                      alert(
                        `Logs for ${item.name}\n• Created by Admin\n• Updated Today`
                      )
                    }
                  >
                    📜
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemRecipe;

