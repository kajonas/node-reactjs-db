/**
 * MealDetail.jsx
 *
 * Right-panel component that handles three distinct UI states:
 *
 *  1. VIEW mode  – Shows all meal attributes in a read-only layout.
 *                  "Edit" button switches to EDIT mode.
 *
 *  2. EDIT mode  – All fields become editable.  Ingredients are rendered as
 *                  individual text inputs with add/remove controls.
 *                  "Save" commits the change via PUT; "Cancel" reverts.
 *
 *  3. ADD mode   – Same form as EDIT but blank, submitted via POST.
 *
 * Props:
 *   meal       {object|null}  - selected meal (null when adding a new one)
 *   mode       {'view'|'edit'|'add'}
 *   onSave     {function(data)}  - called with the updated/new meal payload
 *   onDelete   {function(id)}    - called when "Delete" is pressed in view mode
 *   onEditMode {function()}      - called to switch from view → edit
 *   onCancel   {function()}      - called to discard changes
 */

import { useState, useEffect } from 'react';

// ---------------------------------------------------------------------------
// Blank template used when adding a new meal
// ---------------------------------------------------------------------------
const BLANK_MEAL = {
  name:        '',
  calories:    '',
  cost:        '',
  ingredients: ['', '', ''],   // start with three empty ingredient slots
};

export default function MealDetail({ meal, mode, onSave, onDelete, onEditMode, onCancel }) {
  // formData mirrors the meal fields while in edit/add mode.
  const [formData, setFormData] = useState(BLANK_MEAL);
  const [saving,   setSaving]   = useState(false);
  const [formError, setFormError] = useState('');

  // Populate (or reset) formData whenever the target meal or mode changes.
  useEffect(() => {
    if (mode === 'add') {
      setFormData(BLANK_MEAL);
    } else if (meal && mode === 'edit') {
      setFormData({
        name:        meal.name,
        calories:    meal.calories,
        cost:        meal.cost,
        ingredients: [...meal.ingredients],
      });
    }
    setFormError('');
  }, [meal, mode]);

  // ---------------------------------------------------------------------------
  // Ingredient helpers
  // ---------------------------------------------------------------------------

  /** Update the text of a single ingredient slot by index. */
  const handleIngredientChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.ingredients];
      updated[index] = value;
      return { ...prev, ingredients: updated };
    });
  };

  /** Add a new empty ingredient slot (max 10). */
  const addIngredient = () => {
    setFormData((prev) => {
      if (prev.ingredients.length >= 10) return prev;
      return { ...prev, ingredients: [...prev.ingredients, ''] };
    });
  };

  /** Remove an ingredient slot by index (min 1 slot must remain). */
  const removeIngredient = (index) => {
    setFormData((prev) => {
      if (prev.ingredients.length <= 1) return prev;
      const updated = prev.ingredients.filter((_, i) => i !== index);
      return { ...prev, ingredients: updated };
    });
  };

  // ---------------------------------------------------------------------------
  // Form submission
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Client-side validation
    const trimmedIngredients = formData.ingredients.map((s) => s.trim()).filter(Boolean);
    if (!formData.name.trim()) {
      setFormError('Dish name is required.');
      return;
    }
    if (trimmedIngredients.length === 0) {
      setFormError('At least one ingredient is required.');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name:        formData.name.trim(),
        calories:    Number(formData.calories) || 0,
        cost:        parseFloat(formData.cost)  || 0,
        ingredients: trimmedIngredients,
      });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render: VIEW mode
  // ---------------------------------------------------------------------------
  if (mode === 'view' && meal) {
    return (
      <section className="detail-view">
        <h2>{meal.name}</h2>
        <p className="detail-subtitle">Cibum Descriptio — Meal Details</p>

        <div className="detail-grid">
          <span className="detail-label">Nomen Cibi</span>
          <span className="detail-value">{meal.name}</span>

          <span className="detail-label">Calores</span>
          <span className="detail-value">{meal.calories} kcal</span>

          <span className="detail-label">Pretium</span>
          <span className="detail-value cost">${Number(meal.cost).toFixed(2)}</span>

          <span className="detail-label">Ingredientia</span>
          <ul className="ingredients-list">
            {meal.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </div>

        <div className="detail-actions">
          <button className="btn btn-primary" onClick={onEditMode}>
            ✎ Edit
          </button>
          <button className="btn btn-danger" onClick={() => onDelete(meal.id)}>
            🗑 Delete
          </button>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: EDIT or ADD mode (shared form)
  // ---------------------------------------------------------------------------
  if (mode === 'edit' || mode === 'add') {
    return (
      <section className="meal-form">
        <h2>{mode === 'add' ? 'Novum Ferculum — Add New Meal' : 'Mutare Ferculum — Edit Meal'}</h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Dish name */}
          <div className="form-group">
            <label htmlFor="name">Nomen Cibi — Dish Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Pasta Carbonara"
            />
          </div>

          {/* Calories */}
          <div className="form-group">
            <label htmlFor="calories">Calores — Calories (kcal)</label>
            <input
              id="calories"
              type="number"
              min="0"
              value={formData.calories}
              onChange={(e) => setFormData((p) => ({ ...p, calories: e.target.value }))}
              placeholder="e.g. 650"
              style={{ maxWidth: '200px' }}
            />
          </div>

          {/* Cost */}
          <div className="form-group">
            <label htmlFor="cost">Pretium — Cost ($)</label>
            <input
              id="cost"
              type="number"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData((p) => ({ ...p, cost: e.target.value }))}
              placeholder="e.g. 16.99"
              style={{ maxWidth: '200px' }}
            />
          </div>

          {/* Ingredients – dynamic list (min 1, max 10) */}
          <div className="form-group">
            <label>
              Ingredientia — Ingredients&nbsp;
              <span style={{ fontStyle: 'italic', textTransform: 'none', fontWeight: 'normal' }}>
                ({formData.ingredients.length}/10)
              </span>
            </label>
            <div className="ingredients-editor">
              {formData.ingredients.map((ing, i) => (
                <div className="ingredient-row" key={i}>
                  <input
                    type="text"
                    value={ing}
                    onChange={(e) => handleIngredientChange(i, e.target.value)}
                    placeholder={`Ingredient ${i + 1}`}
                    aria-label={`Ingredient ${i + 1}`}
                  />
                  {/* Only show remove button when more than 1 ingredient exists */}
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-ingredient"
                      onClick={() => removeIngredient(i)}
                      title="Remove ingredient"
                      aria-label={`Remove ingredient ${i + 1}`}
                    >
                      −
                    </button>
                  )}
                </div>
              ))}

              {/* "Add ingredient" only shown when under the 10-item cap */}
              {formData.ingredients.length < 10 && (
                <button type="button" className="btn-add-ingredient" onClick={addIngredient}>
                  + Add Ingredient
                </button>
              )}
            </div>
          </div>

          {/* Validation error */}
          {formError && (
            <p style={{ color: 'var(--color-danger)', fontFamily: 'Arial, sans-serif', fontSize: '0.9rem', marginBottom: '12px' }}>
              ⚠ {formError}
            </p>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : '✔ Save'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: nothing selected
  // ---------------------------------------------------------------------------
  return (
    <div className="empty-state">
      <span>🍽️</span>
      <p>Elige Ferculum — Select a meal from the list</p>
      <p style={{ fontSize: '0.9rem' }}>or click <em>+ Add New Meal</em> to begin</p>
    </div>
  );
}

