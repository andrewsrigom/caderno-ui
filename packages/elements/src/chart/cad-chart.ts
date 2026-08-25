import { css, html, LitElement, nothing, svg } from 'lit'
import rough from 'roughjs'

import {
  prefersReducedMotion,
  readMotionEasing,
  readMotionTime,
} from '../internal/motion.js'
import './cad-chart-item.js'
export { CadChartItem } from './cad-chart-item.js'

export type CadChartFillStyle =
  | 'cross-hatch'
  | 'dashed'
  | 'dots'
  | 'hachure'
  | 'solid'
  | 'zigzag'
  | 'zigzag-line'

export type CadChartType = 'bar' | 'donut' | 'line'
export type CadChartAnimation = 'draw' | 'none'

type ChartDatum = {
  color: string
  label: string
  value: number
}

type Point = [number, number]

const chartWidth = 640
const chartHeight = 360
const plot = {
  bottom: 304,
  left: 62,
  right: 620,
  top: 22,
}
const fallbackColors = [
  '#5f91e8',
  '#eb8069',
  '#d7b830',
  '#4eb486',
  '#9a7bd3',
  '#cf72a4',
]
const fillStyles: CadChartFillStyle[] = [
  'cross-hatch',
  'dashed',
  'dots',
  'hachure',
  'solid',
  'zigzag',
  'zigzag-line',
]

/**
 * A responsive, accessible hand-drawn chart rendered with Rough.js.
 *
 * @slot - Declarative `cad-chart-item` data points.
 * @slot title - Visible chart title. Falls back to the `heading` attribute.
 * @csspart base - Chart container.
 * @csspart empty - Empty-state message.
 * @csspart legend - Chart legend.
 * @csspart legend-item - Individual legend entry.
 * @csspart plot - Visual SVG plot, hidden from assistive technology.
 * @csspart title - Visible chart title.
 * @cssprop --cad-chart-color-1 - First series color.
 * @cssprop --cad-chart-color-2 - Second series color.
 * @cssprop --cad-chart-color-3 - Third series color.
 * @cssprop --cad-chart-color-4 - Fourth series color.
 * @cssprop --cad-chart-color-5 - Fifth series color.
 * @cssprop --cad-chart-color-6 - Sixth series color.
 * @cssprop --cad-chart-grid - Grid line color.
 * @cssprop --cad-chart-ink - Chart foreground color.
 * @cssprop --cad-chart-paper - Chart paper color.
 */
export class CadChart extends LitElement {
  static override properties = {
    animation: { reflect: true, type: String },
    fillStyle: { attribute: 'fill-style', reflect: true, type: String },
    heading: { type: String },
    roughness: { reflect: true, type: Number },
    seed: { reflect: true, type: Number },
    showLegend: { attribute: 'show-legend', reflect: true, type: Boolean },
    showValues: { attribute: 'show-values', reflect: true, type: Boolean },
    type: { reflect: true, type: String },
    valueLabel: { attribute: 'value-label', type: String },
  }

  static override styles = css`
    :host {
      --_chart-color-1: var(--cad-chart-color-1, #5f91e8);
      --_chart-color-2: var(--cad-chart-color-2, #eb8069);
      --_chart-color-3: var(--cad-chart-color-3, #d7b830);
      --_chart-color-4: var(--cad-chart-color-4, #4eb486);
      --_chart-color-5: var(--cad-chart-color-5, #9a7bd3);
      --_chart-color-6: var(--cad-chart-color-6, #cf72a4);
      --_chart-grid: var(
        --cad-chart-grid,
        color-mix(
          in srgb,
          var(--cad-line-strong, currentColor) 62%,
          transparent
        )
      );
      --_chart-ink: var(--cad-chart-ink, var(--cad-ink, #25202a));
      --_chart-paper: var(--cad-chart-paper, var(--cad-surface, #fffdf7));
      display: block;
      min-width: 0;
      color: var(--_chart-ink);
    }

    .base {
      display: grid;
      gap: 1rem;
      margin: 0;
      min-width: 0;
      padding: 1.25rem;
      background:
        linear-gradient(var(--_chart-grid) 1px, transparent 1px) 0 1.8rem / 100%
          1.8rem,
        var(--_chart-paper);
      border: 1.5px solid var(--_chart-grid);
      border-radius: 0.65rem 0.85rem 0.7rem 0.8rem;
      box-shadow: 0 0.7rem 1.6rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.12);
    }

    .title {
      margin: 0;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-lg, 1.55rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1.05;
    }

    .title ::slotted(*) {
      margin: 0;
      font: inherit;
    }

    .plot {
      display: block;
      width: 100%;
      height: auto;
      min-height: 13rem;
      overflow: visible;
      color: var(--_chart-ink);
      font-family: var(--cad-font-ui, sans-serif);
    }

    .grid-line {
      stroke: var(--_chart-grid);
      stroke-dasharray: 5 7;
      stroke-width: 1;
    }

    .axis-label,
    .value-label {
      fill: var(--_chart-ink);
      font-size: 13px;
      text-anchor: middle;
    }

    .tick-label {
      fill: var(--_chart-ink);
      font-family: var(--cad-font-mono, monospace);
      font-size: 11px;
      opacity: 0.75;
      text-anchor: end;
    }

    .value-label {
      font-family: var(--cad-font-mono, monospace);
      font-size: 11px;
    }

    .donut-hole {
      fill: var(--_chart-paper);
      stroke: var(--_chart-grid);
      stroke-dasharray: 3 5;
      stroke-width: 1;
    }

    [data-rough] > * {
      transform-box: fill-box;
      transform-origin: center;
    }

    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 0.55rem 1rem;
      margin: 0;
      padding: 0;
      list-style: none;
      font-family: var(--cad-font-ui, sans-serif);
      font-size: 0.9rem;
    }

    .legend li {
      display: inline-flex;
      gap: 0.4rem;
      align-items: center;
    }

    .swatch {
      width: 0.8rem;
      height: 0.8rem;
      background: var(--_swatch);
      border: 1px solid var(--_chart-ink);
      border-radius: 45% 55% 50% 42%;
      transform: rotate(-4deg);
    }

    .empty {
      margin: 0;
      padding: 2rem;
      color: color-mix(in srgb, var(--_chart-ink) 72%, transparent);
      border: 1px dashed var(--_chart-grid);
      border-radius: 0.5rem;
      font-family: var(--cad-font-hand, cursive);
      text-align: center;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    slot:not([name]) {
      display: none;
    }

    @media (forced-colors: active) {
      .base,
      .empty,
      .swatch {
        border-color: CanvasText;
      }

      .swatch {
        forced-color-adjust: none;
      }
    }
  `

  declare animation: CadChartAnimation
  declare fillStyle: CadChartFillStyle
  declare heading: string
  declare roughness: number
  declare seed: number
  declare showLegend: boolean
  declare showValues: boolean
  declare type: CadChartType
  declare valueLabel: string

  private readonly dataObserver =
    typeof MutationObserver === 'undefined'
      ? undefined
      : new MutationObserver(() => this.requestUpdate())
  private drawAnimations: Animation[] = []
  private drawObserver: IntersectionObserver | undefined

  constructor() {
    super()
    this.animation = 'draw'
    this.fillStyle = 'hachure'
    this.heading = 'Chart'
    this.roughness = 1.2
    this.seed = 42
    this.showLegend = true
    this.showValues = true
    this.type = 'bar'
    this.valueLabel = 'Value'
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.dataObserver?.observe(this, {
      attributeFilter: ['color', 'label', 'value'],
      attributes: true,
      childList: true,
      subtree: true,
    })
  }

  override disconnectedCallback(): void {
    this.cancelDrawAnimations()
    this.drawObserver?.disconnect()
    this.dataObserver?.disconnect()
    super.disconnectedCallback()
  }

  /** Replays the configured draw animation without rebuilding the chart data. */
  replay(): void {
    const drawing = this.renderRoot.querySelector<SVGGElement>('[data-rough]')
    if (drawing && drawing.children.length > 0) {
      this.queueDrawingAnimation(drawing)
    }
  }

  protected override updated(): void {
    this.draw()
  }

  private get chartType(): CadChartType {
    return ['bar', 'donut', 'line'].includes(this.type) ? this.type : 'bar'
  }

  private get chartFillStyle(): CadChartFillStyle {
    return fillStyles.includes(this.fillStyle) ? this.fillStyle : 'hachure'
  }

  private get normalizedRoughness(): number {
    return Number.isFinite(this.roughness) ? Math.max(0, this.roughness) : 1.2
  }

  private get normalizedSeed(): number {
    return Number.isFinite(this.seed) ? Math.max(1, Math.round(this.seed)) : 42
  }

  private get data(): ChartDatum[] {
    return [...this.querySelectorAll('cad-chart-item')]
      .map((item) => ({
        color: item.color,
        label: item.label.trim(),
        value: Number(item.value),
      }))
      .filter((item) => item.label.length > 0 && Number.isFinite(item.value))
      .map((item) => ({ ...item, value: Math.max(0, item.value) }))
  }

  private colorFor(item: ChartDatum, index: number): string {
    if (item.color) return item.color
    const number = (index % fallbackColors.length) + 1
    return `var(--_chart-color-${number}, ${fallbackColors[index % fallbackColors.length]})`
  }

  private format(value: number): string {
    return Number.isInteger(value) ? String(value) : value.toFixed(1)
  }

  private maxValue(data: ChartDatum[]): number {
    return Math.max(1, ...data.map(({ value }) => value))
  }

  private draw(): void {
    const svgElement = this.renderRoot.querySelector<SVGSVGElement>('.plot')
    const drawing = svgElement?.querySelector<SVGGElement>('[data-rough]')
    const data = this.data
    if (!svgElement || !drawing || data.length === 0) return

    drawing.replaceChildren()
    const roughSvg = rough.svg(svgElement)
    if (this.chartType === 'donut') this.drawDonut(roughSvg, drawing, data)
    else if (this.chartType === 'line') this.drawLine(roughSvg, drawing, data)
    else this.drawBars(roughSvg, drawing, data)
    this.queueDrawingAnimation(drawing)
  }

  private queueDrawingAnimation(drawing: SVGGElement): void {
    this.cancelDrawAnimations()
    this.drawObserver?.disconnect()
    this.drawObserver = undefined
    if (this.animation === 'none' || prefersReducedMotion()) return

    if (typeof IntersectionObserver === 'undefined') {
      this.animateDrawing(drawing)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        if (this.drawObserver === observer) this.drawObserver = undefined
        this.animateDrawing(drawing)
      },
      { threshold: 0.16 },
    )
    this.drawObserver = observer
    observer.observe(this)
  }

  private animateDrawing(drawing: SVGGElement): void {
    if (this.animation === 'none' || prefersReducedMotion()) return
    if (typeof drawing.animate !== 'function') return

    const marks = [...drawing.children].filter(
      (element): element is SVGGraphicsElement =>
        element instanceof SVGGraphicsElement,
    )
    const duration = readMotionTime(this, '--cad-motion-duration-enter', 420)
    const stagger = readMotionTime(this, '--cad-motion-stagger', 60)
    const easing = readMotionEasing(
      this,
      '--cad-motion-ease-enter',
      'cubic-bezier(0.16, 1, 0.3, 1)',
    )

    marks.forEach((mark, index) => {
      if (typeof mark.animate !== 'function') return
      const animation = mark.animate(this.markKeyframes(index), {
        delay: index * stagger,
        duration,
        easing,
        fill: 'both',
      })
      this.trackDrawAnimation(animation)
    })

    const supportingElements = [
      ...this.renderRoot.querySelectorAll<SVGGraphicsElement>(
        '.axis-label, .value-label',
      ),
      ...this.renderRoot.querySelectorAll<HTMLElement>('.legend li'),
    ]
    supportingElements.forEach((element, index) => {
      if (typeof element.animate !== 'function') return
      const animation = element.animate(
        [
          { opacity: 0, transform: 'translateY(0.25rem)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        {
          delay: Math.min(marks.length, 3) * stagger + index * stagger * 0.35,
          duration: Math.max(160, duration * 0.7),
          easing,
          fill: 'both',
        },
      )
      this.trackDrawAnimation(animation)
    })
  }

  private markKeyframes(index: number): Keyframe[] {
    if (this.chartType === 'bar') {
      return [
        {
          opacity: 0,
          transform: 'translateY(0.4rem) scaleY(0.04)',
          transformOrigin: 'center bottom',
        },
        {
          opacity: 1,
          transform: 'translateY(0) scaleY(1)',
          transformOrigin: 'center bottom',
        },
      ]
    }

    if (this.chartType === 'line') {
      return index === 0
        ? [
            {
              opacity: 0,
              transform: 'scaleX(0.02)',
              transformOrigin: 'left center',
            },
            {
              opacity: 1,
              transform: 'scaleX(1)',
              transformOrigin: 'left center',
            },
          ]
        : [
            { opacity: 0, transform: 'scale(0.35) rotate(-8deg)' },
            { opacity: 1, transform: 'scale(1) rotate(0)' },
          ]
    }

    return [
      { opacity: 0, transform: 'scale(0.82) rotate(-7deg)' },
      { opacity: 1, transform: 'scale(1) rotate(0)' },
    ]
  }

  private trackDrawAnimation(animation: Animation): void {
    this.drawAnimations.push(animation)
    void animation.finished
      .then(() => {
        animation.cancel()
        this.drawAnimations = this.drawAnimations.filter(
          (candidate) => candidate !== animation,
        )
      })
      .catch(() => undefined)
  }

  private cancelDrawAnimations(): void {
    for (const animation of this.drawAnimations) animation.cancel()
    this.drawAnimations = []
  }

  private options(item: ChartDatum, index: number) {
    return {
      fill: this.colorFor(item, index),
      fillStyle: this.chartFillStyle,
      fillWeight: 1.25,
      hachureGap: 5,
      roughness: this.normalizedRoughness,
      seed: this.normalizedSeed + index,
      stroke: 'var(--_chart-ink)',
      strokeWidth: 1.6,
    }
  }

  private drawBars(
    roughSvg: ReturnType<typeof rough.svg>,
    drawing: SVGGElement,
    data: ChartDatum[],
  ): void {
    const width = plot.right - plot.left
    const column = width / data.length
    const barWidth = Math.min(72, column * 0.62)
    const maximum = this.maxValue(data)

    data.forEach((item, index) => {
      const height = ((plot.bottom - plot.top) * item.value) / maximum
      drawing.append(
        roughSvg.rectangle(
          plot.left + column * index + (column - barWidth) / 2,
          plot.bottom - height,
          barWidth,
          height,
          this.options(item, index),
        ),
      )
    })
  }

  private drawLine(
    roughSvg: ReturnType<typeof rough.svg>,
    drawing: SVGGElement,
    data: ChartDatum[],
  ): void {
    const maximum = this.maxValue(data)
    const width = plot.right - plot.left
    const points: Point[] = data.map((item, index) => [
      data.length === 1
        ? plot.left + width / 2
        : plot.left + (width * index) / (data.length - 1),
      plot.bottom - ((plot.bottom - plot.top) * item.value) / maximum,
    ])

    if (points.length > 1) {
      drawing.append(
        roughSvg.linearPath(points, {
          bowing: 1.2,
          roughness: this.normalizedRoughness,
          seed: this.normalizedSeed,
          stroke: 'var(--_chart-ink)',
          strokeWidth: 2.4,
        }),
      )
    }
    points.forEach(([x, y], index) => {
      const item = data[index]
      if (!item) return
      drawing.append(roughSvg.circle(x, y, 15, this.options(item, index)))
    })
  }

  private drawDonut(
    roughSvg: ReturnType<typeof rough.svg>,
    drawing: SVGGElement,
    data: ChartDatum[],
  ): void {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    if (total <= 0) return
    const centerX = chartWidth / 2
    const centerY = chartHeight / 2 + 6
    const diameter = 250
    let start = -Math.PI / 2

    data.forEach((item, index) => {
      const end = start + (item.value / total) * Math.PI * 2
      drawing.append(
        roughSvg.arc(
          centerX,
          centerY,
          diameter,
          diameter,
          start,
          end,
          true,
          this.options(item, index),
        ),
      )
      start = end
    })
  }

  private renderGrid(data: ChartDatum[]) {
    if (this.chartType === 'donut') return nothing
    const maximum = this.maxValue(data)
    return [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
      const y = plot.bottom - (plot.bottom - plot.top) * ratio
      return svg`
        <line class="grid-line" x1=${plot.left} x2=${plot.right} y1=${y} y2=${y}></line>
        <text class="tick-label" x=${plot.left - 10} y=${y + 4}>${this.format(maximum * ratio)}</text>
      `
    })
  }

  private renderLabels(data: ChartDatum[]) {
    if (this.chartType === 'donut') return nothing
    const width = plot.right - plot.left
    const maximum = this.maxValue(data)
    return data.map((item, index) => {
      const x =
        this.chartType === 'bar'
          ? plot.left + (width / data.length) * (index + 0.5)
          : data.length === 1
            ? plot.left + width / 2
            : plot.left + (width * index) / (data.length - 1)
      const y = plot.bottom - ((plot.bottom - plot.top) * item.value) / maximum
      const label =
        item.label.length > 12 ? `${item.label.slice(0, 11)}…` : item.label
      return svg`
        <text class="axis-label" x=${x} y=${plot.bottom + 28}>${label}</text>
        ${
          this.showValues
            ? svg`<text class="value-label" x=${x} y=${Math.max(plot.top + 11, y - 10)}>${this.format(item.value)}</text>`
            : nothing
        }
      `
    })
  }

  override render() {
    const data = this.data

    return html`
      <figure aria-labelledby="chart-title" class="base" part="base">
        <div class="title" id="chart-title" part="title">
          <slot name="title"><strong>${this.heading}</strong></slot>
        </div>
        ${
          data.length === 0
            ? html`
                <p class="empty" part="empty">
                  Add at least one <code>cad-chart-item</code>.
                </p>
              `
            : html`
                <svg
                  aria-hidden="true"
                  class="plot"
                  part="plot"
                  role="presentation"
                  viewBox="0 0 ${chartWidth} ${chartHeight}"
                >
                  ${this.renderGrid(data)}
                  <g data-rough></g>
                  ${
                    this.chartType === 'donut'
                      ? svg`<circle class="donut-hole" cx=${chartWidth / 2} cy=${chartHeight / 2 + 6} r="58"></circle>`
                      : nothing
                  }
                  ${this.renderLabels(data)}
                </svg>
                ${
                  this.showLegend
                    ? html`
                        <ul class="legend" part="legend">
                          ${data.map(
                            (item, index) => html`
                              <li part="legend-item">
                                <span
                                  aria-hidden="true"
                                  class="swatch"
                                  style=${`--_swatch: ${this.colorFor(item, index)}`}
                                ></span>
                                <span
                                  >${item.label}:
                                  ${this.format(item.value)}</span
                                >
                              </li>
                            `,
                          )}
                        </ul>
                      `
                    : null
                }
                <table aria-labelledby="chart-title" class="sr-only">
                  <caption>
                    ${this.heading}
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Label</th>
                      <th scope="col">${this.valueLabel}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${data.map(
                      (item) => html`
                        <tr>
                          <th scope="row">${item.label}</th>
                          <td>${this.format(item.value)}</td>
                        </tr>
                      `,
                    )}
                  </tbody>
                </table>
              `
        }
        <slot @slotchange=${this.handleDataChange}></slot>
      </figure>
    `
  }

  private handleDataChange(): void {
    this.requestUpdate()
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-chart')) {
  customElements.define('cad-chart', CadChart)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-chart': CadChart
  }
}
