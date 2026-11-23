//// The library of saved drawings. A drawing is a name and the source of its draw
//// function.

import gleam/int
import gleam/list

// ── localStorage ───────────────────────────────────────

/// Read a value from localStorage.
@external(javascript, "./data_ffi.mjs", "storageGet")
pub fn storage_get(key: String) -> Result(String, Nil)

/// Save a value to localStorage.
@external(javascript, "./data_ffi.mjs", "storageSet")
pub fn storage_set(key: String, value: String) -> Nil

// ── Drawing Name Prompt ────────────────────────────────

/// Ask the user for a new drawing name.
@external(javascript, "./data_ffi.mjs", "promptDrawingName")
pub fn prompt_drawing_name() -> String

// ── Drawing Library ────────────────────────────────────

const prefix = "animator.library."

// Save all drawings to localStorage.
pub fn save_drawings(drawings: List(#(String, String))) -> Nil {
  storage_set(prefix <> "count", int.to_string(list.length(drawings)))

  save_entries(drawings, 0)
}

// Save the name and source code of each drawing.
fn save_entries(drawings: List(#(String, String)), index: Int) -> Nil {
  case drawings {
    [] -> Nil

    [#(name, source), ..rest] -> {
      let key = prefix <> int.to_string(index)

      storage_set(key <> ".name", name)
      storage_set(key <> ".source", source)

      save_entries(rest, index + 1)
    }
  }
}

// Restore saved drawings, or load examples by default.
pub fn load_drawings(
  defaults: List(#(String, String)),
) -> List(#(String, String)) {
  case storage_get(prefix <> "count") {
    Ok(value) ->
      case int.parse(value) {
        Ok(count) ->
          case count > 0 {
            True -> load_entries(0, count)
            False -> defaults
          }

        Error(_) -> defaults
      }

    Error(_) -> defaults
  }
}

// Load each drawing from localStorage.
fn load_entries(index: Int, count: Int) -> List(#(String, String)) {
  case index >= count {
    True -> []

    False -> {
      let key = prefix <> int.to_string(index)

      case storage_get(key <> ".name"), storage_get(key <> ".source") {
        Ok(name), Ok(source) -> [
          #(name, source),
          ..load_entries(index + 1, count)
        ]

        _, _ -> load_entries(index + 1, count)
      }
    }
  }
}

// ── Current Drawing ────────────────────────────────────

// Save the currently selected drawing.
pub fn save_current(name: String) -> Nil {
  storage_set(prefix <> "current", name)
}

// Restore the previously selected drawing.
pub fn load_current() -> String {
  case storage_get(prefix <> "current") {
    Ok(name) -> name
    Error(_) -> ""
  }
}
