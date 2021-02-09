import React, {
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react"

import { useDispatch, useSelector } from "react-redux"
import { Dispatch } from "redux"

import { useDrop } from "react-dnd"

import { select } from "d3-selection"

import * as actions from "./redux/actions.js"

import {
	EditorState,
	CanvasRef,
	Blocks,
	Node,
	Edge,
	Schema,
} from "./interfaces.js"

import { Portal, PortalProps } from "./Portal.js"

import { attachPreview } from "./preview.js"
import { updateNodes, handleResize } from "./nodes.js"
import { updateEdges } from "./edges.js"
import { CanvasContext, EditorContext, snap } from "./utils.js"
import {
	defaultBackgroundColor,
	defaultBorderColor,
	StyleContext,
} from "./styles.js"

const SVG_STYLE = `
g.node > foreignObject { overflow: visible }
g.node > g.frame circle.port { cursor: grab }
g.node > g.frame circle.port.hidden { display: none }
g.node > g.frame > g.outputs > circle.port.dragging { cursor: grabbing }

g.node:focus > g.frame > path { stroke-width: 3 }

g.edge.hidden { display: none }
g.edge > path.curve {
	stroke: gray;
	stroke-width: 6px;
	fill: none;
}

g.preview.hidden { display: none }
g.preview > path.curve {
	stroke: gray;
	stroke-width: 6px;
	fill: none;
	stroke-dasharray: 8 6;
}
g.preview > circle {
	fill: ${defaultBackgroundColor};
	stroke: ${defaultBorderColor};
	stroke-width: 4px;
}
`

export interface CanvasProps<S extends Schema> {
	blocks: Blocks<S>
	onChange: (nodes: Map<number, Node<S>>, edges: Map<number, Edge<S>>) => void
}

export function Canvas<S extends Schema>({ blocks, onChange }: CanvasProps<S>) {
	const dispatch = useDispatch<Dispatch<actions.EditorAction<S>>>()

	const nodes = useSelector(({ nodes }: EditorState<S>) => nodes)
	const edges = useSelector(({ edges }: EditorState<S>) => edges)

	const { unit, dimensions } = useContext(EditorContext)
	const [X, Y] = dimensions

	const observer = useMemo(
		() =>
			new ResizeObserver((entries) => {
				handleResize(ref, entries)
			}),
		[]
	)

	const ref = useMemo<CanvasRef<S>>(
		() => ({
			svg: select<SVGSVGElement | null, unknown>(null),
			contentDimensions: new Map(),
			canvasDimensions: [0, 0],
			unit,
			dimensions: [X, Y],
			blocks: blocks,
			nodes,
			edges,
			dispatch,
		}),
		[unit, X, Y, blocks, dispatch]
	)

	ref.nodes = nodes
	ref.edges = edges

	useEffect(() => onChange(nodes, edges), [nodes, edges])

	const svgRef = useRef<SVGSVGElement | null>(null)
	const attachSVG = useCallback((svg: SVGSVGElement) => {
		svgRef.current = svg
		ref.svg = select<SVGSVGElement | null, unknown>(svg)
		ref.svg.select<SVGGElement>("g.preview").call(attachPreview)
	}, [])

	const update = useMemo(
		() => ({ nodes: updateNodes(ref), edges: updateEdges(ref) }),
		[]
	)

	const [portals, setPortals] = useState<PortalProps<S>[]>([])

	useLayoutEffect(() => {
		const portals: PortalProps<S>[] = []
		// update.nodes().each(function (this: HTMLDivElement, { id }: Node<S>) {
		// 	portals.push({ id, container: this, blocks })
		// })
		update.nodes().each(function (this: SVGGElement, { id }: Node<S>) {
			const container = this.querySelector("foreignObject")
			if (container !== null) {
				portals.push({ id, container, blocks })
			}
		})
		setPortals(portals)
	}, [nodes])

	useLayoutEffect(() => void update.edges(), [edges, nodes])

	const height = unit * Y

	const [{}, drop] = useDrop<{ type: "block"; kind: keyof S }, void, {}>({
		accept: ["block"],
		drop({ kind }, monitor) {
			const { x, y } = monitor.getSourceClientOffset()!
			const { left, top } = svgRef.current!.getBoundingClientRect()
			const position = snap([x - left, y - top], unit, dimensions)
			dispatch(actions.createNode(kind, position))
		},
	})

	const style = useContext(StyleContext)

	const svgStyle = useMemo(() => style.getSVGStyle({ unit }), [unit])

	return (
		<CanvasContext.Provider value={{ observer }}>
			<div ref={drop} className="canvas" style={{ height }}>
				<svg
					ref={attachSVG}
					xmlns="http://www.w3.org/2000/svg"
					height={height}
					style={svgStyle}
				>
					<style>{SVG_STYLE}</style>
					<g className="edges"></g>
					<g className="nodes"></g>
					<g className="preview"></g>
					{portals.map((props) => (
						<Portal key={props.id} {...props} />
					))}
				</svg>
			</div>
		</CanvasContext.Provider>
	)
}
