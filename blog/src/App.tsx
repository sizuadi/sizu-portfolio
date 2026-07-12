import { Routes, Route } from "react-router-dom";
import { PostList } from "./pages/PostList";
import { PostDetail } from "./pages/PostDetail";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PostList />} />
      <Route path="/post/:slug" element={<PostDetail />} />
    </Routes>
  );
}
