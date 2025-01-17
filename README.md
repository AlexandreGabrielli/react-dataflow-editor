# react-dataflow-editor

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme) [![license](https://img.shields.io/github/license/joeltg/react-dataflow-editor)](https://opensource.org/licenses/MIT) [![NPM version](https://img.shields.io/npm/v/react-dataflow-editor)](https://www.npmjs.com/package/react-dataflow-editor) ![TypeScript types](https://img.shields.io/npm/types/react-dataflow-editor) ![lines of code](https://img.shields.io/tokei/lines/github/joeltg/react-dataflow-editor)

A generic drag-and-drop dataflow editor for React.

> ✨ You can read about the design of this component in [this blog post](https://research.protocol.ai/blog/2021/designing-a-dataflow-editor-with-typescript-and-react/)!

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Demo](#demo)
- [Contributing](#contributing)

## Install

```
npm i react-dataflow-editor
```

## Usage

```typescript
import React, { useCallback } from "react"
import {
	Editor,
	EditorState,
	GetSchema,
	EditorAction,
	reduce,
} from "react-dataflow-editor"

// Define a catalog of node *kinds* in this format
const kinds = {
	add: {
		name: "Addition",
		inputs: { a: null, b: null },
		outputs: { sum: null },
		backgroundColor: "lavender",
	},
	div: {
		name: "Division",
		inputs: { dividend: null, divisor: null },
		outputs: { quotient: null, remainder: null },
		backgroundColor: "darksalmon",
	},
}

// Derive a concrete type-level schema from the kinds catalog
type S = GetSchema<typeof kinds>

interface MyEditorProps {
	state: EditorState<S>
	onChange: (state: EditorState<S>) => void
}

function MyEditor(props: MyEditorProps) {
	// The editor component takes a dispatch callback, not an onChange
	// callback like most controlled react components.
	// Use the `reduce` method to apply an action to a state.
	const dispatch = useCallback(
		(action: EditorAction<S>) => {
			props.onChange(reduce(kinds, props.state, action))
		},
		[props.onChange, props.state]
	)

	return <Editor<S> kinds={kinds} state={state} dispatch={dispatch} />
}
```

## Demo

- [Editable demo](https://joeltg.github.io/react-dataflow-editor/demo/editable.html) ([source](https://github.com/joeltg/react-dataflow-editor/blob/gh-pages/demo/editable.tsx))
- [Read-only demo](https://joeltg.github.io/react-dataflow-editor/demo/readonly.html) ([source](https://github.com/joeltg/react-dataflow-editor/blob/gh-pages/demo/readonly.tsx))

![](./static/example-action-delete-edge.gif)

## Contributing

PRs accepted!

I'm very interested in improving the real-world usability of the library. In particular I don't really know how to expose control over styling and layout in a useful way, so if you're trying to use this component I'd love to hear what kind of interface you'd like to have. Please open an issue to discuss this!

## License

MIT © 2021 Joel Gustafson
