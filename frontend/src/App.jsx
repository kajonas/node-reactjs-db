/**
 * App.jsx  –  Taberna Gustus | Carta Ciborum
 *
 * Root component.  Owns all application state and coordinates communication
 * between the MealList (left panel) and MealDetail (right panel).
 *
 * State managed here:
 *   meals       – full list fetched from GET /api/meals
 *   selectedMeal – the currently highlighted meal object (or null)
 *   mode        – 'view' | 'edit' | 'add'
 *   loading     – true while the initial fetch is in-flight
 *   error       – error message string (or null)
 */

import { useState, useEffect, useCallback } from 'react';
import MealList   from './components/MealList';
import MealDetail from './components/MealDetail';
import { getMeals, createMeal, updateMeal, deleteMeal } from './api/api';

export default function App() {
  const [meals,        setMeals]        = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [mode,         setMode]         = useState('view');  // 'view' | 'edit' | 'add'
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  // ---------------------------------------------------------------------------
  // Load the meal list from the backend on mount
  // ---------------------------------------------------------------------------
  const loadMeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMeals();
      setMeals(data);
    } catch (err) {
      setError(`Failed to load meals: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMeals(); }, [loadMeals]);

  // ---------------------------------------------------------------------------
  // Event handlers passed down to child components
  // ---------------------------------------------------------------------------

  /** Select a meal from the list → switch to view mode. */
  const handleSelect = (meal) => {
    setSelectedMeal(meal);
    setMode('view');
  };

  /** "+ Add New Meal" button → switch to add mode, clear selection. */
  const handleAddNew = () => {
    setSelectedMeal(null);
    setMode('add');
  };

  /** "Edit" button in detail view → stay on same meal but switch to edit mode. */
  const handleEditMode = () => setMode('edit');

  /** Cancel edit/add → go back to view (or empty if nothing was selected). */
  const handleCancel = () => {
    setMode(selectedMeal ? 'view' : 'view');
  };

  /**
   * Save handler for both ADD and EDIT modes.
   * After a successful API call the list is refreshed and the right panel
   * switches back to view mode showing the newly saved meal.
   *
   * @param {object} data - { name, calories, cost, ingredients }
   */
  const handleSave = async (data) => {
    if (mode === 'add') {
      // POST – create a brand-new meal
      const created = await createMeal(data);
      await loadMeals();           // refresh full list
      setSelectedMeal(created);    // highlight the newly created row
      setMode('view');
    } else if (mode === 'edit' && selectedMeal) {
      // PUT – update the selected meal in-place
      const updated = await updateMeal(selectedMeal.id, data);
      await loadMeals();           // refresh full list (name may have changed)
      setSelectedMeal(updated);    // keep the same row selected
      setMode('view');
    }
  };

  /**
   * Delete a meal by id.
   * If the deleted meal was the one currently displayed, clear the right panel.
   *
   * @param {number} id
   */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this meal? This cannot be undone.')) return;
    try {
      await deleteMeal(id);
      await loadMeals();
      // If the deleted meal was selected, clear the detail panel.
      if (selectedMeal?.id === id) {
        setSelectedMeal(null);
        setMode('view');
      }
    } catch (err) {
      setError(`Failed to delete meal: ${err.message}`);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* ── Page header with Latin title ── */}
      <header className="page-header">
        <h1>Taberna Gustus</h1>
        <p className="subtitle">Carta Ciborum — The Restaurant Menu</p>
      </header>

      {/* ── Status bar (loading / error) ── */}
      {loading && <p className="status-bar loading">Cibus cargens… Loading meals…</p>}
      {error   && <p className="status-bar error">⚠ {error}</p>}

      {/* ── Two-column main layout ── */}
      {!loading && (
        <main className="main-layout">
          {/* Left panel – meal list */}
          <MealList
            meals={meals}
            selectedId={selectedMeal?.id ?? null}
            onSelect={handleSelect}
            onAddNew={handleAddNew}
            onDelete={handleDelete}
          />

          {/* Right panel – meal detail / edit / add form */}
          <div className="meal-detail-panel">
            <MealDetail
              meal={selectedMeal}
              mode={mode}
              onSave={handleSave}
              onDelete={handleDelete}
              onEditMode={handleEditMode}
              onCancel={handleCancel}
            />
          </div>
        </main>
      )}
    </>
  );
}

