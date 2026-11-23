//# sourceMappingURL=app.mjs.map
import * as $float from "../gleam_stdlib/gleam/float.mjs";
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import * as $lustre from "../lustre/lustre.mjs";
import * as $attr from "../lustre/lustre/attribute.mjs";
import * as $effect from "../lustre/lustre/effect.mjs";
import * as $element from "../lustre/lustre/element.mjs";
import { none } from "../lustre/lustre/element.mjs";
import * as $html from "../lustre/lustre/element/html.mjs";
import * as $event from "../lustre/lustre/event.mjs";
import * as $builtins from "./builtins.mjs";
import * as $data from "./data.mjs";
import * as $drawing from "./drawing.mjs";
import * as $editor from "./editor.mjs";
import * as $errors from "./errors.mjs";
import * as $examples from "./examples.mjs";
import {
  Ok,
  Error,
  Empty as $Empty,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
  makeError,
} from "./gleam.mjs";
import * as $parser from "./parser.mjs";
import * as $render from "./render.mjs";
import * as $shape from "./shape.mjs";

const FILEPATH = "src\\app.gleam";

export class Model extends $CustomType {
  constructor(source, code_open, output, shape_slider, speed, drawings, current) {
    super();
    this.source = source;
    this.code_open = code_open;
    this.output = output;
    this.shape_slider = shape_slider;
    this.speed = speed;
    this.drawings = drawings;
    this.current = current;
  }
}
export const Model$Model = (source, code_open, output, shape_slider, speed, drawings, current) =>
  new Model(source, code_open, output, shape_slider, speed, drawings, current);
export const Model$isModel = (value) => value instanceof Model;
export const Model$Model$source = (value) => value.source;
export const Model$Model$0 = (value) => value.source;
export const Model$Model$code_open = (value) => value.code_open;
export const Model$Model$1 = (value) => value.code_open;
export const Model$Model$output = (value) => value.output;
export const Model$Model$2 = (value) => value.output;
export const Model$Model$shape_slider = (value) => value.shape_slider;
export const Model$Model$3 = (value) => value.shape_slider;
export const Model$Model$speed = (value) => value.speed;
export const Model$Model$4 = (value) => value.speed;
export const Model$Model$drawings = (value) => value.drawings;
export const Model$Model$5 = (value) => value.drawings;
export const Model$Model$current = (value) => value.current;
export const Model$Model$6 = (value) => value.current;

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

export class SetShapeSlider extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetShapeSlider = ($0) => new SetShapeSlider($0);
export const Msg$isSetShapeSlider = (value) => value instanceof SetShapeSlider;
export const Msg$SetShapeSlider$0 = (value) => value[0];

export class SetSpeed extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetSpeed = ($0) => new SetSpeed($0);
export const Msg$isSetSpeed = (value) => value instanceof SetSpeed;
export const Msg$SetSpeed$0 = (value) => value[0];

export class SelectDrawing extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SelectDrawing = ($0) => new SelectDrawing($0);
export const Msg$isSelectDrawing = (value) => value instanceof SelectDrawing;
export const Msg$SelectDrawing$0 = (value) => value[0];

export class NewDrawing extends $CustomType {}
export const Msg$NewDrawing$const = new NewDrawing();
export const Msg$NewDrawing = () => Msg$NewDrawing$const;
export const Msg$isNewDrawing = (value) => value instanceof NewDrawing;

export class ResetAnimation extends $CustomType {}
export const Msg$ResetAnimation$const = new ResetAnimation();
export const Msg$ResetAnimation = () => Msg$ResetAnimation$const;
export const Msg$isResetAnimation = (value) => value instanceof ResetAnimation;

const default_code = "fn draw(shape_slider: Int) -> List(Path) {\n  [Path(Line(Point(0, 0), Point(100, 100)), 0, 10, 2)]\n}\n";

/**
 * Your app's public address, once deployed.
 */
export const public_url = "";

/**
 * Set to True to include your app in the gallery.
 */
export const include_app_in_gallery = false;

/**
 * Link to your video.
 */
export const video_url = "";

/**
 * Set to True to include your video in the gallery.
 */
export const include_video_in_gallery = false;

function find_source(loop$drawings, loop$name) {
  while (true) {
    let drawings = loop$drawings;
    let name = loop$name;
    if (drawings instanceof $Empty) {
      return new Error(undefined);
    } else {
      let rest = drawings.tail;
      let key = drawings.head[0];
      let source = drawings.head[1];
      let $ = key === name;
      if ($) {
        return new Ok(source);
      } else {
        loop$drawings = rest;
        loop$name = name;
      }
    }
  }
}

function first_name(drawings) {
  if (drawings instanceof $Empty) {
    return "";
  } else {
    let name = drawings.head[0];
    return name;
  }
}

export function init(_) {
  let drawings = $data.load_drawings($examples.all);
  let _block;
  let $ = $data.load_current();
  if ($ === "") {
    _block = first_name(drawings);
  } else {
    let saved = $;
    let $1 = find_source(drawings, saved);
    if ($1 instanceof Ok) {
      _block = saved;
    } else {
      _block = first_name(drawings);
    }
  }
  let current = _block;
  let _block$1;
  let $1 = find_source(drawings, current);
  if ($1 instanceof Ok) {
    let code = $1[0];
    _block$1 = code;
  } else {
    _block$1 = default_code;
  }
  let source = _block$1;
  return [
    new Model(source, true, "", 10, 1.0, drawings, current),
    $effect.batch(
      listPrepend(
        $editor.mount(source, (var0) => { return new SetCode(var0); }),
        listPrepend(
          $effect.from(
            (dispatch) => {
              $render.set_speed(1.0);
              return dispatch(new SetCode(source));
            },
          ),
          $List$Empty$const,
        ),
      ),
    ),
  ];
}

function replace_source(drawings, name, source) {
  return $list.map(
    drawings,
    (entry) => {
      let key = entry[0];
      let old_source = entry[1];
      let $ = key === name;
      if ($) {
        return [key, source];
      } else {
        return [key, old_source];
      }
    },
  );
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

function evaluate(source, slider) {
  let $ = run_source(slider, source);
  if ($ instanceof Ok) {
    let paths = $[0];
    let rendered = $list.map(
      paths,
      (path) => { return $render.render_path(path, "#2563eb"); },
    );
    $render.set_drawing(rendered);
    return "";
  } else {
    let message = $[0];
    $render.set_drawing($List$Empty$const);
    return message;
  }
}

export function update(loop$model, loop$msg) {
  while (true) {
    let model = loop$model;
    let msg = loop$msg;
    if (msg instanceof SetCode) {
      let text = msg[0];
      let drawings = replace_source(model.drawings, model.current, text);
      $data.save_drawings(drawings);
      $data.save_current(model.current);
      let output = evaluate(text, model.shape_slider);
      return [
        new Model(
          text,
          model.code_open,
          output,
          model.shape_slider,
          model.speed,
          drawings,
          model.current,
        ),
        $effect.none(),
      ];
    } else if (msg instanceof ToggleCode) {
      return [
        new Model(
          model.source,
          !model.code_open,
          model.output,
          model.shape_slider,
          model.speed,
          model.drawings,
          model.current,
        ),
        $effect.none(),
      ];
    } else if (msg instanceof SetShapeSlider) {
      let value = msg[0];
      let _block;
      let $ = $int.parse(value);
      if ($ instanceof Ok) {
        let n = $[0];
        _block = n;
      } else {
        _block = model.shape_slider;
      }
      let slider = _block;
      let output = evaluate(model.source, slider);
      return [
        new Model(
          model.source,
          model.code_open,
          output,
          slider,
          model.speed,
          model.drawings,
          model.current,
        ),
        $effect.none(),
      ];
    } else if (msg instanceof SetSpeed) {
      let value = msg[0];
      let _block;
      let $ = $float.parse(value);
      if ($ instanceof Ok) {
        let n = $[0];
        _block = n;
      } else {
        _block = model.speed;
      }
      let speed = _block;
      $render.set_speed(speed);
      return [
        new Model(
          model.source,
          model.code_open,
          model.output,
          model.shape_slider,
          speed,
          model.drawings,
          model.current,
        ),
        $effect.none(),
      ];
    } else if (msg instanceof SelectDrawing) {
      let name = msg[0];
      if (name === "") {
        loop$model = model;
        loop$msg = Msg$NewDrawing$const;
      } else {
        let $ = find_source(model.drawings, name);
        if ($ instanceof Ok) {
          let source = $[0];
          $data.save_current(name);
          return [
            new Model(
              model.source,
              model.code_open,
              model.output,
              model.shape_slider,
              model.speed,
              model.drawings,
              name,
            ),
            $editor.mount(source, (var0) => { return new SetCode(var0); }),
          ];
        } else {
          return [model, $effect.none()];
        }
      }
    } else if (msg instanceof NewDrawing) {
      let name = $data.prompt_drawing_name();
      if (name === "") {
        return [model, $effect.none()];
      } else {
        let _block;
        let $ = find_source(model.drawings, name);
        if ($ instanceof Ok) {
          _block = model.drawings;
        } else {
          _block = $list.append(
            model.drawings,
            listPrepend([name, default_code], $List$Empty$const),
          );
        }
        let drawings = _block;
        let _block$1;
        let $1 = find_source(drawings, name);
        if ($1 instanceof Ok) {
          let code = $1[0];
          _block$1 = code;
        } else {
          _block$1 = default_code;
        }
        let source = _block$1;
        $data.save_drawings(drawings);
        $data.save_current(name);
        return [
          new Model(
            model.source,
            model.code_open,
            model.output,
            model.shape_slider,
            model.speed,
            drawings,
            name,
          ),
          $editor.mount(source, (var0) => { return new SetCode(var0); }),
        ];
      }
    } else {
      $render.reset_clock();
      let output = evaluate(model.source, model.shape_slider);
      return [
        new Model(
          model.source,
          model.code_open,
          output,
          model.shape_slider,
          model.speed,
          model.drawings,
          model.current,
        ),
        $effect.none(),
      ];
    }
  }
}

function view_drawing_select(model) {
  return $html.div(
    listPrepend($attr.class$("drawing-picker"), $List$Empty$const),
    listPrepend(
      $html.label(
        $List$Empty$const,
        listPrepend($html.text("Drawing: "), $List$Empty$const),
      ),
      listPrepend(
        $html.select(
          listPrepend(
            $attr.attribute("data-test-id", "drawing-select"),
            listPrepend(
              $attr.value(model.current),
              listPrepend(
                $event.on_change((var0) => { return new SelectDrawing(var0); }),
                $List$Empty$const,
              ),
            ),
          ),
          (() => {
            let _pipe = $list.map(
              model.drawings,
              (entry) => {
                let name = entry[0];
                return $html.option(
                  listPrepend($attr.value(name), $List$Empty$const),
                  name,
                );
              },
            );
            return $list.append(
              _pipe,
              listPrepend(
                $html.option(
                  listPrepend($attr.value(""), $List$Empty$const),
                  "+ New drawing",
                ),
                $List$Empty$const,
              ),
            );
          })(),
        ),
        $List$Empty$const,
      ),
    ),
  );
}

function view_reveal_code(model) {
  let $ = model.code_open;
  if ($) {
    return none();
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
        $html.div(
          listPrepend($attr.class$("controls"), $List$Empty$const),
          listPrepend(
            view_drawing_select(model),
            listPrepend(
              $html.div(
                listPrepend($attr.class$("slider-control"), $List$Empty$const),
                listPrepend(
                  $html.label(
                    $List$Empty$const,
                    listPrepend(
                      $html.text("Shape: " + $int.to_string(model.shape_slider)),
                      $List$Empty$const,
                    ),
                  ),
                  listPrepend(
                    $html.input(
                      listPrepend(
                        $attr.type_("range"),
                        listPrepend(
                          $attr.attribute("data-test-id", "shape-slider"),
                          listPrepend(
                            $attr.min("0"),
                            listPrepend(
                              $attr.max("100"),
                              listPrepend(
                                $attr.step("1"),
                                listPrepend(
                                  $attr.value(
                                    $int.to_string(model.shape_slider),
                                  ),
                                  listPrepend(
                                    $event.on_input(
                                      (var0) => {
                                        return new SetShapeSlider(var0);
                                      },
                                    ),
                                    $List$Empty$const,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    $List$Empty$const,
                  ),
                ),
              ),
              listPrepend(
                $html.div(
                  listPrepend($attr.class$("slider-control"), $List$Empty$const),
                  listPrepend(
                    $html.label(
                      $List$Empty$const,
                      listPrepend(
                        $html.text("Speed: " + $float.to_string(model.speed)),
                        $List$Empty$const,
                      ),
                    ),
                    listPrepend(
                      $html.input(
                        listPrepend(
                          $attr.type_("range"),
                          listPrepend(
                            $attr.attribute("data-test-id", "speed-slider"),
                            listPrepend(
                              $attr.min("-3"),
                              listPrepend(
                                $attr.max("3"),
                                listPrepend(
                                  $attr.step("0.1"),
                                  listPrepend(
                                    $attr.value($float.to_string(model.speed)),
                                    listPrepend(
                                      $event.on_input(
                                        (var0) => { return new SetSpeed(var0); },
                                      ),
                                      $List$Empty$const,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                      $List$Empty$const,
                    ),
                  ),
                ),
                listPrepend(
                  $html.button(
                    listPrepend(
                      $event.on_click(Msg$ResetAnimation$const),
                      $List$Empty$const,
                    ),
                    listPrepend($html.text("Reset"), $List$Empty$const),
                  ),
                  $List$Empty$const,
                ),
              ),
            ),
          ),
        ),
        listPrepend(
          $html.canvas(
            listPrepend(
              $attr.id("animation-canvas"),
              listPrepend($attr.class$("canvas"), $List$Empty$const),
            ),
          ),
          listPrepend(
            (() => {
              let $ = model.output;
              if ($ === "") {
                return none();
              } else {
                let message = $;
                return $html.pre(
                  listPrepend($attr.class$("output"), $List$Empty$const),
                  listPrepend($html.text(message), $List$Empty$const),
                );
              }
            })(),
            $List$Empty$const,
          ),
        ),
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
      380,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 9586,
        end: 9635,
        pattern_start: 9597,
        pattern_end: 9602
      }
    )
  }
  return undefined;
}
