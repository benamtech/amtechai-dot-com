# Article Surface Pack Spec

Every high-priority article brief should include a `surface_pack`. The pack is not decorative. It is how one insight becomes an evidence ecosystem.

## Contract

```yaml
surface_pack:
  seo:
    title: string
    meta_description: string
    canonical_slug: string
    target_queries:
      - string
  schema:
    article: true
    faq_page: true_or_false
    breadcrumbs: true
    about_entities:
      - string
    visible_claim_check: passed_or_failed
  internal_links:
    - url_or_slug: string
      anchor: string
      relationship_reason: string
  okf_projection:
    concepts:
      - string
    edges:
      - source: string
        relationship: string
        target: string
    source_notes:
      - string
  image_pack:
    hero_image_brief: string
    explanatory_diagram_brief: string
    workflow_visual_brief: string
    alt_texts:
      - string
    captions:
      - string
  pinterest_pack:
    pin_title: string
    pin_description: string
    visual_brief: string
    aspect_ratio: "2:3"
    destination_slug: string
  social_snippets:
    linkedin: string
    reddit_style_answer: string
    youtube_description: string
  future_tool_node:
    should_create: true_or_false
    tool_name: string
    inputs:
      - string
    output: string
```

## SEO Pack Rules

- Title names the actual question or mechanism.
- Meta description states the answer path, not a hype promise.
- Target queries come from fan-out and should include direct, practical, comparison, and risk variants where relevant.
- Avoid "ultimate guide", "top X tips", "what nobody tells you", "changed AI forever", and similar clickbait patterns.

## Schema Pack Rules

- Schema describes only visible content.
- FAQ schema is allowed only when the visible draft contains those questions and answers.
- `about_entities` should match the article's primary entity and important graph concepts.
- `visible_claim_check` fails if the schema promises claims absent from the article body.

## Internal Link Rules

Each internal link must include a relationship reason:

- Up to a broad workflow anchor.
- Sideways to a related entity, place, industry, or comparison.
- Down to a practical playbook, prompt guide, checklist, or tool.
- Forward to a conversion route only when the article naturally creates that next action.

## OKF Projection Rules

OKF is a projection, not the canonical source. The brief should name:

- Concepts introduced or strengthened.
- Edges the article creates.
- Source notes that help an agent verify why the concept exists.

## Image Pack Rules

- Hero image brief: clear article entity, not abstract atmosphere.
- Explanatory diagram brief: show mechanism or graph path.
- Workflow visual brief: show operator context and decision/action sequence.
- Alt text must describe the useful content of the image.
- Captions should teach, not repeat the headline.

## Social And Forum Rules

- LinkedIn can be thesis-forward.
- Reddit-style answers must be useful standalone and not disguised ads.
- YouTube descriptions should summarize the mechanism and link the article concept to a practical next step.
- Mention AMTECH only when the venue and context make it natural.

## Future Tool Node Rules

If the article teaches a repeatable process, propose a tool:

- Estimate prompt builder.
- Estimate confidence checklist.
- AI business setup checklist.
- Stripe readiness checklist.
- AI Employee readiness quiz.
- Business brain completeness score.
- Contractor follow-up planner.

The tool should have inputs, output, and the article slug it should link back to.
