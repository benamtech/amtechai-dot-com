// The app's own Tailwind theme, read over the Hugo templates instead of the React source, so a ported page gets
// the same utilities. Run from the repo root (site/tools/build.sh does).
import app from '../tailwind.config.js';
export default { ...app, content: ['./site/layouts/**/*.html', './site/assets/js/**/*.js'] };
