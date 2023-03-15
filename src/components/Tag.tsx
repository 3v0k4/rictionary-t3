export const Tag = ({ id = "", query }: { id?: string; query: string }) => (
  <div id={id}>{query}</div>
);
