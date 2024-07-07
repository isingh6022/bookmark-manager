import { InvalidArgumentError } from '../../../utilities/utilities.js';
import {
  BookmarkTreeNode,
  NodeScoreData,
  NodeType,
  SearchStats,
  Search,
  SearchParams,
  BookmarkTreeDataNode
} from '@proj-types';

// Following weights are also used as identifiers also.
enum MATCH_TYPE {
  // FULL MATCHES
  // fulLtag = 0, // Not using tags currently
  fulLurl = 16,
  fulLnam = 5, // for bookmark link titles.
  fulLfol = 7, // for folder names

  // PARTIAL MATCHES
  // parTtag = 0, // Not using tags
  parTfol = 3,
  parTnam = 2,
  parTurl = 1
}

class NodeScore implements NodeScoreData {
  // fulLtag = 0;
  fulLfol = 0;
  fulLnam = 0;
  fulLurl = 0;
  // parTtag = 0;
  parTfol = 0;
  parTnam = 0;
  parTurl = 0;
  private _totalScore = 0;

  node: BookmarkTreeDataNode;

  constructor(treeNode: BookmarkTreeNode) {
    this.node = { ...treeNode.dataTree };
    this.node.children = [];
  }

  // prettier-ignore
  incScoreCount(type: MATCH_TYPE, count=1) {
    switch(type){
      // case MATCH_TYPE.fulLtag: this.fulLtag+=count; break;
      case MATCH_TYPE.fulLurl: this.fulLurl+=count; break;
      case MATCH_TYPE.fulLnam: this.fulLnam+=count; break;
      case MATCH_TYPE.fulLfol: this.fulLfol+=count; break;

      // case MATCH_TYPE.parTtag: this.parTtag+=count; break;
      case MATCH_TYPE.parTurl: this.parTurl+=count; break;
      case MATCH_TYPE.parTnam: this.parTnam+=count; break;
      case MATCH_TYPE.parTfol: this.parTfol+=count; break;
    }
    this._totalScore = 0;
  }

  get score(): number {
    return (
      this._totalScore ||
      (this._totalScore =
        // MATCH_TYPE.fulLtag * this.fulLtag +
        MATCH_TYPE.fulLurl * this.fulLurl +
        MATCH_TYPE.fulLnam * this.fulLnam +
        MATCH_TYPE.fulLfol * this.fulLfol +
        // MATCH_TYPE.parTtag * this.parTtag +
        MATCH_TYPE.parTurl * this.parTurl +
        MATCH_TYPE.parTnam * this.parTnam +
        MATCH_TYPE.parTfol * this.parTfol)
    );
  }
}

class MatchCounter {
  constructor(private _nodes = new Map<BookmarkTreeNode, number>()) {}

  add(node: BookmarkTreeNode): void {
    this._nodes.set(node, (this._nodes.get(node) ?? 0) + 1);
  }

  getAll(): [BookmarkTreeNode, number][] {
    return Array.from(this._nodes);
  }
}
class Matches {
  constructor(
    public partial = {
      fol: new MatchCounter(),
      nam: new MatchCounter(),
      url: new MatchCounter()
    },
    public complete = {
      fol: new MatchCounter(),
      nam: new MatchCounter(),
      url: new MatchCounter()
    }
  ) {}
}
export class SearchImpl implements Search {
  private _scoredNodes: NodeScore[] | null = null;
  private _match = new Matches();
  private _executed: boolean = false;

  get folId(): string {
    return this._folId;
  }
  get query(): string {
    return this._queryString;
  }
  get nodes(): BookmarkTreeNode[] {
    return this._nodes;
  }

  private _duration = 0;
  private _folId: string;
  private _queryString: string;
  private _nodes: BookmarkTreeNode[];
  private _querySeparator;

  constructor(params: SearchParams) {
    this._folId = params.folId;
    this._queryString = params.query || '';
    this._nodes = params.nodes || [];
    this._querySeparator = params.querySeparator || ',';
  }

  execute(): boolean {
    if (this._executed) return false;

    let t0 = new Date().getTime();
    this._matchNodesAndQueries();
    this._duration = new Date().getTime() - t0;

    this._executed = true;

    return true;
  }

  reset(): void {
    this._executed = false;
    this._scoredNodes = null;
  }

  private _matchNodesAndQueries(): void {
    const queries = this.query
      .split(this._querySeparator)
      .map((str) => str.trim())
      .filter((str) => str);

    for (let query of queries) {
      for (let node of this.nodes) {
        this._matchNodeAndQuery(node, query.toLowerCase());
      }
    }
  }

  private _matchNodeAndQuery(node: BookmarkTreeNode, query: string): void {
    if (!query) return;

    const url: string = node.url_lower;

    // NOTE: title lower always contains the value of lowercase title, even when the node is
    //    added to icons.
    const title: string = node.title_lower; // || this._icons.getIco(node.id)?.title_lower || '';

    const urlComp = url === query,
      titleComp = title === query;
    const urlPart = !urlComp && url.indexOf(query) !== -1,
      titlePart = !titleComp && title.indexOf(query) !== -1;

    const addMatch = (type: MATCH_TYPE) => this._addMatch(node, type);

    urlComp && addMatch(MATCH_TYPE.fulLurl);
    urlPart && addMatch(MATCH_TYPE.parTurl);

    titleComp && node.type === NodeType.FOL && addMatch(MATCH_TYPE.fulLfol);
    titleComp && node.type === NodeType.BKM && addMatch(MATCH_TYPE.fulLnam);

    titlePart && node.type === NodeType.FOL && addMatch(MATCH_TYPE.parTfol);
    titlePart && node.type === NodeType.BKM && addMatch(MATCH_TYPE.parTnam);
  }

  private _addMatch(node: BookmarkTreeNode, matchType: MATCH_TYPE) {
    // prettier-ignore
    switch(matchType){
      // case MATCH_TYPE.fulLtag: this.match.complete.tag.add(node); break;
      case MATCH_TYPE.fulLurl: this._match.complete.url.add(node); break;
      case MATCH_TYPE.fulLnam: this._match.complete.nam.add(node); break;
      case MATCH_TYPE.fulLfol: this._match.complete.fol.add(node); break;

      // case MATCH_TYPE.parTtag: this.match.partial.tag.add(node); break;
      case MATCH_TYPE.parTurl: this._match.partial.url.add(node); break;
      case MATCH_TYPE.parTnam: this._match.partial.nam.add(node); break;
      case MATCH_TYPE.parTfol: this._match.partial.fol.add(node); break;

      default:
        throw new InvalidArgumentError(SearchImpl.name, '_addMatch', 'matchType', matchType);
    }
  }

  get result(): NodeScoreData<BookmarkTreeDataNode>[] {
    this.execute();

    if (!this._scoredNodes) {
      this._scoredNodes = this._getNodesWithScores().map((el) => el[1]);
      this._scoredNodes.sort((a, b) => b.score - a.score);
    }
    return this._scoredNodes;
  }

  private _getNodesWithScores(): [string, NodeScore][] {
    const allNodes = new Map<string, NodeScore>();
    const addMatch = (node: BookmarkTreeNode, count: number, type: MATCH_TYPE) => {
      let score = allNodes.get(node.id);
      if (!score) {
        score = new NodeScore(node);
        allNodes.set(node.id, score);
      }
      score.incScoreCount(type, count);
    };

    // prettier-ignore
    {let part = this._match.partial, full = this._match.complete;
    // for(let score of part.tag.getAll()) addMatch(...score, MATCH_TYPE.parTtag);
    for(let score of part.url.getAll()) addMatch(...score, MATCH_TYPE.parTurl);
    for(let score of part.nam.getAll()) addMatch(...score, MATCH_TYPE.parTnam);
    for(let score of part.fol.getAll()) addMatch(...score, MATCH_TYPE.parTfol);
    // for(let score of full.tag.getAll()) addMatch(...score, MATCH_TYPE.fulLtag);
    for(let score of full.url.getAll()) addMatch(...score, MATCH_TYPE.fulLurl);
    for(let score of full.nam.getAll()) addMatch(...score, MATCH_TYPE.fulLnam);
    for(let score of full.fol.getAll()) addMatch(...score, MATCH_TYPE.fulLfol);}

    return Array.from(allNodes);
  }

  get stats(): SearchStats {
    let count = this._getresultCount();
    return { ...count, duration: this._duration };
  }

  private _getresultCount(): { nBkm: number; nFol: number; nBkmTotal: number; nFolTotal: number } {
    let nBkm = 0,
      nBkmTotal = 0,
      nFol = 0,
      nFolTotal = 0;
    this.execute();

    for (let scoredNode of this.result) {
      scoredNode.node.type === NodeType.BKM ? nBkm++ : nFol++;
    }
    for (let node of this.nodes) {
      node.type === NodeType.BKM ? nBkmTotal++ : nFolTotal++;
    }
    return { nBkm, nFol, nBkmTotal, nFolTotal };
  }

  isSameAs(search: { folId: string; query: string }): boolean {
    return this.query === search.query && this.folId === search.folId;
  }
}

const DEFAULT_PARAMS: SearchParams = {
  folId: '',
  query: '',
  querySeparator: ',',
  nodes: []
};
function SearchFactory(params: Partial<SearchParams> = {}): Search {
  let searchParams: SearchParams = { ...DEFAULT_PARAMS, ...params };
  return new SearchImpl(searchParams);
}

export { SearchFactory };
