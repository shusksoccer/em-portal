# Codex 繧ｿ繧ｹ繧ｯ螳御ｺ・Ο繧ｰ

縺薙・繝輔ぃ繧､繝ｫ縺ｯ **螳御ｺ・ｸ医∩ Codex 繧ｿ繧ｹ繧ｯ縺ｮ豌ｸ邯夊ｨ倬鹸** 縺ｧ縺吶・- 譁ｰ縺励＞繧ｻ繝・す繝ｧ繝ｳ繧貞ｧ九ａ繧九→縺阪√∪縺壹％縺ｮ繝輔ぃ繧､繝ｫ繧定ｪｭ繧薙〒縲御ｽ輔′貂医ｓ縺ｧ縺・ｋ縺九阪ｒ遒ｺ隱阪☆繧・- `CODEX_TASK_NOW.md` 縺ｮ繧ｿ繧ｹ繧ｯ縺悟ｮ御ｺ・＠縺溘ｉ縲√◎縺ｮ蜀・ｮｹ繧偵％縺薙↓霑ｽ險倥＠縺ｦ繧｢繝ｼ繧ｫ繧､繝悶☆繧・
---

## Batch-1・・026-03 螳御ｺ・ｼ・
**讎りｦ・ｼ・* REDESIGN_SPEC Phase 1 + Phase 3 + 霑ｽ蜉謾ｹ蝟・A-E 縺ｮ蜈ｨ螳溯｣・
| # | 繧ｿ繧ｹ繧ｯ | 蟇ｾ雎｡繝輔ぃ繧､繝ｫ |
|---|---|---|
| 1 | 繧ｳ繝ｳ繝・Φ繝・ち繧､繝怜挨繝悶Ο繝・け CSS 霑ｽ蜉・・oncept/example/exercise/caution/transcript/checkpoint/phase-badge/step-card/card-kind-* 縺ｪ縺ｩ・・| `src/app/globals.css` |
| 2 | `content-blocks.tsx` 譁ｰ隕丈ｽ懈・・・onceptBlock / ExampleBlock / ExerciseBlock / CautionBlock / TranscriptBlock / CheckpointBlock・・| `src/components/content-blocks.tsx` |
| 3 | `markdown-body.tsx` 縺ｫ `:::block` 繝代・繧ｵ繝ｼ霑ｽ蜉・・arseCustomBlocks 髢｢謨ｰ縲・繝悶Ο繝・け蟇ｾ蠢懶ｼ・| `src/components/markdown-body.tsx` |
| 4 | `glossary-card.tsx` 譁ｰ隕丈ｽ懈・・域悽譁・栢邊倶ｻ倥″繧ｫ繝ｼ繝会ｼ・| `src/components/glossary-card.tsx` |
| 5 | 繝帙・繝繝壹・繧ｸ繧偵せ繝・ャ繝励き繝ｼ繝牙ｽ｢蠑上↓謾ｹ菫ｮ・・hy 蜑企勁縲∫分蜿ｷ螟ｧ陦ｨ遉ｺ・・| `src/app/page.tsx` |
| 6 | 謗域･ｭ隧ｳ邏ｰ繝壹・繧ｸ縺ｫ繝輔ぉ繝ｼ繧ｺ繝舌ャ繧ｸ繝ｻCheckpointBlock繝ｻlesson-nav-bar 繧定ｿｽ蜉 | `src/app/curriculum/[slug]/page.tsx` |
| 7 | 逕ｨ隱樣寔荳隕ｧ繝壹・繧ｸ繧・GlossaryCard 菴ｿ逕ｨ繝ｻ迥ｶ諷九ヵ繧｣繝ｫ繧ｿ蜑企勁縺ｫ謾ｹ菫ｮ | `src/app/glossary/page.tsx` |
| 8 | `doc-card.tsx` 縺ｫ `kind` prop 霑ｽ蜉・亥ｷｦ繝懊・繝繝ｼ濶ｲ隴伜挨・・| `src/components/doc-card.tsx` |

**TypeScript 遒ｺ隱搾ｼ・* `npx tsc --noEmit` 竊・繧ｨ繝ｩ繝ｼ 0 莉ｶ

---

## Batch-2・・026-03 螳御ｺ・ｼ・
**讎りｦ・ｼ・* 繧ｰ繝ｭ繝ｼ繝舌Ν繝翫ン繧偵せ繝・・繧ｸ蜆ｪ蜈域ｧ矩縺ｫ螟画峩

| # | 繧ｿ繧ｹ繧ｯ | 蟇ｾ雎｡繝輔ぃ繧､繝ｫ |
|---|---|---|
| 1 | navItems 繧偵せ繝・・繧ｸ蜆ｪ蜈域ｧ矩縺ｫ螟画峩・育炊隗｣縺吶ｋ L1窶鏑2 / 螳溯ｷｵ縺吶ｋ L3窶鏑5 / 逋ｺ陦ｨ縺吶ｋ L6 / 蜿ら・・・| `src/app/layout.tsx` |
| 2 | `.nav-sub` CSS 霑ｽ蜉縲～.main-nav a` 繧・inline-flex 縺ｫ螟画峩 | `src/app/globals.css` |

**閭梧勹縺ｨ縺ｪ縺｣縺溽衍隴伜・邱ｨ謌蝉ｽ懈･ｭ・亥酔譎ょｮ滓命・会ｼ・*
- lessons l2縲徑6 縺ｮ `status` 繧・`published`縲～sources` 繧偵・繝ｬ繝ｼ繧ｹ繝帙Ν繝繝ｼ縺九ｉ螳溷惠 ID 縺ｫ菫ｮ豁｣
- worksheets ws-l1縲忤s-l6 縺ｮ `status`繝ｻ`sources` 繧貞酔讒倥↓菫ｮ豁｣
- 蜈ｨ30逕ｨ隱・glossary 繝輔ぃ繧､繝ｫ繧・200縲・00蟄励↓諡｡蜈・- FAQ faq-1縲・6 縺ｮ `sources`繝ｻ`status` 繧剃ｿｮ豁｣
- `WORKLOG/KNOWLEDGE_MAP.md` 譁ｰ隕丈ｽ懈・・育衍隴俶ｺ絶・驟堺ｿ｡蜈医・繝医Μ繧ｯ繧ｹ・・
**TypeScript 遒ｺ隱搾ｼ・* `npx tsc --noEmit` 竊・繧ｨ繝ｩ繝ｼ 0 莉ｶ

---

## Batch-3・域悴螳御ｺ・竊・`CODEX_TASK_NOW.md` 蜿ら・・・
**讎りｦ・ｼ・* 遏･隴倥え繧ｧ繝悶・螳梧・・・ources蜀・Κ繝ｪ繝ｳ繧ｯ / curriculum 繝輔ぉ繝ｼ繧ｺ蛻･ / 谺｡縺ｸ繧ｿ繧､繝医Ν / 逕ｨ隱櫁ｩｳ邏ｰ謨ｴ逅・/ 莠ｺ迚ｩ繝舌ャ繧ｯ繝ｪ繝ｳ繧ｯ / FAQ 繧ｹ繝・・繧ｸ蛻･ / 逕ｨ隱槭ヵ繧ｧ繝ｼ繧ｺ蛻･ / toolkit 莠ｺ迚ｩ繝ｪ繝ｳ繧ｯ・・
繧ｿ繧ｹ繧ｯ謨ｰ: 8
竊・譛ｪ螳御ｺ・ょｮ溯｣・ｾ後↓縺薙％縺ｸ遘ｻ蜍輔☆繧九・
**繧ｳ繝ｳ繝・Φ繝・・蟇ｾ蠢懶ｼ・laude 縺悟ｮ滓命貂医∩繝ｻCodex 荳崎ｦ・ｼ・**
- glossary/reflexivity.md, membership-categorization.md 竊・status: published 縺ｫ菫ｮ豁｣
- library/lib-em-ch1-9-summary.md 竊・status: published 縺ｫ菫ｮ豁｣
- people/*.md 縺ｫ used_in_lessons 繝輔ぅ繝ｼ繝ｫ繝峨ｒ霑ｽ蜉・・arfinkel/sacks/schegloff/jefferson・・
### Batch-3 completion update (2026-03-01)
Completed in this run:
- Added `people` links to lesson toolkit and quick links in `tmp-app/src/app/curriculum/[slug]/page.tsx`.
- Added people detail route with `used_in_lessons` chips in `tmp-app/src/app/people/[slug]/page.tsx`.
- Reworked FAQ top page into stage groups with `DocCard` in `tmp-app/src/app/faq/page.tsx`.
- Added FAQ detail route to resolve FAQ card links in `tmp-app/src/app/faq/[slug]/page.tsx`.
- Reworked glossary top page into phase groups in `tmp-app/src/app/glossary/page.tsx`.
- Confirmed glossary detail page already satisfied conditional summary section behavior.

Validation:
- `cd tmp-app && npx.cmd tsc --noEmit` passed (0 errors).
