//// The library of saved drawings. A drawing is a name and the source of its draw
//// function.

import gleam/int
import gleam/list

// ── localStorage (data_ffi.mjs) ───────────────────────────────────────────────

/// The string stored in localStorage under key, or an Error if there isn't one.
@external(javascript, "./data_ffi.mjs", "storageGet")
pub fn storage_get(key: String) -> Result(String, Nil)

/// Store value in localStorage under key, replacing anything already there.
/// If that isn't possible, this logs the reason to the browser console.
@external(javascript, "./data_ffi.mjs", "storageSet")
pub fn storage_set(key: String, value: String) -> Nil

// ── The new-drawing prompt (data_ffi.mjs) ─────────────────────────────────────

/// Prompt the user to name a new drawing; "" (empty string) means they
/// cancelled or left it blank.
@external(javascript, "./data_ffi.mjs", "promptDrawingName")
pub fn prompt_drawing_name() -> String

// ── Drawing Library ──────────────────────────────────────────────────────────

const prefix = "animator.library."

// Save the number of drawings and their contents.
pub fn save_drawings(drawings: List(#(String, String))) -> Nil {
  storage_set(prefix <> "count", int.to_string(list.length(drawings)))

  save_entries(drawings, 0)
}

// Save each drawing separately.
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

// Load drawings from localStorage or use defaults.
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

// Load the saved drawings recursively.
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

// ── Current Drawing ──────────────────────────────────────────────────────────

// Save the selected drawing name.
pub fn save_current(name: String) -> Nil {
  storage_set(prefix <> "current", name)
}

// Restore the previously selected drawing name.
pub fn load_current() -> String {
  case storage_get(prefix <> "current") {
    Ok(name) -> name
    Error(_) -> ""
  }
}
