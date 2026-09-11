/**
 * `markdown-it-task-lists` ships no type definitions and none exist on
 * DefinitelyTyped. The plugin only adds a renderer rule, so a minimal
 * declaration is enough and keeps `vite/markdown.ts` fully typed.
 */
declare module 'markdown-it-task-lists' {
  import type MarkdownIt from 'markdown-it'

  interface TaskListsOptions {
    /** Add the `disabled` attribute to the rendered checkboxes. */
    enabled?: boolean
    /** Wrap the checkbox in a `<label>`. */
    label?: boolean
    /** Place the label after the checkbox rather than before it. */
    labelAfter?: boolean
  }

  const taskLists: MarkdownIt.PluginWithOptions<TaskListsOptions>
  export default taskLists
}
