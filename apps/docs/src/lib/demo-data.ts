export const demoProjects = [
  {
    description:
      'Compare index boundaries, recovery paths, and observable lag.',
    href: '/demo/projects/search-indexing/',
    id: 'search-indexing',
    status: 'In review',
    title: 'Search indexing strategy',
    tone: 'blue',
  },
  {
    description: 'Turn interview stories into concise, reusable evidence.',
    href: '/demo/projects/',
    id: 'story-bank',
    status: 'Ready',
    title: 'Behavioral story bank',
    tone: 'mint',
  },
  {
    description: 'Document ordering, retries, and failure-mode trade-offs.',
    href: '/demo/projects/',
    id: 'queue-semantics',
    status: 'Planned',
    title: 'Queue semantics',
    tone: 'lemon',
  },
  {
    description: 'Audit the public contract and the smallest useful bundles.',
    href: '/demo/projects/',
    id: 'component-contracts',
    status: 'In review',
    title: 'Component contracts',
    tone: 'violet',
  },
] as const

export const demoNotes = [
  {
    body: 'Prefer a reversible rollout. Keep the database authoritative until lag and recovery are both observable.',
    heading: 'Index rollout boundary',
    id: 'index-rollout',
    tag: 'Architecture',
  },
  {
    body: 'The strongest story is the one where the trade-off, decision, and measurable outcome fit on one page.',
    heading: 'Story bank rule',
    id: 'story-bank-rule',
    tag: 'Interview',
  },
  {
    body: 'A component example is part of the contract. It must render the same API shown in its code sample.',
    heading: 'Examples are contracts',
    id: 'examples-contract',
    tag: 'Caderno UI',
  },
  {
    body: 'Use a queue only when delayed work, retry semantics, and backpressure are product requirements—not fashion.',
    heading: 'Queue decision',
    id: 'queue-decision',
    tag: 'Systems',
  },
  {
    body: 'Ask for the expected read path before choosing an index. The query shape should lead the data structure.',
    heading: 'Start with the read path',
    id: 'read-path',
    tag: 'Architecture',
  },
  {
    body: 'The demo should feel like a real product: navigation, feedback, empty states, saved state, and responsive behavior.',
    heading: 'Test in context',
    id: 'test-in-context',
    tag: 'Design system',
  },
] as const
