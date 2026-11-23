//// Animator -- an application for program-generated drawings.

import builtins
import data
import drawing
import editor
import errors
import examples
import gleam/float
import gleam/int
import gleam/list
import gleam/result
import lustre
import lustre/attribute as attr
import lustre/effect.{type Effect}
import lustre/element.{type Element, none}
import lustre/element/html
import lustre/event
import parser
import render
import shape.{type Path}

pub const public_url = ""

pub const include_app_in_gallery = False

pub const video_url = ""

pub const include_video_in_gallery = False

const default_code =
  "fn draw(shape_slider: Int) -> List(Path) {\n  [Path(Line(Point(0, 0), Point(100, 100)), 0, 10, 2)]\n}\n"

// ── Model ──────────────────────────────────────────────

pub type Model {
  Model(
    source: String,
    code_open: Bool,
    output: String,
    shape_slider: Int,
    speed: Float,
    drawings: List(#(String, String)),
    current: String,
  )
}

pub type Msg {
  SetCode(String)
  ToggleCode
  SetShapeSlider(String)
  SetSpeed(String)
  SelectDrawing(String)
  NewDrawing
  ResetAnimation
}

// ── Initialization ────────────────────────────────────

pub fn init(_flags: Nil) -> #(Model, Effect(Msg)) {
  let drawings = data.load_drawings(examples.all)

  let saved = data.load_current()

  let current = case find_source(drawings, saved) {
    Ok(_) -> saved
    Error(_) -> first_name(drawings)
  }

  let source = case find_source(drawings, current) {
    Ok(code) -> code
    Error(_) -> default_code
  }

  #(
    Model(
      source: source,
      code_open: True,
      output: "",
      shape_slider: 10,
      speed: 1.0,
      drawings: drawings,
      current: current,
    ),
    effect.batch([
      editor.mount(source, SetCode),
      effect.from(fn(dispatch) {
        render.set_speed(1.0)
        dispatch(SetCode(source))
      }),
    ]),
  )
}

// ── Drawing Helpers ────────────────────────────────────

fn first_name(drawings: List(#(String, String))) -> String {
  case drawings {
    [#(name, _), ..] -> name
    [] -> ""
  }
}

fn find_source(
  drawings: List(#(String, String)),
  name: String,
) -> Result(String, Nil) {
  case drawings {
    [] -> Error(Nil)
    [#(key, source), ..rest] ->
      case key == name {
        True -> Ok(source)
        False -> find_source(rest, name)
      }
  }
}

fn replace_source(
  drawings: List(#(String, String)),
  name: String,
  source: String,
) -> List(#(String, String)) {
  list.map(drawings, fn(entry) {
    let #(key, old_source) = entry

    case key == name {
      True -> #(key, source)
      False -> #(key, old_source)
    }
  })
}

// ── Parsing and Evaluation ─────────────────────────────

fn run_source(shape_slider: Int, source: String) -> Result(List(Path), String) {
  case parser.parse_program(source, builtins.global_frame()) {
    Error(msg) -> Error(msg)
    Ok(program) ->
      drawing.try_draw(shape_slider, program)
      |> result.map_error(errors.error_message)
  }
}

fn evaluate(source: String, slider: Int) -> String {
  case run_source(slider, source) {
    Ok(paths) -> {
      let rendered =
        list.map(paths, fn(path) { render.render_path(path, "#2563eb") })

      render.set_drawing(rendered)
      ""
    }

    Error(message) -> {
      render.set_drawing([])
      message
    }
  }
}

// ── Update ─────────────────────────────────────────────

pub fn update(model: Model, msg: Msg) -> #(Model, Effect(Msg)) {
  case msg {
    ToggleCode -> #(Model(..model, code_open: !model.code_open), effect.none())

    SetCode(text) -> {
      let drawings = replace_source(model.drawings, model.current, text)

      data.save_drawings(drawings)
      data.save_current(model.current)

      let output = evaluate(text, model.shape_slider)

      #(
        Model(..model, source: text, drawings: drawings, output: output),
        effect.none(),
      )
    }

    SetShapeSlider(value) -> {
      let slider = case int.parse(value) {
        Ok(n) -> n
        Error(_) -> model.shape_slider
      }

      let output = evaluate(model.source, slider)

      #(Model(..model, shape_slider: slider, output: output), effect.none())
    }

    SetSpeed(value) -> {
      let speed = case float.parse(value) {
        Ok(n) -> n
        Error(_) ->
          case int.parse(value) {
            Ok(n) -> int.to_float(n)
            Error(_) -> model.speed
          }
      }

      render.set_speed(speed)

      #(Model(..model, speed: speed), effect.none())
    }

    SelectDrawing(name) -> {
      case name {
        "" -> update(model, NewDrawing)

        _ ->
          case find_source(model.drawings, name) {
            Error(_) -> #(model, effect.none())

            Ok(source) -> {
              data.save_current(name)
              let output = evaluate(source, model.shape_slider)

              #(
                Model(..model, current: name, source: source, output: output),
                editor.mount(source, SetCode),
              )
            }
          }
      }
    }

    NewDrawing -> {
      let name = data.prompt_drawing_name()

      case name {
        "" -> #(model, effect.none())

        _ -> {
          let drawings = case find_source(model.drawings, name) {
            Ok(_) -> model.drawings
            Error(_) -> list.append(model.drawings, [#(name, default_code)])
          }

          let source = case find_source(drawings, name) {
            Ok(code) -> code
            Error(_) -> default_code
          }

          data.save_drawings(drawings)
          data.save_current(name)

          let output = evaluate(source, model.shape_slider)

          #(
            Model(
              ..model,
              current: name,
              source: source,
              drawings: drawings,
              output: output,
            ),
            editor.mount(source, SetCode),
          )
        }
      }
    }

    ResetAnimation -> {
      render.reset_clock()

      let output = evaluate(model.source, model.shape_slider)

      #(Model(..model, output: output), effect.none())
    }
  }
}

// ── View ───────────────────────────────────────────────

pub fn view(model: Model) -> Element(Msg) {
  let app_class = case model.code_open {
    True -> "app"
    False -> "app code-hidden"
  }

  html.div([attr.class(app_class)], [
    html.div([attr.class("code-col")], [
      editor.view_panel(ToggleCode),
    ]),
    view_anim(model),
  ])
}

fn view_anim(model: Model) -> Element(Msg) {
  html.div([attr.class("canvas-area")], [
    view_reveal_code(model),

    html.div([attr.class("controls")], [
      view_drawing_select(model),

      html.div([attr.class("slider-control")], [
        html.label([], [
          html.text("Shape: " <> int.to_string(model.shape_slider)),
        ]),
        html.input([
          attr.type_("range"),
          attr.attribute("data-test-id", "shape-slider"),
          attr.min("0"),
          attr.max("100"),
          attr.step("1"),
          attr.value(int.to_string(model.shape_slider)),
          event.on_input(SetShapeSlider),
        ]),
      ]),

      html.div([attr.class("slider-control")], [
        html.label([], [
          html.text("Speed: " <> float.to_string(model.speed)),
        ]),
        html.input([
          attr.type_("range"),
          attr.attribute("data-test-id", "speed-slider"),
          attr.min("-3"),
          attr.max("3"),
          attr.step("0.1"),
          attr.value(float.to_string(model.speed)),
          event.on_input(SetSpeed),
        ]),
      ]),

      html.button([event.on_click(ResetAnimation)], [html.text("Reset")]),
    ]),

    html.canvas([
      attr.id("animation-canvas"),
      attr.class("canvas"),
    ]),

    case model.output {
      "" -> none()
      message -> html.pre([attr.class("output")], [html.text(message)])
    },
  ])
}

// ── Drawing Selection ──────────────────────────────────

fn view_drawing_select(model: Model) -> Element(Msg) {
  html.div([attr.class("drawing-picker")], [
    html.label([], [
      html.text("Drawing: "),
    ]),

    html.select(
      [
        attr.attribute("data-test-id", "drawing-select"),
        attr.value(model.current),
        event.on_change(SelectDrawing),
      ],
      list.map(model.drawings, fn(entry) {
        let #(name, _) = entry

        html.option(
          [
            attr.value(name),
            attr.selected(name == model.current),
          ],
          name,
        )
      })
        |> list.append([
          html.option([attr.value("")], "+ New drawing"),
        ]),
    ),
  ])
}

// ── Show/Hide Code ─────────────────────────────────────

fn view_reveal_code(model: Model) -> Element(Msg) {
  case model.code_open {
    True -> none()

    False ->
      html.button(
        [
          attr.class("icon-btn reveal-code"),
          attr.attribute("title", "Show code"),
          event.on_click(ToggleCode),
        ],
        [html.text("⟩")],
      )
  }
}

// ── Main ───────────────────────────────────────────────

pub fn main() -> Nil {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", Nil)
  Nil
}
