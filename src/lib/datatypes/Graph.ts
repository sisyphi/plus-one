export type VertexId = string;
export interface GraphJSON<T> {
	vertices: [VertexId, T][];
	edges: [VertexId, VertexId[]][];
}

export class Graph<T> {
	private vertexData = new Map<VertexId, T>();
	private adjacencyList = new Map<VertexId, Set<VertexId>>();

	addVertex(id: VertexId, data: T): void {
		if (this.vertexData.has(id)) {
			throw new Error(`Vertex ${id} already exists.`);
		}

		this.vertexData.set(id, data);
		this.adjacencyList.set(id, new Set());
	}

	updateVertex(id: VertexId, data: T): void {
		if (!this.vertexData.has(id)) {
			throw new Error(`Vertex ${id} does not exist.`);
		}

		this.vertexData.set(id, data);
	}

	addEdge(from: VertexId, to: VertexId): void {
		const fromVertex = this.adjacencyList.get(from);
		const toVertex = this.adjacencyList.get(to);

		if (!fromVertex || !toVertex) {
			throw new Error(`Both vertices must exist before adding an edge.`);
		}

		fromVertex.add(to);
	}

	getVertexIds(): string[] {
		return [...this.vertexData.keys()];
	}

	getVertexData(id: VertexId): T | undefined {
		return this.vertexData.get(id);
	}

	getNeighbors(id: VertexId): VertexId[] {
		return [...(this.adjacencyList.get(id) || [])];
	}

	getSubgraph(start: VertexId): Graph<T> {
		if (!this.vertexData.has(start) || !this.adjacencyList.has(start)) {
			throw new Error(`Vertex ${start} does not exist`);
		}

		const sub = new Graph<T>();
		const visited = new Set<VertexId>();
		const queue: VertexId[] = [start];
		let idx = 0;

		while (idx < queue.length) {
			const curr = queue[idx++];

			const currData = this.vertexData.get(curr);
			if (currData !== undefined && !sub.vertexData.has(curr)) sub.addVertex(curr, currData);

			const neighbors = this.adjacencyList.get(curr);
			if (!neighbors) continue;

			for (const n of neighbors) {
				if (!visited.has(n)) {
					visited.add(n);
					queue.push(n);

					const nData = this.vertexData.get(n);
					if (nData !== undefined && !sub.vertexData.has(n)) sub.addVertex(n, nData);
				}

				sub.addEdge(curr, n);
			}
		}

		return sub;
	}

	getSubgraphVertexIds(start: VertexId): VertexId[] {
		if (!this.vertexData.has(start) || !this.adjacencyList.has(start)) {
			throw new Error(`Vertex ${start} does not exist`);
		}

		const visited = new Set<VertexId>();
		const queue: VertexId[] = [start];

		while (queue.length > 0) {
			const curr = queue.shift();
			if (curr === undefined) continue;
			if (visited.has(curr)) continue;

			visited.add(curr);

			const neighbors = this.adjacencyList.get(curr);
			if (neighbors) {
				for (const n of neighbors) {
					if (!visited.has(n)) queue.push(n);
				}
			}
		}

		return [...visited];
	}

	printVertexData(): string {
		return [...this.vertexData.entries()]
			.map(([key, value], idx) => `V:${key} (${idx}): ${value}`)
			.join('\n');
	}

	printAdjacenyList(): string {
		return [...this.adjacencyList.entries()]
			.map(([key, value], idx) => `V:${key} (${idx}): [${[...value]}]`)
			.join('\n');
	}

	printInfo(): string {
		let numConnections: number = 0;
		[...this.adjacencyList.entries()].forEach(([_, value]) => {
			numConnections += value.size;
		});
		return `V:${this.vertexData.size}, E:${numConnections}`;
	}

	toJSON(): GraphJSON<T> {
		return {
			vertices: [...this.vertexData.entries()],
			edges: [...this.adjacencyList.entries()].map(([v, neighbors]) => [v, [...neighbors]])
		};
	}

	static fromJSON<U>(input: string | GraphJSON<U>): Graph<U> {
		const data: GraphJSON<U> = typeof input === 'string' ? JSON.parse(input) : input;
		const graph = new Graph<U>();

		for (const [id, vertexData] of data.vertices) {
			graph.addVertex(id, vertexData);
		}

		for (const [v, neighbors] of data.edges) {
			for (const n of neighbors) {
				graph.addEdge(v, n);
			}
		}

		return graph;
	}
}
