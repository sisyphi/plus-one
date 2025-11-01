import nilGraphJson from '$lib/data/processed/nil_graph.json';
import { Graph, type GraphJSON } from '$lib/types/Graph';

export const nilGraph: Graph<string[]> = Graph.fromJSON(nilGraphJson as GraphJSON<string[]>);
