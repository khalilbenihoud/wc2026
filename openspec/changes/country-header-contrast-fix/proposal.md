# Proposal: Country Header Contrast Fix

## What

Fix the sticky header bar on the country page where the semi-transparent background (`bg-brand-bg/80`) allows the colorful aurora gradient blobs (flag palette colors) to bleed through, creating a visually jarring contrast against the dark header.

## Why

The country page renders colorful ambient aurora gradients based on each nation's flag palette behind the content. The sticky header uses an 80% opaque background, so the bright flag-colored gradients show through, giving the header an unintended tinted appearance. This doesn't match the clean, dark header expected by the design.

## How

Change the country page sticky header from `bg-brand-bg/80 backdrop-blur-md` to fully opaque `bg-brand-bg`. The Tournament page (which also uses this pattern but has no aurora effects) is unaffected.
