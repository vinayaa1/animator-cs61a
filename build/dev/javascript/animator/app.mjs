//# sourceMappingURL=app.mjs.map
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";
import * as $lustre from "../lustre/lustre.mjs";
import * as $attr from "../lustre/lustre/attribute.mjs";
import * as $effect from "../lustre/lustre/effect.mjs";
import * as $element from "../lustre/lustre/element.mjs";
import * as $html from "../lustre/lustre/element/html.mjs";
import * as $event from "../lustre/lustre/event.mjs";
import * as $builtins from "./builtins.mjs";
import * as $drawing from "./drawing.mjs";
import * as $editor from "./editor.mjs";
import * as $errors from "./errors.mjs";
import {
  Ok,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
  makeError,
} from "./gleam.mjs";
import * as $parser from "./parser.mjs";
import * as $shape from "./shape.mjs";

const FILEPATH = "src\\app.gleam";

export class Model extends $CustomType {
  constructor(source, code_open, output) {
    super();
    this.source = source;
    this.code_open = code_open;
    this.output = output;
  }
}
export const Model$Model = (source, code_open, output) =>
  new Model(source, code_open, output);
export const Model$isModel = (value) => value instanceof Model;
export const Model$Model$source = (value) => value.source;
export const Model$Model$0 = (value) => value.source;
export const Model$Model$code_open = (value) => value.code_open;
export const Model$Model$1 = (value) => value.code_open;
export const Model$Model$output = (value) => value.output;
export const Model$Model$2 = (value) => value.output;

export class SetCode extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetCode = ($0) => new SetCode($0);
export const Msg$isSetCode = (value) => value instanceof SetCode;
export const Msg$SetCode$0 = (value) => value[0];

export class ToggleCode extends $CustomType {}
export const Msg$ToggleCode$const = new ToggleCode();
export const Msg$ToggleCode = () => Msg$ToggleCode$const;
export const Msg$isToggleCode = (value) => value instanceof ToggleCode;

const default_code = "fn draw(shape_slider: Int) -> List(Path) {\n  [Path(Line(Point(0, 0), Point(100, 100)), 0, 10, 2)]\n}\n";

/**
 * Your app's public address, once you've deployed it in Problem 13, such as
 * "https://your-username.github.io/animator/".
 */
export const public_url = "";

/**
 * Set to True if you would like your app's URL included in the course gallery.
 */
export const include_app_in_gallery = false;

/**
 * A link to your video from Problem 14, which anyone with the link can watch.
 */
export const video_url = "";

/**
 * Set to True if you would like your video included in the course gallery.
 */
export const include_video_in_gallery = false;

export function init(_) {
  return [
    new Model("", true, ""),
    $effect.batch(
      listPrepend(
        $editor.mount(default_code, (var0) => { return new SetCode(var0); }),
        listPrepend(
          $effect.from(
            (dispatch) => { return dispatch(new SetCode(default_code)); },
          ),
          $List$Empty$const,
        ),
      ),
    ),
  ];
}

function run_source(shape_slider, source) {
  let $ = $parser.parse_program(source, $builtins.global_frame());
  if ($ instanceof Ok) {
    let program = $[0];
    let _pipe = $drawing.try_draw(shape_slider, program);
    return $result.map_error(_pipe, $errors.error_message);
  } else {
    return $;
  }
}

export function update(model, msg) {
  if (msg instanceof SetCode) {
    let text = msg[0];
    let $ = run_source(10, text);
    if ($ instanceof Ok) {
      let paths = $[0];
      return [
        new Model(text, model.code_open, $string.inspect(paths)),
        $effect.none(),
      ];
    } else {
      let msg$1 = $[0];
      return [new Model(text, model.code_open, msg$1), $effect.none()];
    }
  } else {
    return [
      new Model(model.source, !model.code_open, model.output),
      $effect.none(),
    ];
  }
}

function view_reveal_code(model) {
  let $ = model.code_open;
  if ($) {
    return $element.none();
  } else {
    return $html.button(
      listPrepend(
        $attr.class$("icon-btn reveal-code"),
        listPrepend(
          $attr.attribute("title", "Show code"),
          listPrepend($event.on_click(Msg$ToggleCode$const), $List$Empty$const),
        ),
      ),
      listPrepend($html.text("⟩"), $List$Empty$const),
    );
  }
}

function view_anim(model) {
  return $html.div(
    listPrepend($attr.class$("canvas-area"), $List$Empty$const),
    listPrepend(
      view_reveal_code(model),
      listPrepend(
        $html.pre(
          listPrepend($attr.class$("output"), $List$Empty$const),
          listPrepend($html.text(model.output), $List$Empty$const),
        ),
        $List$Empty$const,
      ),
    ),
  );
}

export function view(model) {
  let _block;
  let $ = model.code_open;
  if ($) {
    _block = "app";
  } else {
    _block = "app code-hidden";
  }
  let app_class = _block;
  return $html.div(
    listPrepend($attr.class$(app_class), $List$Empty$const),
    listPrepend(
      $html.div(
        listPrepend($attr.class$("code-col"), $List$Empty$const),
        listPrepend($editor.view_panel(Msg$ToggleCode$const), $List$Empty$const),
      ),
      listPrepend(view_anim(model), $List$Empty$const),
    ),
  );
}

export function main() {
  let app = $lustre.application(init, update, view);
  let $ = $lustre.start(app, "#app", undefined);
  if (!($ instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "app",
      149,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 5262,
        end: 5311,
        pattern_start: 5273,
        pattern_end: 5278
      }
    )
  }
  return undefined;
}
