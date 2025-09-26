import nilGraphJson from '$lib/data/nil_graph.json';
import { Graph, type GraphJSON } from '$lib/datatypes/Graph';

export const nilGraph: Graph<string[]> = Graph.fromJSON(nilGraphJson as GraphJSON<string[]>);
