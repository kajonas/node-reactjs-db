/**
 * MealList.jsx
 *
 * Left-panel component: displays all meal names as a scrollable list.
 * The currently selected item is highlighted.
 * An "Add" button at the top switches the right panel into "new meal" mode.
 * A small ✕ icon on each row opens a delete confirmation on click.
 *
 * Props:
 *   meals      {Array}   - full list of meal objects from the API
 *   selectedId {number|null} - id of the currently selected meal
 *   onSelect   {function(meal)} - called when a list item is clicked
 *   onAddNew   {function()}     - called when "+ Add Meal" is clicked
 *   onDelete   {function(id)}   - called when the ✕ icon is clicked
 */

export default function MealList({ meals, selectedId, onSelect, onAddNew, onDelete }) {
  return (
    <aside className="meal-list-panel">
      {/* Panel header + "Add" button */}
      <div className="meal-list-header">
        <h2>Ferculum — Items</h2>
        <button className="btn-add-meal" onClick={onAddNew}>
          + Add New Meal
        </button>
      </div>

      {/* Scrollable list of meal names */}
      <ul className="meal-list-items" role="listbox" aria-label="Meal list">
        {meals.length === 0 && (
          <li style={{ padding: '16px', color: 'var(--color-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
            No meals found. Add one!
          </li>
        )}

        {meals.map((meal) => (
          <li
            key={meal.id}
            className={`meal-list-item${selectedId === meal.id ? ' selected' : ''}`}
            role="option"
            aria-selected={selectedId === meal.id}
            onClick={() => onSelect(meal)}
          >
            <span className="meal-list-item-name">{meal.name}</span>

            {/* Delete button — stops propagation so it does not also select the row */}
            <button
              className="btn-delete-list"
              title={`Delete "${meal.name}"`}
              onClick={(e) => { e.stopPropagation(); onDelete(meal.id); }}
              aria-label={`Delete ${meal.name}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

