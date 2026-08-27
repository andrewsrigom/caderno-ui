export const demoProjects = [
  {
    description: 'Compare query speed, indexing delay, and recovery time.',
    href: '/demo/projects/search-indexing/',
    id: 'search-indexing',
    status: 'In review',
    title: 'Search indexing strategy',
    tone: 'blue',
  },
  {
    description: 'Prepare examples of decisions and results for interviews.',
    href: '/demo/projects/',
    id: 'story-bank',
    status: 'Ready',
    title: 'Behavioral story bank',
    tone: 'mint',
  },
  {
    description: 'Check message ordering, retries, and recovery after failure.',
    href: '/demo/projects/',
    id: 'queue-semantics',
    status: 'Planned',
    title: 'Queue semantics',
    tone: 'lemon',
  },
  {
    description: 'Review component properties, events, and bundle sizes.',
    href: '/demo/projects/',
    id: 'component-contracts',
    status: 'In review',
    title: 'Component contracts',
    tone: 'violet',
  },
] as const

export const demoNotes = [
  {
    body: 'Try the index in one workspace first. Measure indexing delay and test a rollback before expanding.',
    heading: 'Index rollout boundary',
    id: 'index-rollout',
    tag: 'Architecture',
  },
  {
    body: 'For each interview example, note the problem, what you did, and the result. Keep it to one page.',
    heading: 'Story bank rule',
    id: 'story-bank-rule',
    tag: 'Interview',
  },
  {
    body: 'Check that the example runs after copying the code into a new project.',
    heading: 'Check the examples',
    id: 'examples-contract',
    tag: 'Caderno UI',
  },
  {
    body: 'Can this task wait? If so, check how retries and duplicate messages will be handled before adding a queue.',
    heading: 'Queue decision',
    id: 'queue-decision',
    tag: 'Systems',
  },
  {
    body: 'List the queries people use most often, then compare indexes against those queries.',
    heading: 'Start with the read path',
    id: 'read-path',
    tag: 'Architecture',
  },
  {
    body: 'Try creating, finding, and editing a note on a phone. Check whether the next action is easy to find.',
    heading: 'Test in context',
    id: 'test-in-context',
    tag: 'Design system',
  },
] as const
