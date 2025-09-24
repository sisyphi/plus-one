export type VertexId = string;

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

		while (queue.length > 0) {
			const curr = queue.shift();
			if (curr === undefined) continue;

			if (visited.has(curr)) continue;
			visited.add(curr);

			const data = this.vertexData.get(curr);
			if (data !== undefined) sub.addVertex(curr, data);

			const neighbors = this.adjacencyList.get(curr);
			if (!neighbors) continue;

			for (const n of neighbors) {
				if (!visited.has(n)) queue.push(n);
			}
		}

		for (const v of visited) {
			const neighbors = this.adjacencyList.get(v);
			if (!neighbors) continue;

			for (const n of neighbors) {
				sub.addEdge(v, n);
			}
		}

		return sub;
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
		return `V:${this.vertexData.size}, E:${this.adjacencyList.size}`;
	}

	toJSON(): string {
		const data = {
			vertices: [...this.vertexData.entries()],
			edges: [...this.adjacencyList.entries()].map(([v, neighbors]) => [v, [...neighbors]])
		};
		return JSON.stringify(data, null, 2);
	}

	static fromJSON<U>(json: string): Graph<U> {
		const parsed = JSON.parse(json);
		const graph = new Graph<U>();

		for (const [id, data] of parsed.vertices) {
			graph.addVertex(id, data);
		}
		for (const [v, neighbors] of parsed.edges) {
			for (const n of neighbors) {
				graph.addEdge(v, n);
			}
		}
		return graph;
	}
}
