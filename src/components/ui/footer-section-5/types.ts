/** Link model for `FooterSection5`, kept next to the component. */

export interface FooterLink {
  name: string
  /** Router target. Takes precedence over `href` when both are set. */
  to?: string
  /** Absolute URL, opened in a new tab. */
  href?: string
  /** Right-aligned aside: a count, a handle, a domain. */
  note?: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}
