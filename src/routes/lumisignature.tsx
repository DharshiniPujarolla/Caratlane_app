import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";

export const Route = createFileRoute("/lumisignature")({
  component: LumiSignature,
});

function LumiSignature() {
  const location = useLocation();

  // If we're already on /lumisignature/quiz,
  // only render the child page.
  if (location.pathname !== "/lumisignature") {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 px-6">
      <h1 className="text-5xl font-bold text-purple-700 mb-6">
        Discover Your Jewellery DNA
      </h1>

      <p className="text-lg text-center text-gray-600 max-w-xl mb-10">
        Answer 5 quick questions and discover the jewellery style that matches
        your personality.
      </p>

      <Link
        to="/lumisignature/quiz"
        className="rounded-full bg-purple-600 px-8 py-4 text-white text-lg font-semibold hover:bg-purple-700 transition"
      >
        Start Analysis
      </Link>
    </div>
  );
}