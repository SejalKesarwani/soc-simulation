import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="h-[60vh] grid place-items-center text-center">
      <div className="space-y-4">
        <div className="text-4xl font-bold">404</div>
        <div className="text-gray-300">The page you are looking for does not exist.</div>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-signal/80 hover:bg-signal text-white"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
