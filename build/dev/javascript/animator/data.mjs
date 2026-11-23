//# sourceMappingURL=data.mjs.map
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import {
  storageGet as storage_get,
  storageSet as storage_set,
  promptDrawingName as prompt_drawing_name,
} from "./data_ffi.mjs";
import {
  Ok,
  Empty as $Empty,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
} from "./gleam.mjs";

export { prompt_drawing_name, storage_get, storage_set };

const prefix = "animator.library.";

function save_entries(loop$drawings, loop$index) {
  while (true) {
    let drawings = loop$drawings;
    let index = loop$index;
    if (drawings instanceof $Empty) {
      return undefined;
    } else {
      let rest = drawings.tail;
      let name = drawings.head[0];
      let source = drawings.head[1];
      let key = prefix + $int.to_string(index);
      storage_set(key + ".name", name);
      storage_set(key + ".source", source);
      loop$drawings = rest;
      loop$index = index + 1;
    }
  }
}

export function save_drawings(drawings) {
  storage_set(prefix + "count", $int.to_string($list.length(drawings)));
  return save_entries(drawings, 0);
}

function load_entries(loop$index, loop$count) {
  while (true) {
    let index = loop$index;
    let count = loop$count;
    let $ = index >= count;
    if ($) {
      return $List$Empty$const;
    } else {
      let key = prefix + $int.to_string(index);
      let $1 = storage_get(key + ".name");
      let $2 = storage_get(key + ".source");
      if ($1 instanceof Ok && $2 instanceof Ok) {
        let name = $1[0];
        let source = $2[0];
        return listPrepend([name, source], load_entries(index + 1, count));
      } else {
        loop$index = index + 1;
        loop$count = count;
      }
    }
  }
}

export function load_drawings(defaults) {
  let $ = storage_get(prefix + "count");
  if ($ instanceof Ok) {
    let value = $[0];
    let $1 = $int.parse(value);
    if ($1 instanceof Ok) {
      let count = $1[0];
      let $2 = count > 0;
      if ($2) {
        return load_entries(0, count);
      } else {
        return defaults;
      }
    } else {
      return defaults;
    }
  } else {
    return defaults;
  }
}

export function save_current(name) {
  return storage_set(prefix + "current", name);
}

export function load_current() {
  let $ = storage_get(prefix + "current");
  if ($ instanceof Ok) {
    let name = $[0];
    return name;
  } else {
    return "";
  }
}
