export type VertexId = string;

export class Graph<T> {
	private vertexData: Map<VertexId, T>;
	private adjacencyList: Map<VertexId, Set<VertexId>>;

	constructor() {
		this.vertexData = new Map();
		this.adjacencyList = new Map();
	}

	addVertex(id: VertexId, data: T): void {
		if (this.vertexData.has(id)) {
			throw new Error(`Vertex ${id} already exists.`);
		}

		this.vertexData.set(id, data);
		this.adjacencyList.set(id, new Set());
	}

	updateVertex(id: VertexId, data: T): void {
		if (!this.vertexData.has(id)) {
			throw new Error(`Vertex ${id} doesn't exist.`);
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
		return Array.from(this.vertexData.keys());
	}

	getVertexData(id: VertexId): T | undefined {
		return this.vertexData.get(id);
	}

	getNeighbors(id: VertexId): VertexId[] {
		return Array.from(this.adjacencyList.get(id) || []);
	}

	printVertexData(): void {
		console.log(
			Array.from(this.vertexData.entries())
				.map(([key, value], idx) => `V:${key} (${idx}): ${value}`)
				.join('\n')
		);
	}

	printAdjacenyList(): void {
		console.log(
			Array.from(this.adjacencyList.entries())
				.map(([key, value], idx) => `V:${key} (${idx}): [${Array.from(value)}]`)
				.join('\n')
		);
	}

	toJSON(): string {
		const data = {
			vertices: Array.from(this.vertexData.entries()),
			edges: Array.from(this.adjacencyList.entries()).map(([v, neighbors]) => [
				v,
				Array.from(neighbors)
			])
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
