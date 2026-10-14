<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Game architecture
- Mount the R3F experience on the client-only index route so WebGL never runs during SSR.
- Keep educational questions and scoring in src/lib/explorer.ts and test rules independently of scene rendering.
- Use the supplied student artwork as textured world billboards and portraits, preserving the original character identity.
- Source recognizable campus buildings and vegetation from verified CC0 Kenney kits and host assets through Lovable Assets.
