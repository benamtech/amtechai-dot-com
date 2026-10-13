import { useLocation } from 'react-router-dom';

// Home, /contractors and /painters are Hugo pages now (site/), served as files. A client-side link from a React
// page to one of them must load the file, not render a React copy. The path the document first loaded at is
// kept, so if the React shell is ever served at one of these paths it renders nothing rather than reloading forever.
const firstPath = window.location.pathname;

export default function ServerPage() {
  const { pathname } = useLocation();
  if (pathname !== firstPath) window.location.replace(pathname + window.location.search + window.location.hash);
  return null;
}
